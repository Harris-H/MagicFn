<template>
    <div>
        <h1> {{ $t('about.title') }}</h1>
        <el-row align="middle" justify="space-around">
          <el-col :span="8">
            <div style="text-align: left;">
              {{ $t('about.themeTittle') }}
            </div>
          </el-col>
          <el-col :span="16">
            <div style="text-align: right;">
              <el-radio-group v-model="mode" @change="changeModel">
                <el-radio-button :label="$t('about.theme.light')" value="light" />
                <el-radio-button :label="$t('about.theme.dark')" value="dark" />
                <el-radio-button :label="$t('about.theme.system')" value="system" />
              </el-radio-group>
            </div>
          </el-col>
        </el-row>
        <el-row align="middle" justify="space-around" style="margin-top: 20px;">
          <el-col :span="8">
            <div style="text-align: left;">
              {{ $t('about.langTittle') }}
            </div>
          </el-col>
          <el-col :span="16">
            <div style="text-align: right;">
              <el-select v-model="language" :placeholder="$t('please-choose')" style="width: 100px;" @change="changeLanguage">
                <el-option :label="$t('about.lang.zh_CN')" value="zh" />
                <el-option :label="$t('about.lang.en_US')" value="en" />
              </el-select>
            </div>
          </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useColorMode } from "@vueuse/core";
import { ref } from 'vue';
const mode = useColorMode({
  // 如果模式为auto也需要回显回auto
  emitAuto: true,
  // 默认模式先默认auto,后续通过Electorn拿到当前App主题
  initialValue: "auto",
});
const i18n = useI18n()
// 计算属性获取i18n的值
const language = ref(i18n.locale.value)
const changeModel = (mode: any) => {
    window.electronAPI.setTheme(mode === "auto" ? "system" : mode)
    // Electorn的主题模式 auto 为 system 所以需要转换
  };
// 添加切换语言的方法
const changeLanguage = (value: string) => {
  i18n.locale.value = value;
};  
</script>

<style scoped>
</style>