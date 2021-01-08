/**
 * Created by Liu.Jun on 2020/11/5 11:48.
 */

import Nav from '@lljj/nav';
import './style.css';

const swiper = new window.Swiper(document.querySelector('.js_nav'), {
    freeMode: false,
    slidesPerView: 'auto'
});

window.nav = new Nav('.js_nav', {
    scrollToNav: (offsetPixel) => {
        console.log(offsetPixel);
        swiper.translateTo(0 - offsetPixel, 400);
    }
});
