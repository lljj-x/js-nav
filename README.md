# @lljj/nav
## 介绍

* 页面锚点导航条，滚动定位 ，响应式支持pc和m
![@lljj/nav](https://lljj-xxxx.oss-cn-hongkong.aliyuncs.com/nav.gif)

## 使用方法

### 安装

```
## npm
npm install --save @lljj/nav

## yarn
yarn add @lljj/nav
```

### 使用
```js
import Nav from '@lljj/nav';

const instance = new Nav('.js_nav', {
     // 是否为水平滚动，为true 会保持nav当前元素 至于容器中央
     horizontalNav: true,

     // selector str or NodeList
     navItems: '.js_navItem',

     // 获取到当前 nav 对应的section query selector
     getSectionSelector: itemTarget => itemTarget.getAttribute('href'),

     // nav 选中时class
     currentClass: 'current', // 当前nav item class

     // offset 举例顶部偏移量
     offset: 80,

     // 点击锚点滚动时长
     scrollDuration: 600, // 点击nav 浏览器滚动速度

     // 导航当前元素改变
     onNavChange(itemData) {
         console.log('当前选中nav改变了');
     },

     // 点击了导航按钮
     onClickNav(navItem) {
         console.log('当点击了导航按钮');
     },

     // 开始滚动
     onScrollStart() {
         console.log('点击导航开始滚动了');
     },

     // 开始结束
     onScrollEnd() {
         console.log('点击导航开始滚动结束了');
     },

     // 默认使用使用浏览器横向滚动条，可参见demo
     // 如果想结合现有项目库比如 swiper，可重置该方法执行滚动
     // scrollToNav(offsetPixel) {}
 });

// 需要销毁的时候执行
instance.destroy();
```

### 运行Demo
```
yarn install
yarn demo:dev
```
Demo文件：https://github.com/lljj-x/@lljj/nav/blob/main/packages/demo/src/index/index.js

## 兼容性
内部使用 `Object.assign` 等es6 api，需要自行垫片或者通过babel处理

## License
MIT
