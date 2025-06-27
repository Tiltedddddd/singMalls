// Logic from swiperjs to help with index.html's uiux

export function initializeSwipers() {
  document.querySelectorAll('.swiper').forEach(swiperEl => {
    new Swiper(swiperEl.querySelector('.slider-wrapper'), {
      loop: false,
      grabCursor: true,
      spaceBetween: 30,
      watchOverflow: true,
      setWrapperSize: true,
      pagination: {
        el: swiperEl.querySelector('.swiper-pagination'),
        clickable: true,
        dynamicBullets: true
      },
      navigation: {
        nextEl: swiperEl.querySelector('.swiper-button-next'),
        prevEl: swiperEl.querySelector('.swiper-button-prev'),
      },
      breakpoints: {
        0: { slidesPerView: 1.2 },
        768: { slidesPerView: 2.3 },
        1024: { slidesPerView: 3.2 }
      },

      on: {
        reachEnd() {
          this.allowSlideNext = false;
        },
        reachBeginning() {
          this.allowSlidePrev = false;
        },
        fromEdge() {
          this.allowSlideNext = true;
          this.allowSlidePrev = true;
        }
      }

      
    });
  });
}
