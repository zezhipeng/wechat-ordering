<template lang="jade">
.card-main
  nav(style='height: 65px; width: 100%')
  nav.tab-nav.tab-nav-white.margin-top-no
    ul.nav.nav-justified
      li.active
        a.waves-attach.waves-effect(data-toggle='tab', href='#ui_tab_example_1_red')
          .tab-button
            i.icon local_dining
            span Menu
      li
        a.waves-attach.waves-effect(data-toggle='tab', href='#ui_tab_example_2_red')
          .tab-button#order
            .order-icon
              i.icon shopping_basket
              span(v-show='orderLength').badge {{orderLength}}
            span Order
      li
        a.waves-attach.waves-effect(data-toggle='tab', href='#ui_tab_example_3_red')
          .tab-button
            i.icon perm_identity
            span User
    .tab-nav-indicator
  .card-inner(style='margin: 0 16px')
    .tab-content(style='height: 100%')
      #ui_tab_example_1_red.tab-pane.fade.active.in
        recommend-content(:list='list', :order='order', v-on:addOrder='addOrder')
        menu-content(:list='list', :order='order', v-on:addOrder='addOrder')
      #ui_tab_example_2_red.tab-pane.fade
        user-order(:order='order')
      #ui_tab_example_3_red.tab-pane.fade
        p USER.
</template>

<script>
import recommendContent from './recommend.vue'
import menuContent from './menuContent.vue'
import userOrder from './userOrder.vue'
import TWEEN from 'tween'
import _ from 'lodash'

export default {
  watch: {
    orderCache: function (newValue, oldValue) {
      let item = newValue[newValue.length - 1]
      let exit = false
      let vm = this

      this.order.forEach((o, i) => {
        if (o._id === item._id) {
          exit = true
          o.number++
          vm.$set(vm.order, i, o)
        }
      })

      if (exit) {

        setTimeout(function() {
          vm.orderLength++
        }, 600)
      } else {
        item.number = 1
        this.order.push(item)

        setTimeout(function() {
          vm.orderLength++
        }, 600)
      }
    }
  },
  data () {
    return {
      order: [],
      orderCache: [],
      orderLength: 0,
      list: [
        {
          _id: 1,
          name: '烤乳猪',
          price: 69,
          stars: 3,
          src: 'images/10.jpg',
          thumb: 55,
          unit: '份'
        },
        {
          _id: 3,
          name: '广州文昌鸡',
          price: 56,
          stars: 1,
          src: 'images/11.jpg',
          thumb: 40,
          unit: '份'
        },
        {
          _id: 4,
          name: '白切鸡',
          price: 44,
          src: 'images/12.jpg',
          thumb: 30,
          unit: '份'
        },
        {
          _id: 5,
          name: '童年香肉',
          price: 22,
          stars: 2,
          src: 'images/13.jpg',
          thumb: 29,
          recommend: true,
          vt: '天啊，在洛杉矶居然能找到性价比这么高的食物啊，简直难以置信'
        },
        {
          _id: 6,
          name: '童茶香肉',
          price: 23,
          src: 'images/14.jpg',
          thumb: 9,
          unit: '份'
        },
        {
          _id: 7,
          name: '茶香肉',
          price: 12,
          stars: 4,
          thumb: 0,
          src: 'images/15.jpg',
          unit: '份',
          recommend: true,
          vt: '天啊，在美国居然能找到这么好吃的东西，简直难以置信'

        },
        {
          _id: 8,
          name: '童年茶香',
          price: 32,
          src: 'images/16.jpg',
          thumb: 1,
          unit: '份'
        },
        {
          _id: 9,
          name: '童年茶肉',
          price: 55,
          src: 'images/17.jpg',
          thumb: 2,
          unit: '份'
        }
      ]
    }
  },
  computed: {},
  mounted () {},
  methods: {
    addOrder (item) {
      this.orderCache.push(item)
    }
  },
  components: {
    recommendContent,
    menuContent,
    userOrder
  }
}
</script>

<style lang="css">
.order-icon {
  position: relative;
}
.badge {
  position: absolute;
  top: 5px;
  left: 100%;
  transform: translateX(-50%) translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  text-align: center;
  font-size: 10px;
  height: 18px;
  width: 18px;
  line-height: 18px;
  /*border: 1px soild #999;*/
  overflow: hidden;
}

.tab-nav {
  background: #4AD4B8;
  color: white;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;
}

.tab-nav-white .nav > li > a:after,
.tab-nav-white .nav > li > .a:after {
  border-bottom-color: #fff ;
}
.tab-nav-white .tab-nav-indicator.animate {
  background-color: #fff;
}

.tab-nav .tab-button {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 65px;
}

.tab-nav .tab-button i {
  width: 100%;
  margin-bottom: 5px;
  font-size: 20px;
}

.tab-nav .tab-button span {
  font-size: 10px;
}
#order {
  position: relative;
}
#ui_tab_example_2_red {
  height: 100%;

}

</style>
