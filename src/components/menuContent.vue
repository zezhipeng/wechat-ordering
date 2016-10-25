<template lang="jade">
div
  hr
  .item-title 菜单
  transition-group.menu-list(tag='ul', name='list')
    li.menu-item(v-for='item, $index in list', :key='$index')
      img.img-responsive(:src='item.src')
      //- .vt {{item.vt}}
      .favorite
        span.icon(v-if='item.favorite') favorite
        span.icon(v-if='!item.favorite', @click='thumb({item: item, $index: $index})') favorite_border
      .add.waves-attach.waves-effect(@click='add({item: item, $index: $index}, $event)')
        span.icon add_box
      .detail
        .name {{item.name}}
          span(style='margin-left: 5px')
          span.icon(v-for='star in item.stars', style='color: #4ad4b8') star_border
        .price ¥ {{item.price}}  /{{item.unit}}
      hr
</template>

<script>
import _ from 'lodash'
import TWEEN from 'tween'

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
      let order = $('#order')
      let top = order.offset().top
      let left = order.offset().left
      let width = order.width()
      let height = order.height()
      let vm = this

      // top = top + height / 2 - 35
      // left = left + width / 2 - 6

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

      this.$store.commit('addOrder', {item})
      setTimeout(function() {
        $(ball).remove()
      }, 600)
    }
  },
  components: {}
}
</script>

<style lang="css">
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
  width: 100%;
  padding: 0;
}
.menu-list li {
  padding: 0;
  position: relative;
}
.menu-list li .favorite {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 35px;
  color: white;
}
.menu-list li .add {
  position: absolute;
  top: calc((100vw - 16px) / 16 * 9 - 50px);
  right: 20px;
  font-size: 35px;
  color: white;
}

.menu-list li .detail {
  padding-top: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.menu-list li .detail .price {
  font-size: 18px;
  font-weight: 500;
  /*margin-right: 10px;*/
}

.menu-list li .detail .name {
  font-size: 18px;
  margin-bottom: 7px;
}

.menu-list li img {
  filter: brightness(.8);
  -webkit-filter: brightness(.8);
}
</style>
