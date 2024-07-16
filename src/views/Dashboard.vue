<template>
    <div>
        <h1>{{ $t('home.modify.title') }}</h1>
        <el-form ref="FormRef" :model="form" :rules="rules" status-icon label-width="auto" style="max-width: 600px">            
            <el-form-item :label="$t('home.modify.prefix')" prop="prefix" class="inputItem">
                <el-input v-model="form.prefix"  :placeholder="$t('home.modify.prefix_placeholder')" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('home.modify.suffix')" prop="suffix" class="inputItem">
                 <el-input v-model="form.suffix" :placeholder="$t('home.modify.suffix_placeholder')" clearable></el-input>
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
                    <el-option
                        v-for="item in fileTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('home.modify.method')" prop="method" class="inputItem">
            <el-cascader :options="options" v-model="form.method" :show-all-levels="false" :props="props" clearable :placeholder="$t('home.modify.method_ph')"/>   
            </el-form-item>
            <!-- <el-form-item v-model="form.method">
            <el-radio-group v-model="form.method">
                <el-radio value="file">文件</el-radio>
                <el-radio value="folder">文件夹</el-radio>
            </el-radio-group>
            </el-form-item> -->
            <el-form-item class="inputItem">
                <div class="centered-items">
                <el-button type="primary" id="btn" @click="openFileDialog(FormRef)">{{ $t('button.submit') }}</el-button>
                <el-button @click="resetForm(FormRef)">{{ $t('button.reset') }}</el-button>
                <el-button type="success" v-if="isOperationSuccessful" @click="viewResults">{{ $t('home.modify.viewResults') }}</el-button>
                </div>  
            </el-form-item>
        </el-form>
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
.inputItem{
    width: 350px;
    margin-top: 20px;
}
.centered-items {
  display: flex;
  justify-content: center;
  width: 100%;
}
.el-cascader {
  width: 100%;
}
</style>
