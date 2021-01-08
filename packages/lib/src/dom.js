/**
 * Created by Liu.Jun on 2021/1/7 3:55 下午.
 */


export const getStyle = (element, styleName) => {
    try {
        const computed = document.defaultView.getComputedStyle(element, '');
        return element.style[styleName] || computed ? computed[styleName] : null;
    } catch (e) {
        return element.style[styleName];
    }
};

export const isScroll = (el, vertical) => {
    const determinedDirection = vertical !== null || vertical !== undefined;
    const overflow = determinedDirection
        ? vertical
            ? getStyle(el, 'overflow-y')
            : getStyle(el, 'overflow-x')
        : getStyle(el, 'overflow');

    return overflow.match(/(scroll|auto)/);
};

export const getScrollContainer = (el, vertical) => {
    let parent = el;
    while (parent) {
        if ([window, document, document.documentElement].includes(parent)) {
            return window;
        }
        if (isScroll(parent, vertical)) {
            return parent;
        }
        parent = parent.parentNode;
    }

    return parent;
};

export const getOffset = (el, parent = document.html, place = 'offsetTop') => {
    let offset = 0;
    while (el !== null && (el !== parent)) {
        offset += el[place];
        el = el.offsetParent;
    }
    return offset;
};

export const getOffsetLeft = (el, parent = document.html) => getOffset(el, parent, 'offsetLeft');

export const getOffsetTop = (el, parent = document.html) => getOffset(el, parent);

// 委托事件判断target
export function getRealCurrentTarget(currentTarget, target, validFn) {
    while (target) {
        if (validFn(target)) {
            return target;
        }
        if (target === currentTarget || target.parentNode === currentTarget) {
            break;
        } else {
            target = target.parentNode;
        }
    }

    return null;
}


export const getScrollTop = scrollDom => scrollDom.scrollTop || (window.pageYOffset || document.documentElement.scrollTop);

export const setScrollTop = (scrollDom, top) => {
    const scrollTop = top > 0 ? top : 0;

    if (scrollDom === window) {
        document.documentElement.scrollTop = scrollTop;
        document.body.scrollTop = scrollTop;
    } else {
        scrollDom.scrollTop = scrollTop;
    }
};

const cubic = value => value ** 3;
export const easeInOutCubic = value => (value < 0.5
    ? cubic(value * 2) / 2
    : 1 - cubic((1 - value) * 2) / 2);

export const aniScrollToTop = (scrollDom, toTop, duration = 500, callback) => {
    const beginTime = Date.now();
    const beginTop = getScrollTop(scrollDom);
    const moveValue = toTop - beginTop;

    const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16));
    let id = null;
    const frameFunc = () => {
        const progress = (Date.now() - beginTime) / duration;
        if (progress < 1) {
            setScrollTop(scrollDom, beginTop + (moveValue) * easeInOutCubic(progress));
            id = rAF(frameFunc);
        } else {
            setScrollTop(scrollDom, toTop);
            if (callback) callback();
        }
    };
    rAF(frameFunc);

    return () => (cancelAnimationFrame || clearTimeout)(id);
};
