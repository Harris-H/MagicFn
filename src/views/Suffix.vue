<template>
    <div class="suffix-container">
        <h1 class="suffix-title">修改文件类型</h1>
        <div class="form-wrapper">
            <el-form ref="FormRef" :model="form" :rules="rules" status-icon label-width="auto" class="custom-form">            
                <el-row :gutter="20">
                    <el-col :span="24">
                        <div class="conversion-container">
                            <el-row :gutter="10" class="conversion-row">
                                <el-col :span="10">
                                    <el-form-item :label="$t('home.modify.type')" prop="fromSuffix" class="no-margin-right">
                                        <div class="input-with-icon">
                                            <el-tooltip content="请输入类型如:.txt" placement="top">
                                                <el-icon class="info-icon"><i-ep-info-filled /></el-icon>
                                            </el-tooltip>
                                            <el-input 
                                                v-model="form.fromSuffix" 
                                                clearable 
                                                placeholder="原文件类型"
                                                prefix-icon="i-ep-document">
                                            </el-input>
                                        </div>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4" class="arrow-col">
                                    <div class="arrow-container">
                                        <el-icon class="arrow-icon"><i-ep-right /></el-icon>
                                    </div>
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item prop="toSuffix">
                                        <el-input 
                                            v-model="form.toSuffix" 
                                            clearable 
                                            placeholder="目标文件类型"
                                            prefix-icon="i-ep-document-checked">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item :label="$t('home.modify.method')" prop="method" class="method-item">
                            <el-cascader 
                                :options="options" 
                                v-model="form.method" 
                                :show-all-levels="false" 
                                :props="props" 
                                clearable 
                                :placeholder="$t('home.modify.method_ph')"
                                class="method-cascader"/>   
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item class="button-group">
                    <div class="centered-items">
                        <el-button type="primary" id="btn" @click="openFileDialog(FormRef)" class="action-button">
                            <el-icon><i-ep-upload /></el-icon>
                            {{ $t('button.submit') }}
                        </el-button>
                        <el-button @click="resetForm(FormRef)" class="action-button">
                            <el-icon><i-ep-refresh /></el-icon>
                            {{ $t('button.reset') }}
                        </el-button>
                        <el-button type="success" v-if="isOperationSuccessful" @click="viewResults" class="action-button">
                            <el-icon><i-ep-view /></el-icon>
                            {{ $t('home.modify.viewResults') }}
                        </el-button>
                    </div>  
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
// do not use same name with ref
import { FormInstance } from 'element-plus';
import type { SuffixForm} from '../types/Suffix'
import i18n from '../locales';
const { t } = i18n.global
enum OperationResult {
  Success = 0,
  Failure = 1,
  Cancelled = 2
}
interface FileSelectionResult {
  path: string;
  status: OperationResult;
}
const FormRef = ref<FormInstance>()
const form:SuffixForm = reactive({
  fromSuffix: '',
  toSuffix: '',
  method: '',
})
const rules = {
    method: [
        { required: true, message: t('home.modify.method_ph'), trigger: 'change' }
    ],
    // 其他校验规则
};
const props = {
    emitPath: false as const,
    expandTrigger: 'hover' as const,
}
const options = [
    {
        value: 'file',
        label: t('home.modify.file'),
    },
    {
        value: 'folder',
        label: t('home.modify.folder'),
        children: [
            {
                value: 'Recursion',
                label: t('home.modify.Recursion'),
            },
            {
                value: 'NotRecursion',
                label: t('home.modify.NotRecursion'),
            }
        ]
    }
]
const selectedPath = ref(""); // 定义一个ref来存储选中的路径
// 查看结果的方法
const viewResults = () => {
    window.electronAPI.showItemInFolder(selectedPath.value);
    // window.electronAPI.showItemInFolder("D:\\Downloads\\Chrome Downloads\\test123");
};
// 假设的状态标志，表示操作是否成功
const isOperationSuccessful = ref(false);
async function openFileDialog(formEl: FormInstance | undefined) {
    if (!formEl) return
    formEl.validate(async (valid: boolean) => {
    if (valid) {
        const rawForm = toRaw(form);
    //     const result:FileSelectionResult = await window.electronAPI.OpenFileDialog(rawForm);
    //     switch (result.status) {
    //     case OperationResult.Success:
    //       ElMessage({
    //         showClose: true,
    //         message: t('home.modify.finish'),
    //         type: 'success',
    //       });
    //       isOperationSuccessful.value = true;
    //       selectedPath.value = result.path; // 将路径赋值给selectedPath
    //       break;
    //     case OperationResult.Failure:
    //     ElMessage({
    //         showClose: true,
    //         message: t('home.modify.error'),
    //         type: 'error',
    //       });
    //       break;
    //     case OperationResult.Cancelled:
    //         ElMessage({
    //             showClose: true,
    //             message: t('home.modify.cancel'),
    //             type: 'warning',
    //         });
    //       break;
    //     default:
    //         ElMessage({
    //             showClose: true,
    //             message: t('home.modify.unknown'),
    //             type: 'error',
    //         });
    //   }
    } else {
            // 如果表单验证失败，可以在这里处理，例如显示一个错误消息
            ElMessage({
            showClose: true,
            message: t('home.modify.checkError'),
            type: 'error',
          });
    }
  })
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  isOperationSuccessful.value = false;
}
</script>

<style scoped>
.suffix-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.suffix-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 30px;
  position: relative;
  padding-bottom: 12px;
  text-align: center;
}

.suffix-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: var(--el-color-primary);
  border-radius: 3px;
}

.form-wrapper {
  display: flex;
  justify-content: center;
}

.custom-form {
  background-color: var(--el-bg-color);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 600px;
  transition: all 0.3s ease;
}

.custom-form:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.conversion-container {
  background-color: var(--el-fill-color-light);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.conversion-container:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.conversion-row {
  display: flex;
  align-items: center;
}

.arrow-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.arrow-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
}

.arrow-icon {
  font-size: 24px;
  color: var(--el-color-primary);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.input-with-icon {
  display: flex;
  align-items: center;
}

.info-icon {
  margin-right: 8px;
  color: var(--el-color-info);
  font-size: 16px;
  cursor: pointer;
}

.no-margin-right .el-form-item__label {
  padding: 0 12px 0 0 !important;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.method-item {
  margin-top: 10px;
}

.method-item :deep(.el-form-item__label) {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.method-cascader {
  width: 100%;
}

.button-group {
  margin-top: 30px;
}

.centered-items {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 15px;
}

.action-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.el-input__wrapper),
:deep(.el-cascader__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  padding: 2px 12px;
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover),
:deep(.el-cascader__wrapper:hover) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

:deep(.el-input__wrapper:focus-within),
:deep(.el-cascader__wrapper:focus-within) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

:deep(.el-input__prefix-inner) {
  color: var(--el-color-primary);
  margin-right: 8px;
}
</style>
