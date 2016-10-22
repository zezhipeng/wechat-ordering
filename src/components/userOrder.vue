<template lang="jade">
div(style='padding-bottom: 37px; background: white')
  transition(name='slide-fade')
    .background(v-if='!order.length')
      span.icon restaurant
      p 空空如也，快点去点餐吧
  transition(name='slide-fade')
    transition-group.order-list(tag='ul' v-if='order.length', name='fadeIn')
      li(v-for='(item, $index) in order', :key='item.name + item.src')
        .img
          img(:src='item.src')
        .text
          .name {{item.name}}
          .text-footer
            .price {{item.price}} /{{item.unit}}
            .tools
              span.icon(@click='minus({item: item, $index: $index})') indeterminate_check_box
              span(style='color: #666') {{item.number}}
              span.icon(@click='add({item: item, $index: $index})') add_box
  .footer-bar
    .total 合计：
      span ¥{{total}}
    .pay-btn 结算({{order.length}})
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: ['order'],
  data () {
    return {
      total: 0
    }
  },
  watch: {
    order: function (newValue, oldValue) {
      this.total = 0
      newValue.forEach(v => {
        this.total += v.price * v.number
      })
    }
  },
  computed: {
    doneTodos () {
      return this.$store.getters.doneTodos
    }
  },
  created () {},
  mounted () {},
  methods: {
    addTodoTo () {
      let item = {
        id: 3,
        text: '3213',
        done: true
      }

      this.$store.commit('addTodo', {item})
    },
    add (data) {
      let item = data.item
      let $index = data.$index

      item.number++
      this.$set(this.$parent.order, $index, item)
    },
    minus (data) {
      let item = data.item
      let $index = data.$index
      if (item.number === 1) {
        this.order.splice($index, 1)
      } else {
        item.number--
        this.$set(this.$parent.order, $index, item)
      }
    }
  },
  components: {}
}
</script>

<style lang="css">

.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 50px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid#ddd;
  background-color: white;
}

.footer-bar .total {
  margin-right: 20px;
  color: #666;
}
.footer-bar .total span {
  color: #4AD4B8;
}

.footer-bar .pay-btn {
  height: 100%;
  padding-left: 30px;
  padding-right: 30px;
  color: white;
  font-size: 16px;
  background: #4AD4B8;
  display: flex;
  align-items: center;
}

.fadeIn-enter-active, .fadeIn-leave-active {
  transition: all .3s;
}
.fadeIn-enter, .fadeIn-leave-active {
  opacity: 0;
  transform: translateX(30px);
}

.order-list {
  list-style: none;
  padding: 0;
}

.background {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-direction: column;
}

.background span {
  font-size: 50px;
  color: #666;
}


.order-list li {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 75px;
}

.order-list li .img {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  overflow: hidden;
}

.order-list li .img img {
  height: 100%;
  /*border-radius: 50%;*/
}

.order-list li .text {
  width: calc(100% - 60px);
  margin-left: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border-bottom: 1px solid#ddd;
}

.order-list li .text .name {

}

.order-list li .text .text-footer {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
}

.order-list li .text .text-footer .tools {
  font-size: 25px;
}

.order-list li .text .text-footer .tools span {
  margin-left: 20px;
  color: #666;
}

</style>
