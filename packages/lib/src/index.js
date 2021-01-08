/**
 * Created by Liu.Jun on 2020/11/5 11:24.
 */

import { querySelectorList, throttle, handleEvents } from './utils';
import {
    getScrollContainer, getOffsetTop, getOffsetLeft, getRealCurrentTarget, getScrollTop, aniScrollToTop
} from './dom';

import './style.css';

export default class {
    shouldObserveOnScroll = true

    navContainerDom = null

    navWrapperDom = null

    sectionScrollDom = null

    itemSectionList = []

    curItemData = null

    events = [];

    scrollTimer = null

    cancelAniScroll = () => {}

    constructor(navContainer, options = {}) {
        let timer;
        const defaults = {
            horizontalNav: true,
            navItemClassName: 'js_navItem',
            getSectionSelector: itemTarget => itemTarget.getAttribute('href'),
            currentClass: 'current',
            offset: 80,
            scrollDuration: 500, // 点击锚点滚动时长
            onNavChange: null,
            onScrollStart: null,
            onClickNav: null,
            onScrollEnd: null,
            scrollToNav: (offsetPixel) => {
                if (timer) {
                    cancelAnimationFrame(timer);
                    clearTimeout(timer);
                    timer = null;
                }
                const beginTime = Date.now();
                const beginLeft = this.navContainerDom.scrollLeft;
                const moveValue = offsetPixel - beginLeft;

                const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16));
                const frameFunc = () => {
                    const progress = (Date.now() - beginTime) / 300;
                    if (progress < 1) {
                        this.navContainerDom.scrollLeft = beginLeft + moveValue * progress;
                        timer = rAF(frameFunc);
                    } else {
                        this.navContainerDom.scrollLeft = offsetPixel;
                    }
                };
                rAF(frameFunc);
            }
        };

        this.options = { ...defaults, ...options };

        this.navContainerDom = querySelectorList(navContainer)[0];
        this.navWrapperDom = this.navContainerDom.firstElementChild;

        this.init();
    }

    callHook(name, ...args) {
        const hookFn = this.options[name];
        if (hookFn) {
            setTimeout(() => {
                hookFn(...args);
            });
        }
    }

    init() {
        this.resolveData();
        this.initEvent();
        this.scrollEvent();
    }

    resolveData() {
        this.navContainerDom.classList.add('lj-nav-container');
        this.navWrapperDom.classList.add('lj-nav-wrapper');
        if (this.options.horizontalNav) this.navContainerDom.classList.add('lj-horizontal-nav');

        const navItems = querySelectorList(`.${this.options.navItemClassName}`);
        this.itemSectionList = navItems.map(item => ({
            navItem: item,
            sectionItem: querySelectorList(this.options.getSectionSelector(item))[0]
        }));

        // 通过 section 的第一个元素来计算 section 滚动容器在哪里
        try {
            this.sectionScrollDom = getScrollContainer(this.itemSectionList[0].sectionItem);
        } catch (e) {
            throw new Error('获取不到navItems元素 或者 section 元素');
        }
    }

    getCurrentItem() {
        // 兼容 window 滚动
        const scrollTop = getScrollTop(this.sectionScrollDom);

        // todo:可以直接把section高度缓存在itemSectionList中，但没想到合适的更新时机
        for (let i = this.itemSectionList.length - 1; i >= 0; i -= 1) {
            const top = getOffsetTop(this.itemSectionList[i].sectionItem, this.sectionScrollDom);
            if (top <= scrollTop + this.options.offset) {
                return this.itemSectionList[i];
            }
        }

        return this.itemSectionList[0];
    }

    // 浏览器滚动
    scrollEvent() {
        // 选中居中
        const curItem = this.getCurrentItem();

        if (curItem !== this.curItemData) this.setCurrentNav(curItem);
    }

    // 设置当前项选中居中
    setCurrentNav(curItem, force = false) {
        // 更新当前nav匹配数据
        this.curItemData = curItem;

        // 设置当前nav选中
        this.itemSectionList.forEach(item => item.navItem.classList.remove(this.options.currentClass));
        this.curItemData.navItem.classList.add(this.options.currentClass);

        // 移动当前项居中
        const parentWidth = this.navContainerDom.clientWidth;
        const scrollBoxWidth = this.navWrapperDom.clientWidth;

        if (scrollBoxWidth > parentWidth) {
            const curNavItem = this.curItemData.navItem;

            let needTranslateX = getOffsetLeft(curNavItem, this.navContainerDom) + (curNavItem.offsetWidth / 2 - parentWidth / 2);

            needTranslateX = needTranslateX > 0
                ? needTranslateX > (scrollBoxWidth - parentWidth) ? scrollBoxWidth - parentWidth : needTranslateX
                : 0;

            this.options.scrollToNav(needTranslateX);
        }

        if (!force) this.callHook('onNavChange', this.curItemData);
    }

    // nav 点击
    navSelect(navItem) {
        if (navItem === (this.curItemData || {}).navItem) return;

        this.callHook('onClickNav', navItem);

        const curItem = this.itemSectionList.find(item => item.navItem === navItem);

        // 选中居中
        this.setCurrentNav(curItem);

        // 滚动中，先停止当前的再重新滚动
        if (!this.shouldObserveOnScroll) {
            clearTimeout(this.scrollTimer);
            this.cancelAniScroll();
            this.scrollTimer = null;
        } else {
            this.callHook('onScrollStart');
        }

        this.shouldObserveOnScroll = false;
        const scrollToTop = getOffsetTop(curItem.sectionItem, this.sectionScrollDom) - this.options.offset;
        this.cancelAniScroll = aniScrollToTop(this.sectionScrollDom, scrollToTop, this.options.scrollDuration, () => {
            // scroll 事件异步触发，setTimeout 只是经验数字
            // 或者直接移除事件重新绑定
            this.scrollTimer = setTimeout(() => {
                this.shouldObserveOnScroll = true;
                this.callHook('onScrollEnd');
            }, 60);
        });
    }

    initEvent() {
        const scrollEvent = throttle(this.scrollEvent.bind(this), 200);
        this.events.push({
            target: this.sectionScrollDom,
            eventName: 'scroll',
            handler: () => {
                // 这里点击nav的时候禁用事件
                if (this.shouldObserveOnScroll) {
                    scrollEvent();
                }
            }
        });

        this.events.push({
            target: window,
            eventName: 'resize',
            handler: () => {
                this.setCurrentNav(this.curItemData, true);
            }
        });

        this.events.push({
            target: this.navContainerDom,
            eventName: 'click',
            handler: (event) => {
                event.preventDefault();
                const navItem = getRealCurrentTarget(
                    event.currentTarget,
                    event.target,
                    t => t.className && ~t.className.indexOf(this.options.navItemClassName.replace('.', ''))
                );

                if (navItem) this.navSelect(navItem);
            }
        });

        handleEvents(this.events);
    }

    destroy() {
        handleEvents(this.events, 'removeEventListener');

        this.navContainerDom = null;
        this.navWrapperDom = null;
        this.sectionScrollDom = null;

        this.itemSectionList.length = 0;
        this.curItemData = null;

        this.events.length = 0;
    }
}
