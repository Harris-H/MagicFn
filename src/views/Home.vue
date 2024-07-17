<template>
  <div class="layout">
  <el-container>
    <div class="layout__left">
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
        <!-- <el-menu-item index="/about">
          <div class="IconItem">
          <el-icon><i-ep-home-filled /></el-icon>
        </div>
        <div class="MenuItemName">
          <span>主页</span>
        </div>
        </el-menu-item> -->
        <el-menu-item index="/hello-world">
          <div class="IconItem">
          <el-icon><i-ep-menu /></el-icon>
        </div>
        <div class="MenuItemName">
          <span>Hello World</span>
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
.layout {
    width: 100%;
    height: 100vh;
    display: flex;
    overflow: hidden;
}
.layout__left {
    background-color: var(--layout-left-bg-color);
    flex: 0 0 200px;
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
}
.el-menu {
  background-color: inherit;
  border-right: none;
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
  flex: 4; /* 主内容区域占据3份 */
}
.IconItem{
  min-width: 56px;
  flex-shrink: 0;
  display: inline-flex;
  /* color: rgb(0, 0, 0); */
  margin-left: 6px;
}
.MenuItemName{
  margin-left: -35px;
  flex: 1 1 auto;
  text-align: center;
  font-weight: 700;
  line-height: 1.5;
  font-size: 16px; /* 调整字体大小为16px */
}
</style>