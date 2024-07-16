// src\locales\index.ts
import { createI18n } from 'vue-i18n';
import zh from './package/zh.json';
import en from './package/en.json';
// 创建 i18n
const i18n = createI18n({
  legacy: false, // 解决Not available in legacy mode报错
  globalInjection: true, // 全局模式，可以直接使用 $t
  locale: 'zh',
  messages: {
    zh,
    en
  }
});

export default i18n;

