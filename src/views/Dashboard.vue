<template>
    <div class="dashboard-container">
        <h1 class="dashboard-title">{{ $t('home.modify.title') }}</h1>
        <div class="form-wrapper">
            <el-form ref="FormRef" :model="form" :rules="rules" status-icon label-width="auto" class="custom-form">            
                <el-form-item :label="$t('home.modify.prefix')" prop="prefix" class="inputItem">
                    <el-input v-model="form.prefix" :placeholder="$t('home.modify.prefix_placeholder')" clearable>
                        <template #prefix><el-icon><i-ep-edit /></el-icon></template>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('home.modify.suffix')" prop="suffix" class="inputItem">
                    <el-input v-model="form.suffix" :placeholder="$t('home.modify.suffix_placeholder')" clearable>
                        <template #prefix><el-icon><i-ep-edit /></el-icon></template>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('home.modify.type')" prop="selectedFileTypes" class="inputItem">
                    <el-select 
                        v-model="form.selectedFileTypes"
                        multiple 
                        :placeholder="$t('home.modify.type_placeholder')" 
                        placement="right-end"
                        clearable
                        allow-create 
                        filterable 
                        :reserve-keyword="false"
                        default-first-option>
                        <template #prefix><el-icon><i-ep-files /></el-icon></template>
                        <el-option
                            v-for="item in fileTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('home.modify.method')" prop="method" class="inputItem">
                    <el-cascader 
                        :options="options" 
                        v-model="form.method" 
                        :show-all-levels="false" 
                        :props="props" 
                        clearable 
                        :placeholder="$t('home.modify.method_ph')"/>   
                </el-form-item>
                <el-form-item class="inputItem button-group">
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
import type { Form} from '../types/Dashboard'
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
const form:Form = reactive({
  prefix: '',
  suffix: '',
  method: '',
  selectedFileTypes: [], // 选择的文件类型
})
const fileTypeOptions = [
  { value: '.txt', label: '.txt' },
  { value: '.jpg', label: '.jpg' },
  { value: '.png', label: '.png' },
  { value: '.docx', label: '.docx' },
  { value: '.xlsx', label: '.xlsx' },
  // 可以根据需要添加更多选项
]
// 自定义校验函数，确保输入的每个变量都以点开头
function validateFileType(rule:any, value:any, callback:any) {
    if (!value.every((v: string) => v.startsWith('.'))) {
        callback(new Error(t('home.modify.validateError')));
    } else {
        callback();
    }
}
const rules = {
    method: [
        { required: true, message: t('home.modify.method_ph'), trigger: 'change' }
    ],
    selectedFileTypes: [
        { validator: validateFileType, trigger: 'change' }
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
        const result:FileSelectionResult = await window.electronAPI.OpenFileDialog(rawForm);
        switch (result.status) {
        case OperationResult.Success:
          ElMessage({
            showClose: true,
            message: t('home.modify.finish'),
            type: 'success',
          });
          isOperationSuccessful.value = true;
          selectedPath.value = result.path; // 将路径赋值给selectedPath
          break;
        case OperationResult.Failure:
        ElMessage({
            showClose: true,
            message: t('home.modify.error'),
            type: 'error',
          });
          break;
        case OperationResult.Cancelled:
            ElMessage({
                showClose: true,
                message: t('home.modify.cancel'),
                type: 'warning',
            });
          break;
        default:
            ElMessage({
                showClose: true,
                message: t('home.modify.unknown'),
                type: 'error',
            });
      }
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
.dashboard-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.dashboard-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 30px;
  position: relative;
  padding-bottom: 12px;
  text-align: center;
}

.dashboard-title::after {
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

.inputItem {
  width: 100%;
  margin-top: 20px;
}

.inputItem :deep(.el-form-item__label) {
  font-size: 15px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  padding-right: 15px;
}

.inputItem :deep(.el-input__wrapper),
.inputItem :deep(.el-select__wrapper),
.inputItem :deep(.el-cascader__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  padding: 2px 12px;
  transition: all 0.3s;
}

.inputItem :deep(.el-input__wrapper:hover),
.inputItem :deep(.el-select__wrapper:hover),
.inputItem :deep(.el-cascader__wrapper:hover) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.inputItem :deep(.el-input__wrapper:focus-within),
.inputItem :deep(.el-select__wrapper:focus-within),
.inputItem :deep(.el-cascader__wrapper:focus-within) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

.inputItem :deep(.el-input__inner),
.inputItem :deep(.el-select__inner),
.inputItem :deep(.el-cascader__inner) {
  font-size: 14px;
  height: 40px;
}

.inputItem :deep(.el-input__prefix-inner) {
  color: var(--el-color-primary);
  margin-right: 8px;
}

.centered-items {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 15px;
  margin-top: 10px;
}

.button-group {
  margin-top: 35px;
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

.el-cascader {
  width: 100%;
}

.el-form-item {
  margin-bottom: 25px;
}
</style>
