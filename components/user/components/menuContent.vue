<template lang="jade">
div
  hr
  .item-title(style='margin-top: 10px; display: flex; align-items: center')
    svg(xmlns='http://www.w3.org/2000/svg', width='36', height='36')
      g(fill='none', fill-rule='evenodd')
        circle(cx='18', cy='18', r='18', fill='#F9A825')
        path(fill='#324A5E', d='M22.1 26.53L8.793 30.106V9.464L22.1 5.894')
        path(fill='#FFF', d='M8.793 9.464H27.2v20.643H8.793z')
        path(fill='#E6E9EE', d='M8.793 20.17v9.937h16.443c-.393-.478-.786-.957-1.186-1.436-.3-.363-.607-.734-1.03-.95-.934-.477-2.14-.04-3.07-.54-1.093-.58-1.3-2.18-2.38-2.8-.963-.55-2.24-.11-3.234-.594-1.15-.572-1.565-2.215-2.8-2.565-.372-.106-.772-.07-1.15-.127-.63-.08-1.193-.43-1.593-.922z')
        g(fill='#FF7058')
          path(d='M13.793 13.208l-.9 1.814h-.443l-.893-1.814V15.3h-.742v-3.32h1l.857 1.828.857-1.83h1V15.3h-.744v-2.092M17.75 11.98v.663h-1.657v.686h1.486v.635h-1.487v.693H17.8v.657h-2.45v-3.322h2.4M20.786 11.98h.743v3.32h-.744L19.2 13.215V15.3h-.743v-3.32h.693l1.63 2.142V11.98M23.23 14.443c.12.157.29.228.5.228.206 0 .37-.077.5-.227.12-.157.184-.364.184-.63V11.98h.743v1.856c0 .485-.136.85-.4 1.114-.264.257-.607.386-1.02.386-.416 0-.758-.13-1.023-.393-.264-.257-.4-.63-.4-1.107V11.98h.743v1.834c-.014.265.043.472.172.63z')
        path(fill='#4CDBC4', d='M10.85 16.207h14.293v.486H10.85z')
        path(fill='#54C0EB', d='M10.85 17.3h14.293v.486H10.85z')
    span(style='margin-left: 14px;') 菜单
  ul.filterClasses
    li(v-for='(value, key) of filterClasses')
      .classesTitle(v-bind:data-key='key') {{key}}
      transition-group.menu-list(tag='ul', name='list')
        li.menu-item.active(v-for='item, $index in value', :key='item._id')
          .img
            span.like.icon(v-if='iLike(item)', @click='toggleLike(item._id)') favorite
            span.like.icon(v-if='!iLike(item)', @click='toggleLike(item._id)') favorite_border
            img.img-responsive(:src='"//og2h60o77.bkt.clouddn.com/" + item.src + "?imageMogr2/thumbnail/330x220"', style='width: 330px;height: 220px')
          .footer
            .line
              .name {{item.name}}
                span.br(style='margin-left: 14px;')
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
    filterClasses () {
      return this.$store.getters.filterClasses
    },
    order () {
      return this.$store.getters.order
    },
    classes() {
      return this.$store.getters.classes
    },
    user() {
      return this.$store.getters.user
    },
    list() {
      return this.$store.getters.list

    },
    like() {
      return this.$store.getters.like
    }
  },
  mounted () {},
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
    thumb (data) {
      // data.item.favorite = true
      // data.item.thumb++
    },
    iLike(item) {
      console.log(this.user)
      console.log(this.user._id)
      return item.like.length
        ? _.filter(item.like, _id => _id === this.user._id).length
        : null
    },
    toggleLike (dish) {
      var dish = _.find(this.list, {_id: dish})

      if (dish && _.filter(dish.like, _id => _id === this.user._id).length) {

        $.ajax({
          type: 'put',
          url: '/toggleLike',
          data: {
            dish: dish,
            operator: 'remove',
            user: this.user._id
          }
        }).then(res => {
          console.log(res)
          this.$store.commit('list', res)
        })
      } else {
        $.ajax({
          type: 'put',
          url: '/toggleLike',
          data: {
            dish: dish,
            operator: 'add',
            user: this.user._id
          }
        }).then(res => {
          console.log(res)

          this.$store.commit('list', res)
        })
      }
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
      console.log($('body').width())
      this.tween({
        top: e.clientY - 10,
        left: e.clientX - 10,
        scale: 1.1
      }, {
        top: $('body').height(),
        left: $('body').width() - $('body').width() / 1.5 + 23,
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
.filterClasses {
  list-style: none;
  padding: 0;
  .classesTitle {
    color: #666;
    height: 25px;
    line-height: 25px;
    background: #eee;
    margin-bottom: 2px;
    padding-left: 5px;
  }
}
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
  z-index: 100;
}
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
  opacity: 1;
}
.list-enter, .list-leave-active {
  opacity: 0;
  transform: translateY(20px);
}

.menu-list {
  list-style: none;
  padding: 0;

  &.active {

  }

  li {
    padding: 8px;
    margin-bottom: 20px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.07);
    background: #fff;

    .img {
      position: relative;
    }
    .like {
      position: absolute;
      top: 5px;
      right: 1px;
      color: #fff;
      z-index: 9;
      font-size: 30px;
    }
    img {
      position: relative;
      z-index: 7;
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
        padding-right: 5px;

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
