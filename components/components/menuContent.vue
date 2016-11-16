<template lang="jade">
div
  hr
  .item-title 菜单
  transition-group.menu-list(tag='ul', name='list')
    li.menu-item(v-for='item, $index in list', :key='item._id')
      .img
        img.img-responsive(:src='"//og2h60o77.bkt.clouddn.com/" + item.src')
      .footer
        .line
          .name {{item.name}}
            span(style='margin-left: 14px;')
            span.icon(v-for='i in item.stars') star_border
          .add(@click='add({item: item, $index: $index}, $event)')
            span.icon add
        .line2
          span.price {{item.price}} /{{item.unit}}
          span.vt {{item.vt}}
</template>
<script>
import _ from 'lodash'
import TWEEN from 'tween'
import recommend from './recommend.vue'

export default {
  data () {
    return {
    }
  },
  computed: {
    list () {
      return this.$store.getters.list
    },
    order () {
      return this.$store.getters.order
    }
  },
  mounted () {},
  methods: {
    shuffle () {
      this.list = _.shuffle(this.list)
    },
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
    thumb (data) {
      // data.item.favorite = true
      // data.item.thumb++
    },
    add (data, e) {
      let item = data.item
      let $index = data.$index
      let ball = document.createElement('SPAN')
      let vm = this

      $(ball).addClass('ball icon')
      $(ball).text('plus_one')
      $(ball).css('top', e.clientY - 10 + 'px')
      $(ball).css('left', e.clientX - 10 + 'px')
      // console.log(e)
      $('body').append(ball)

      this.tween({
        top: e.clientY - 10,
        left: e.clientX - 10,
        scale: 1.1
      }, {
        top: $('body').height(),
        left: $('body').width() - $('body').width() / 6 + 8,
        scale: 1
      }, ball)

      this.$store.commit('addOrder', {item})
      setTimeout(function() {
        $(ball).remove()
      }, 600)
    }
  },
  components: {
    recommend
  }
}
</script>

<style lang="less">

.ball {
  width: 22px;
  height: 22px;
  color: white;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  border-radius: 50%;
  background: #ff4081;
}
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-active {
  opacity: 0;
  transform: translateY(30px);
}

.menu-list {
  list-style: none;
  padding: 0;

  li {
    padding: 8px;
    margin-bottom: 20px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.07);
    background: #fff;
    img {
      filter: brightness(90%);
    }

    .footer {
      .line2 {
        height: 30px;
        width: 100%;

        .price {
          float: left;
          width: 60px;
          overflow: hidden;
        }
        span {
          color: #F9A825;
          font-size: 15px;
        }
        .vt {
          float: left;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          width: e('calc(100% - 85px)');
          color: #777;
          font-size: 14px;
        }
      }
      .line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;

        .name {
          font-size: 20px;
          color: #666;

          span {
            color: #F9A825;
            font-size: 14px;
          }
        }
        .add {
          color: #F9A825;
          border: 1px solid#F9A825;
          border-radius: 3px;
          background: #fff;
          border-radius: 3px;
          font-size: 25px;
        }
      }
    }
  }
}

</style>
