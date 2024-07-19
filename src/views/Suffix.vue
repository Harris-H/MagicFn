<template>
    <div>
        <h1>修改文件类型</h1>
        <el-form ref="FormRef" :model="form" :rules="rules" status-icon label-width="auto" style="max-width: 600px">            
            <el-row :gutter="20" class="width: 500px;">
                <el-col :span="24">
                    <el-row :gutter="10">
                        <el-col :span="9">
                            <el-form-item :label="$t('home.modify.type')" prop="fromSuffix" class="no-margin-right">
                                <div style="display: flex; align-items: center;"> <!-- 使用Flex布局 -->
                                <el-tooltip content="请输入类型如:.txt" placement="top">
                                    <el-icon style="font-size: 14px; margin-right: 8px;"> <!-- 调整图标样式并添加右边距 -->
                                    <i-ep-info-filled />
                                    </el-icon>
                                </el-tooltip>
                                <el-input v-model="form.fromSuffix" clearable></el-input>
                                </div>
                            </el-form-item>
                            </el-col>
                    <el-col :span="2" style="text-align: center; line-height: 36px;">
                        ->
                    </el-col>
                    <el-col :span="5">
                        <el-form-item prop="toSuffix">
                        <el-input v-model="form.toSuffix" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    </el-row>
                </el-col>
                </el-row>
            <el-row :gutter="20" class="width: 500px;">
            <el-col :span="24">
                <el-form-item :label="$t('home.modify.method')" prop="method" class="inputItem">
                <el-cascader :options="options" v-model="form.method" :show-all-levels="false" :props="props" clearable :placeholder="$t('home.modify.method_ph')"/>   
                </el-form-item>
            </el-col>
            </el-row>
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
.no-margin-right .el-form-item__label {
    padding: 0px !important;
}
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
