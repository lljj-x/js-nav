/**
 * Created by Liu.Jun on 2021/1/7 2:17 下午.
 */
export function isString(str) {
    return String(str) === str;
}

function genIdFn() {
    let preKey = `${+new Date()}`;
    let key = 0;
    return () => {
        const curTimestamp = `${+new Date()}`;
        if (curTimestamp === preKey) {
            key += 1;
        } else {
            // 重置 key
            key = 0;
        }

        preKey = curTimestamp;
        return `lj${preKey}x${key}`;
    };
}
// 只保证同时生成不重复
export const genId = genIdFn();

// 返回普通数组
export function querySelectorList(selector, parent = document) {
    if (selector instanceof NodeList) {
        return Array.from(selector);
    }

    if (selector instanceof HTMLElement) {
        return [selector];
    }

    if (isString(selector)) {
        return Array.from(parent.querySelectorAll(selector));
    }

    throw new Error('请传入一个正确的选择器');
}

export function throttle(func, wait, ops) {
    let context;
    let args;
    let result;
    let timeout = null;
    let previous = 0;
    const options = Object.assign({}, ops);

    const later = () => {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) {
            context = null;
            args = null;
        }
    };

    return function fn(...reArgs) {
        const now = Date.now();
        if (!previous && options.leading === false) previous = now;
        const remaining = wait - (now - previous);
        context = this;
        args = reArgs;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) {
                context = null;
                args = null;
            }
        } else if (!timeout) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}

export function handleEvents(events, type = 'addEventListener') {
    // 注册事件
    events.forEach(({
        target, eventName, handler, useCapture = false
    } = {}) => {
        if (Array.isArray(eventName)) {
            eventName.forEach((eName) => {
                target[type](eName, handler, useCapture);
            });
        } else {
            target[type](eventName, handler, useCapture);
        }
    });
}
