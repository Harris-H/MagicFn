<template>
    <div class="about-container">
      <h1 class="settings-title">{{ $t('about.title') }}</h1>
      <el-card class="settings-card">
        <!-- 主题设置 -->
        <div class="settings-section">
          <div class="settings-icon">
            <el-icon class="icon-circle"><i-ep-moon /></el-icon>
          </div>
          <div class="settings-content">
            <el-row align="middle" justify="space-between">
              <el-col :span="12">
                <div class="setting-label">
                  {{ $t('about.themeTittle') }}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="setting-control">
                  <el-radio-group v-model="mode" @change="changeModel" size="large">
                    <el-radio-button :label="$t('about.theme.light')" value="light">
                      <el-icon><i-ep-sunny /></el-icon>
                    </el-radio-button>
                    <el-radio-button :label="$t('about.theme.dark')" value="dark">
                      <el-icon><i-ep-moon /></el-icon>
                    </el-radio-button>
                    <el-radio-button :label="$t('about.theme.system')" value="system">
                      <el-icon><i-ep-monitor /></el-icon>
                    </el-radio-button>
                  </el-radio-group>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>

        <!-- 语言设置 -->
        <div class="settings-section">
          <div class="settings-icon">
            <el-icon class="icon-circle"><i-ep-chat-dot-round /></el-icon>
          </div>
          <div class="settings-content">
            <el-row align="middle" justify="space-between">
              <el-col :span="12">
                <div class="setting-label">
                  {{ $t('about.langTittle') }}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="setting-control">
                  <el-select v-model="language" :placeholder="$t('please-choose')" style="width: 120px;" @change="changeLanguage" size="large">
                    <el-option :label="$t('about.lang.zh_CN')" value="zh">
                      <div class="language-option">
                        <span class="flag">🇨🇳</span>
                        <span>{{ $t('about.lang.zh_CN') }}</span>
                      </div>
                    </el-option>
                    <el-option :label="$t('about.lang.en_US')" value="en">
                      <div class="language-option">
                        <span class="flag">🇺🇸</span>
                        <span>{{ $t('about.lang.en_US') }}</span>
                      </div>
                    </el-option>
                  </el-select>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>

        <!-- 开发者工具 -->
        <div class="settings-section action-section" @click="openDevTools" role="button">
          <div class="settings-icon">
            <el-icon class="icon-circle"><i-ep-tools /></el-icon>
          </div>
          <div class="settings-content">
            <el-row align="middle" justify="space-between">
              <el-col :span="18">
                <div class="setting-label">
                  {{ $t('about.openDevTools') }}
                </div>
              </el-col>
              <el-col :span="6">
                <div class="setting-action">
                  <el-icon><i-ep-arrow-right-bold /></el-icon>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>

        <!-- 退出应用 -->
        <div class="settings-section action-section danger-action" @click="exitApp" role="button">
          <div class="settings-icon">
            <el-icon class="icon-circle danger"><i-ep-switch-button /></el-icon>
          </div>
          <div class="settings-content">
            <el-row align="middle" justify="space-between">
              <el-col :span="18">
                <div class="setting-label">
                  {{ $t('about.quit') }}
                </div>
              </el-col>
              <el-col :span="6">
                <div class="setting-action">
                  <el-icon><i-ep-arrow-right-bold /></el-icon>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        
        <!-- 版本信息 -->
        <div class="settings-section version-section">
          <div class="settings-icon">
            <el-icon class="icon-circle"><i-ep-info-filled /></el-icon>
          </div>
          <div class="settings-content">
            <el-row align="middle" justify="space-between">
              <el-col :span="12">
                <div class="setting-label">
                  {{ $t('about.version') }}
                </div>
              </el-col>
              <el-col :span="12">
                <div class="setting-version">
                  <el-tag size="large" effect="plain">v{{ version }}</el-tag>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-card>
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
const version = ref(window.electronEnv.VERSION); // 获取Electron应用的版本号
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
const exitApp = () => {
  ElMessageBox.confirm(
    i18n.t('about.quitMessage'),
    i18n.t('about.waring'),
    {
      confirmButtonText: i18n.t('about.confirm'),
      cancelButtonText: i18n.t('about.cancel'),
      type: 'warning',
    }
  ).then(() => {
    window.electronAPI.quit(); // 关闭应用
  }).catch(() => {});
};  
const openDevTools = () => {
  window.electronAPI.openDevTools(); // 打开开发者工具
};
</script>

<style scoped>
.about-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.settings-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--el-text-color-primary);
  text-align: center;
  position: relative;
  padding-bottom: 12px;
}

.settings-title::after {
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

.settings-card {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 10px;
  transition: all 0.3s ease;
}

.settings-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.settings-section {
  display: flex;
  align-items: center;
  padding: 16px;
  margin: 8px 0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.settings-icon {
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s ease;
}

.icon-circle.danger {
  background-color: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.settings-content {
  flex: 1;
  width: 100%;
}

.setting-label {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  text-align: left;
  letter-spacing: 0.3px;
  line-height: 1.5;
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
}

.setting-control {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 40px;
}

.setting-action {
  display: flex;
  justify-content: flex-end;
  color: var(--el-text-color-secondary);
}

.setting-version {
  display: flex;
  justify-content: flex-end;
}

.action-section {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-section:hover {
  background-color: var(--el-fill-color-light);
}

.action-section:hover .icon-circle {
  transform: scale(1.1);
}

.danger-action:hover {
  background-color: var(--el-color-danger-light-9);
}

.danger-action:hover .icon-circle.danger {
  background-color: var(--el-color-danger-light-7);
}

.version-section {
  margin-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
  padding-top: 20px;
}

.language-option {
  display: flex;
  align-items: center;
}

.flag {
  margin-right: 8px;
  font-size: 18px;
}

/* 自定义 radio button 样式 */
:deep(.el-radio-button__inner) {
  padding: 8px 16px;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  box-shadow: -1px 0 0 0 var(--el-color-primary);
}

:deep(.el-select__wrapper) {
  border-radius: 8px;
}

:deep(.el-tag) {
  font-weight: 500;
  padding: 0 12px;
  height: 32px;
  line-height: 30px;
}

/* 确保所有行的高度一致 */
.el-row {
  min-height: 40px;
}
</style>