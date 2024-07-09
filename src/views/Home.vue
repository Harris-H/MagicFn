<template>
  <div class="layout">
  <el-container>
    <div class="layout__left">
    <el-aside class="the-menu">
      <el-menu
        default-active="/dashboard"
        class="el-menu-vertical-demo"
        router
        >
        <el-menu-item index="/dashboard">
          <div class="IconItem"><el-icon><i-ep-data-board /></el-icon></div>
          <div class="MenuItemName">
          <span>Dashboard</span>
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
          <span>About</span>
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
    flex: 1 0 200px;
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
.layout__left .the-menu {
    flex: 1 1 80%;
    overflow-y: auto;
    margin-bottom: 0;
    padding-top: 4px;
}
.home-container {
  display: flex; /* 使用Flexbox布局 */
  width: 100%;
}
.main-content {
  flex-grow: 1; /* 主内容区域占据剩余空间 */
}
.IconItem{
  min-width: 56px;
  flex-shrink: 0;
  display: inline-flex;
  color: rgb(0, 0, 0);
  margin-left: 6px;
}
.MenuItemName{
  text-align: center;
}
</style>