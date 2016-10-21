<template lang="jade">
div
  .item-title 特色推荐
  .swiper-content
    swiper
      swiper-slide(v-for='item, $index in list', v-if='item.recommend')
        .content
          img.img-responsive(:src='item.src')
        .footer
          p {{item.vt}}
          .tools
            svg(fill='none', height='24', viewbox='0 0 24 24', width='24', xmlns='http://www.w3.org/2000/svg')
              path(d='M0 0h24v24H0z', fill='none')
              path(stroke='#979797', stroke-width='1', d='M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z')
            span.thumb-number 55
            .svg(style='height: 24px; width: 24px', @click='add({item: item, $index: $index}, $event)')
              svg(style='margin-left: 25px' fill='none', height='24', viewbox='0 0 24 24', width='24', xmlns='http://www.w3.org/2000/svg')
                path(stroke='#979797', stroke-width='1', d='M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z')
                path(d='M0 0h24v24H0z', fill='none')
</template>

<script>
import { swiper, swiperSlide, swiperPlugins } from 'vue-awesome-swiper'
import TWEEN from 'tween'

export default {
  props: ['list', 'order'],
  data () {
    return {
    }
  },
  computed: {},
  mounted () {

  },
  methods: {
    tween: function (startValue, endValue, el) {

      function animate () {
        requestAnimationFrame(animate)
        TWEEN.update()
      }
      new TWEEN.Tween(startValue)
        .to(endValue, 500)
        .onUpdate(function () {

          el.style.top = this.top + 'px'
          el.style.left = this.left + 'px'
          el.style.transform = `scale(${this.scale})`
        })
        .start()
      animate()
    },
    add(data, e) {
      let item = data.item
      let $index = data.$index
      let ball = document.createElement('SPAN')
      let order = $('#order')
      let top = order.offset().top
      let left = order.offset().left
      let width = order.width()
      let height = order.height()
      let vm = this

      top = top + height / 2 - 35
      left = left + width / 2 - 6

      $(ball).addClass('ball icon')
      $(ball).text('plus_one')
      $(ball).css('top', e.clientY - 10 + 'px')
      $(ball).css('left', e.clientX - 10 + 'px')
      $('body').append(ball)

      this.tween({
        top: e.clientY - 10,
        left: e.clientX - 10,
        scale: 1
      }, {
        top: 1,
        left: $('body').width() / 2 - 3,
        scale: 0.5
      }, ball)

      this.$emit('addOrder', item)

      setTimeout(function() {
        $(ball).remove()
      }, 600)
    }
  },
  components: {
    swiper,
    swiperSlide
  }
}
</script>

<style lang="css">
.item-title {
  font-size: 20px;
  padding: 10px 10px 15px 0;
  color: #666;
}

.swiper-content {
  height: calc(56vw + 100px);
}

.swiper-slide .content {
  /*height: calc(100% - 100px) !important;
  overflow-y: hidden;*/
  width: 100%;
}

.swiper-slide .footer {
  color: #666;
}

.swiper-slide .footer p {
  font-size: 18px;
  padding: 10px 0 5px 0;
  line-height: 30px;
  height: 60px;
}

.swiper-slide .footer .tools {
  font-size: 24px;
  height: 30px;
  line-height: 30px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
}

.swiper-slide .footer .tools .thumb-number {
  margin-left: 8px;
  font-size: 17px;
  font-weight: 100;
  margin-top: -3px;
}

.ball {
  font-size: 30px;
  /*padding: 5px;*/
  position: fixed;
  z-index: 19;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
}

</style>
