import { app, BrowserWindow, shell, ipcMain, dialog, OpenDialogOptions } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import {Form} from '../../src/types/Dashboard'
const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) { // #298
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  //shell.showItemInFolder('D:\\elevoc_dnn_kernel.log')
  //shell.showItemInFolder('D:\\IDE')
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}
export enum OperationResult {
  Success = 0,
  Failure = 1,
  Cancelled = 2
}
export interface FileSelectionResult {
  path: string;
  status: OperationResult;
}
function renameContents(directoryPath: string, form: Form): Promise<OperationResult> {
  return fs.promises.readdir(directoryPath, { withFileTypes: true }).then(dirents => {
    const renamePromises = dirents.map(dirent => {
      const fullPath = path.join(directoryPath, dirent.name);
      if (dirent.isDirectory()) {
        return renameContents(fullPath, form);
      } else {
        const extname = path.extname(fullPath);
        if (!form.selectedFileTypes.includes(extname)) {
          // 如果不包含，则跳过此文件
          return Promise.resolve();
        }
        const basename = path.basename(fullPath, extname);
        const newFileName = `${form.prefix}${basename}${form.suffix}${extname}`;
        const newFilePath = path.join(directoryPath, newFileName);
        return fs.promises.rename(fullPath, newFilePath);
      }
    });
    return Promise.all(renamePromises)
      .then(() => OperationResult.Success)
      .catch(() => OperationResult.Failure);
  }).catch(() => OperationResult.Failure);
}

function handleOpenFileDialog(event: Electron.IpcMainEvent, form: Form): Promise<FileSelectionResult> {
  let options: OpenDialogOptions;
  if (form.method === "file") {
    options = { properties: ['openFile', 'multiSelections'] };
  } else { // 针对文件夹的情况
    options = { properties: ['openDirectory', 'multiSelections'] };
  }
  return dialog.showOpenDialog(options).then(result => {
    if (!result.canceled && result.filePaths) {
      if (form.method === "file") {
        // 如果 selectedFileTypes 是空，就使用原始 filePaths；否则，过滤 filePaths
        const filePathsToProcess = form.selectedFileTypes && form.selectedFileTypes.length > 0
        ? result.filePaths.filter(filePath => {
            const extname = path.extname(filePath);
            return form.selectedFileTypes.includes(extname);
          })
        : result.filePaths;
        // 使用 Promise.all 来处理所有的重命名操作
        const renamePromises = filePathsToProcess.map(filePath => {
          const dirname = path.dirname(filePath);
          const extname = path.extname(filePath);
          const basename = path.basename(filePath, extname);
          const newFileName = `${form.prefix}${basename}${form.suffix}${extname}`;
          const newFilePath = path.join(dirname, newFileName);

          // 将 fs.rename 转换为返回 Promise 的形式
          return new Promise((resolve, reject) => {
            fs.rename(filePath, newFilePath, (err) => {
              if (err) {
                console.error(err);
                reject(err);
              } else {
                console.log(`File renamed to ${newFilePath}`);
                resolve(newFilePath);
              }
            });
          });
        });

        // 等待所有重命名操作完成
        return Promise.all(renamePromises)
        .then((newFilePaths:string[]) => {
          // 所有文件重命名成功，返回成功状态和第一个文件路径
          return { status: OperationResult.Success, path: newFilePaths[0] };
        })
        .catch(() => {
          // 至少一个文件重命名失败，返回失败状态和第一个文件路径
          return { status: OperationResult.Failure, path: filePathsToProcess[0] };
        });
      }
      else if(form.method === "Recursion"){
        // 针对文件夹的情况，使用renameContents函数
        const renameFolderPromises = result.filePaths.map(folderPath => {
          return renameContents(folderPath, form);
        });
      
        // 等待所有文件夹重命名操作完成
        return Promise.all(renameFolderPromises)
        .then(() => {
          // 所有文件重命名成功，返回成功状态和第一个文件路径
          return { status: OperationResult.Success, path: result.filePaths[0] };
        })
        .catch(() => {
          // 至少一个文件重命名失败，返回失败状态和第一个文件路径
          return { status: OperationResult.Failure, path: result.filePaths[0] };
        });
      }else {
        
      }
    }
    else {
      return { status: OperationResult.Cancelled, path: '' };// 用户取消选择
    }
  }).catch(() => {
    // 至少一个文件重命名失败，返回失败状态和第一个文件路径
    return { status: OperationResult.Failure, path: ''};
  });
}
function FunShowInFolder(event: Electron.IpcMainEvent, path: string): void {
  shell.showItemInFolder(path);
}

app.whenReady().then(() => {
  ipcMain.handle('dialog:open-file-dialog', handleOpenFileDialog)
  ipcMain.on('show-item-in-folder', FunShowInFolder)
  createWindow()
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
