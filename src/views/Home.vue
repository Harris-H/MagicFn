<template>
  <div class="layout">
  <el-container>
    <div class="layout__left">
            <!-- 添加 Logo 区域 -->
            <div class="app-logo">
        <img src="/icon.svg" alt="Logo" class="logo-image">
        <span class="logo-text">MagicFn</span>
      </div>
    <el-aside class="the-menu">
      <el-menu
        default-active="/dashboard"
        router
        >
        <el-menu-item index="/dashboard">
          <div class="IconItem"><el-icon><i-ep-data-board /></el-icon></div>
          <div class="MenuItemName">
          <span>{{ $t('home.home') }}</span>
        </div>
        </el-menu-item>
        <el-menu-item index="/suffix">
          <div class="IconItem">
          <el-icon><i-ep-menu /></el-icon>
        </div>
        <div class="MenuItemName">
          <span>文件类型</span>
        </div>
        </el-menu-item>
        <el-menu-item index="/about">
          <div class="IconItem">
            <el-icon><i-ep-setting /></el-icon>
          </div>
          <div class="MenuItemName">
          <span>{{ $t('home.setting') }}</span>
          </div>
        </el-menu-item>
      </el-menu>
    </el-aside>
    </div>
    <el-main class="main-content">
      <router-view></router-view>
    </el-main>

  </el-container>
</div>
</template>

<script setup lang="ts">
</script>
<style scoped>
.app-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  height: 50px;
  margin: 5px 0;
  position: relative;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.logo-image {
  height: 32px;
  width: 32px;
  margin-right: 8px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-color-primary);
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-primary-light-3));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.layout {
    width: 100%;
    height: 100vh;
    display: flex;
    overflow: hidden;
}
.layout__left {
    background-color: var(--layout-left-bg-color);
    flex: 0 0 180px;
    display: flex;
    height: 100%;
    width: 100%;
    padding: 0 0 8px;
    flex-direction: column;
    align-self: stretch;
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    overflow: hidden;
    border-right: 1px solid var(--divider-color);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}
.el-menu {
  background-color: inherit;
  border-right: none;
  padding-top: 8px;
}
.el-menu-item.is-active {
  background-color: var(--el-color-primary-light-9) !important;
  color: var(--el-color-primary) !important;
}

.el-menu-item:hover {
  background-color: var(--el-fill-color-light) !important;
}
.layout__left .the-menu {
    width: 100%;
    overflow-y: auto;
    margin-bottom: 0;
    padding-top: 4px;
}
.home-container {
  display: flex; /* 使用Flexbox布局 */
  width: 100%;
}
.main-content {
  flex: 4;
  padding: 20px;
}
.IconItem{
  min-width: 56px;
  flex-shrink: 0;
  display: inline-flex;
  /* color: rgb(0, 0, 0); */
  margin-left: 6px;
}
.MenuItemName{
  margin-left: -20px;
  flex: 1 1 auto;
  text-align: center;
  font-weight: 500;
  line-height: 1.5;
  font-size: 16px; /* 调整字体大小为16px */
}
</style>