/** @license @lljj/nav (c) 2020-2021 Liu.Jun License: MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.lljjNav = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  /**
   * Created by Liu.Jun on 2021/1/7 2:17 下午.
   */
  function isString(str) {
    return String(str) === str;
  }

  function querySelectorList(selector) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

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
  function throttle(func, wait, ops) {
    var context;
    var args;
    var result;
    var timeout = null;
    var previous = 0;
    var options = Object.assign({}, ops);

    var later = function later() {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      result = func.apply(context, args);

      if (!timeout) {
        context = null;
        args = null;
      }
    };

    return function fn() {
      var now = Date.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;

      for (var _len = arguments.length, reArgs = new Array(_len), _key = 0; _key < _len; _key++) {
        reArgs[_key] = arguments[_key];
      }

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
  function handleEvents(events) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'addEventListener';
    // 注册事件
    events.forEach(function () {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          target = _ref.target,
          eventName = _ref.eventName,
          handler = _ref.handler,
          _ref$useCapture = _ref.useCapture,
          useCapture = _ref$useCapture === void 0 ? false : _ref$useCapture;

      if (Array.isArray(eventName)) {
        eventName.forEach(function (eName) {
          target[type](eName, handler, useCapture);
        });
      } else {
        target[type](eventName, handler, useCapture);
      }
    });
  }

  /**
   * Created by Liu.Jun on 2021/1/7 3:55 下午.
   */
  var getStyle = function getStyle(element, styleName) {
    try {
      var computed = document.defaultView.getComputedStyle(element, '');
      return element.style[styleName] || computed ? computed[styleName] : null;
    } catch (e) {
      return element.style[styleName];
    }
  };
  var isScroll = function isScroll(el, vertical) {
    var determinedDirection = vertical !== null || vertical !== undefined;
    var overflow = determinedDirection ? vertical ? getStyle(el, 'overflow-y') : getStyle(el, 'overflow-x') : getStyle(el, 'overflow');
    return overflow.match(/(scroll|auto)/);
  };
  var getScrollContainer = function getScrollContainer(el, vertical) {
    var parent = el;

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
  var getOffset = function getOffset(el) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.html;
    var place = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'offsetTop';
    var offset = 0;

    while (el !== null && el !== parent) {
      offset += el[place];
      el = el.offsetParent;
    }

    return offset;
  };
  var getOffsetLeft = function getOffsetLeft(el) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.html;
    return getOffset(el, parent, 'offsetLeft');
  };
  var getOffsetTop = function getOffsetTop(el) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.html;
    return getOffset(el, parent);
  }; // 委托事件判断target

  function getRealCurrentTarget(currentTarget, target, validFn) {
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
  var getScrollTop = function getScrollTop(scrollDom) {
    return scrollDom.scrollTop || window.pageYOffset || document.documentElement.scrollTop;
  };
  var setScrollTop = function setScrollTop(scrollDom, top) {
    var scrollTop = top > 0 ? top : 0;

    if (scrollDom === window) {
      document.documentElement.scrollTop = scrollTop;
      document.body.scrollTop = scrollTop;
    } else {
      scrollDom.scrollTop = scrollTop;
    }
  };

  var cubic = function cubic(value) {
    return Math.pow(value, 3);
  };

  var easeInOutCubic = function easeInOutCubic(value) {
    return value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2;
  };
  var aniScrollToTop = function aniScrollToTop(scrollDom, toTop) {
    var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;
    var callback = arguments.length > 3 ? arguments[3] : undefined;
    var beginTime = Date.now();
    var beginTop = getScrollTop(scrollDom);
    var moveValue = toTop - beginTop;

    var rAF = window.requestAnimationFrame || function (func) {
      return setTimeout(func, 16);
    };

    var id = null;

    var frameFunc = function frameFunc() {
      var progress = (Date.now() - beginTime) / duration;

      if (progress < 1) {
        setScrollTop(scrollDom, beginTop + moveValue * easeInOutCubic(progress));
        id = rAF(frameFunc);
      } else {
        setScrollTop(scrollDom, toTop);
        if (callback) callback();
      }
    };

    rAF(frameFunc);
    return function () {
      return (cancelAnimationFrame || clearTimeout)(id);
    };
  };

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = ".lj-horizontal-nav {\n    text-align: center;\n    overflow: auto;\n}\n    .lj-horizontal-nav::-webkit-scrollbar {\n        width: 0;\n        height: 0;\n    }\n    .lj-horizontal-nav .lj-nav-wrapper {\n        display: inline-block;\n        vertical-align: top;\n        white-space: nowrap;\n        width: auto;\n    }\n";
  styleInject(css_248z);

  var _default = /*#__PURE__*/function () {
    function _default(navContainer) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, _default);

      _defineProperty(this, "shouldObserveOnScroll", true);

      _defineProperty(this, "navContainerDom", null);

      _defineProperty(this, "navWrapperDom", null);

      _defineProperty(this, "sectionScrollDom", null);

      _defineProperty(this, "itemSectionList", []);

      _defineProperty(this, "curItemData", null);

      _defineProperty(this, "events", []);

      _defineProperty(this, "scrollTimer", null);

      _defineProperty(this, "cancelAniScroll", function () {});

      var timer;
      var defaults = {
        horizontalNav: true,
        navItemClassName: 'js_navItem',
        getSectionSelector: function getSectionSelector(itemTarget) {
          return itemTarget.getAttribute('href');
        },
        currentClass: 'current',
        offset: 80,
        scrollDuration: 500,
        // 点击锚点滚动时长
        onNavChange: null,
        onScrollStart: null,
        onClickNav: null,
        onScrollEnd: null,
        scrollToNav: function scrollToNav(offsetPixel) {
          if (timer) {
            cancelAnimationFrame(timer);
            clearTimeout(timer);
            timer = null;
          }

          var beginTime = Date.now();
          var beginLeft = _this.navContainerDom.scrollLeft;
          var moveValue = offsetPixel - beginLeft;

          var rAF = window.requestAnimationFrame || function (func) {
            return setTimeout(func, 16);
          };

          var frameFunc = function frameFunc() {
            var progress = (Date.now() - beginTime) / 300;

            if (progress < 1) {
              _this.navContainerDom.scrollLeft = beginLeft + moveValue * progress;
              timer = rAF(frameFunc);
            } else {
              _this.navContainerDom.scrollLeft = offsetPixel;
            }
          };

          rAF(frameFunc);
        }
      };
      this.options = _objectSpread2(_objectSpread2({}, defaults), options);
      this.navContainerDom = querySelectorList(navContainer)[0];
      this.navWrapperDom = this.navContainerDom.firstElementChild;
      this.init();
    }

    _createClass(_default, [{
      key: "callHook",
      value: function callHook(name) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var hookFn = this.options[name];

        if (hookFn) {
          setTimeout(function () {
            hookFn.apply(void 0, args);
          });
        }
      }
    }, {
      key: "init",
      value: function init() {
        this.resolveData();
        this.initEvent();
        this.scrollEvent();
      }
    }, {
      key: "resolveData",
      value: function resolveData() {
        var _this2 = this;

        this.navContainerDom.classList.add('lj-nav-container');
        this.navWrapperDom.classList.add('lj-nav-wrapper');
        if (this.options.horizontalNav) this.navContainerDom.classList.add('lj-horizontal-nav');
        var navItems = querySelectorList(".".concat(this.options.navItemClassName));
        this.itemSectionList = navItems.map(function (item) {
          return {
            navItem: item,
            sectionItem: querySelectorList(_this2.options.getSectionSelector(item))[0]
          };
        }); // 通过 section 的第一个元素来计算 section 滚动容器在哪里

        try {
          this.sectionScrollDom = getScrollContainer(this.itemSectionList[0].sectionItem);
        } catch (e) {
          throw new Error('获取不到navItems元素 或者 section 元素');
        }
      }
    }, {
      key: "getCurrentItem",
      value: function getCurrentItem() {
        // 兼容 window 滚动
        var scrollTop = getScrollTop(this.sectionScrollDom); // todo:可以直接把section高度缓存在itemSectionList中，但没想到合适的更新时机

        for (var i = this.itemSectionList.length - 1; i >= 0; i -= 1) {
          var top = getOffsetTop(this.itemSectionList[i].sectionItem, this.sectionScrollDom);

          if (top <= scrollTop + this.options.offset) {
            return this.itemSectionList[i];
          }
        }

        return this.itemSectionList[0];
      } // 浏览器滚动

    }, {
      key: "scrollEvent",
      value: function scrollEvent() {
        // 选中居中
        var curItem = this.getCurrentItem();
        if (curItem !== this.curItemData) this.setCurrentNav(curItem);
      } // 设置当前项选中居中

    }, {
      key: "setCurrentNav",
      value: function setCurrentNav(curItem) {
        var _this3 = this;

        var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        // 更新当前nav匹配数据
        this.curItemData = curItem; // 设置当前nav选中

        this.itemSectionList.forEach(function (item) {
          return item.navItem.classList.remove(_this3.options.currentClass);
        });
        this.curItemData.navItem.classList.add(this.options.currentClass); // 移动当前项居中

        var parentWidth = this.navContainerDom.clientWidth;
        var scrollBoxWidth = this.navWrapperDom.clientWidth;

        if (scrollBoxWidth > parentWidth) {
          var curNavItem = this.curItemData.navItem;
          var needTranslateX = getOffsetLeft(curNavItem, this.navContainerDom) + (curNavItem.offsetWidth / 2 - parentWidth / 2);
          needTranslateX = needTranslateX > 0 ? needTranslateX > scrollBoxWidth - parentWidth ? scrollBoxWidth - parentWidth : needTranslateX : 0;
          this.options.scrollToNav(needTranslateX);
        }

        if (!force) this.callHook('onNavChange', this.curItemData);
      } // nav 点击

    }, {
      key: "navSelect",
      value: function navSelect(navItem) {
        var _this4 = this;

        if (navItem === (this.curItemData || {}).navItem) return;
        this.callHook('onClickNav', navItem);
        var curItem = this.itemSectionList.find(function (item) {
          return item.navItem === navItem;
        }); // 选中居中

        this.setCurrentNav(curItem); // 滚动中，先停止当前的再重新滚动

        if (!this.shouldObserveOnScroll) {
          clearTimeout(this.scrollTimer);
          this.cancelAniScroll();
          this.scrollTimer = null;
        } else {
          this.callHook('onScrollStart');
        }

        this.shouldObserveOnScroll = false;
        var scrollToTop = getOffsetTop(curItem.sectionItem, this.sectionScrollDom) - this.options.offset;
        this.cancelAniScroll = aniScrollToTop(this.sectionScrollDom, scrollToTop, this.options.scrollDuration, function () {
          // scroll 事件异步触发，setTimeout 只是经验数字
          // 或者直接移除事件重新绑定
          _this4.scrollTimer = setTimeout(function () {
            _this4.shouldObserveOnScroll = true;

            _this4.callHook('onScrollEnd');
          }, 60);
        });
      }
    }, {
      key: "initEvent",
      value: function initEvent() {
        var _this5 = this;

        var scrollEvent = throttle(this.scrollEvent.bind(this), 200);
        this.events.push({
          target: this.sectionScrollDom,
          eventName: 'scroll',
          handler: function handler() {
            // 这里点击nav的时候禁用事件
            if (_this5.shouldObserveOnScroll) {
              scrollEvent();
            }
          }
        });
        this.events.push({
          target: window,
          eventName: 'resize',
          handler: function handler() {
            _this5.setCurrentNav(_this5.curItemData, true);
          }
        });
        this.events.push({
          target: this.navContainerDom,
          eventName: 'click',
          handler: function handler(event) {
            event.preventDefault();
            var navItem = getRealCurrentTarget(event.currentTarget, event.target, function (t) {
              return t.className && ~t.className.indexOf(_this5.options.navItemClassName.replace('.', ''));
            });
            if (navItem) _this5.navSelect(navItem);
          }
        });
        handleEvents(this.events);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        handleEvents(this.events, 'removeEventListener');
        this.navContainerDom = null;
        this.navWrapperDom = null;
        this.sectionScrollDom = null;
        this.itemSectionList.length = 0;
        this.curItemData = null;
        this.events.length = 0;
      }
    }]);

    return _default;
  }();

  return _default;

})));
