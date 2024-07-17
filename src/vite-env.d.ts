/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  // expose in the `electron/preload/index.ts`
  ipcRenderer: import('electron').IpcRenderer
  electronEnv: {
    BASE_URL: string,
    IS_PROD_ENV: boolean,
    VERSION: string
  }
  electronAPI: {
    OpenFileDialog: (form: import('./types/Dashboard').Form) => Promise<import('../electron/main/index').FileSelectionResult>
    showItemInFolder: (path: string) => void
    setTheme: (mode: 'light' | 'dark' | 'system') => Promise<void>
    quit: () => void
    openDevTools: () => void
  }
}