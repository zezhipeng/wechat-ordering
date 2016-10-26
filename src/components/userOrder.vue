<template lang="jade">
div(style='padding-bottom: 37px; background: white')
  transition(name='slide-fade')
    .background(v-if='!order.length')
      svg(xmlns='http://www.w3.org/2000/svg', width='130', height='124')
        g(fill='none', fill-rule='evenodd')
          path(fill='#FF6600', d='M8.818 108.24l-4.294 10.782 60.262 3.868 60.88-3.868-7.985-8.043')
          path(fill='#FFF', stroke='#FF6600', d='M.667 55.5v49.956l63.938 17.074 64.025-13.79V55.5L64.605 66.018z')
          path(stroke='#FF6600', d='M64.642 122.846v-57.53')
          path(fill='#FF6600', d='M31.094 89.032l-.244-38.854s-4.355-.913-9.313-5.03C16.58 41.03 15 35.574 15 35.574V1.102h8.657V31.79l8.823.13V1l8.63.07v30.85h9.136L50.17 1.07l9.325.032v34.473s-1.37 5.333-6.05 9.572c-4.682 4.24-10.586 5.065-10.586 5.065l.027 39.083-11.793-.263zM91.976 88.865l-.223-35.534-10.566-.273L81 13.337s1.547-5.642 8.283-9.728C96.018-.478 102.95.02 102.95.02l-.212 88.845H91.976z')
      p(style='color: #FF6600') 空空如也，快点去点餐吧
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
              span.number(style='color: #666') {{item.number}}
              .minus-one(@click='minus(item)') -
              .plus-one(@click='add(item)') +
              //- span.icon(@click='minus(item)') indeterminate_check_box
              //- span.icon(@click='add(item)') add_box
  transition(name='fade')
    .footer-bar(v-if='order.length')
      .total 合计：
        span ¥{{total}}
      .pay-btn(@click='submitOrder') 立即下单({{order.length}})
</template>

<script>
import { mapMutations } from 'vuex'
import VAlert from './alert.vue'
import _ from 'lodash'

export default {
  data () {
    return {
      total: 0
    }
  },
  watch: {
    order: function (newValue, oldValue) {
      this.total = _.reduce(newValue, (total, item) => {
        return total += item.price * item.number
      }, 0)
    }
  },
  computed: {
    doneTodos () {
      return this.$store.getters.doneTodos
    },
    order () {
      return this.$store.getters.order
    }
  },
  created () {},
  mounted () {},
  methods: {
    submitOrder() {
      $.ajax({
        url: '/orderings',
        type: 'POST',
        data: {
          orderings: this.order,
          tableNumber: 1
        },
        dataType: 'json'
      })
      .done(res => {
        swal("下单成功", "布噜布噜布噜布噜⋯", "success")
        console.log(res)
      })

    },
    pay () {
      // function onBridgeReady(){
      //    WeixinJSBridge.invoke(
      //        'getBrandWCPayRequest', {
      //            "appId" ： "wx33d67a99c493f926",     //公众号名称，由商户传入
      //            "timeStamp"：Date.now,         //时间戳，自1970年以来的秒数
      //            "nonceStr" ： "e61463f8efa94090b1f366cccfbbb444", //随机串
      //            "package" ： "prepay_id=u802345jgfjsdfgsdg888",
      //            "signType" ： "MD5",         //微信签名方式：
      //            "paySign" ： "70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名
      //        },
      //        function(res){
      //            if(res.err_msg == "get_brand_wcpay_request：ok" ) {}     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
      //        }
      //    );
      // }
      // if (typeof WeixinJSBridge == "undefined"){
      //    if( document.addEventListener ){
      //        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      //    }else if (document.attachEvent){
      //        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
      //        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
      //    }
      // }else{
      //    onBridgeReady();
      // }
    },
    addTodoTo () {
      let item = {
        id: 3,
        text: '3213',
        done: true
      }

      this.$store.commit('addTodo', {item})
    },
    add (item) {
      this.$store.commit('addOrder', {item})
    },
    minus (item) {
      this.$store.commit('removeOrder', {item})
    }
  },
  components: {
    VAlert
  }
}
</script>

<style lang="less">

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

  .total {
    margin-right: 20px;
    color: #666;

    span {
      color: #FF6600;
    }
  }

  .pay-btn {
    height: 100%;
    padding-left: 30px;
    padding-right: 30px;
    color: white;
    font-size: 16px;
    background: #FF6600;
    display: flex;
    align-items: center;
  }
}


.fadeIn-enter-active, .fadeIn-leave-active {
  transition: all .3s;
}
.fadeIn-enter, .fadeIn-leave-active {
  opacity: 0;
  transform: translateX(30px);
}

.fade-enter-active, .fade-leave-active {
  transition: all .3s;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}

.order-list {
  list-style: none;
  padding: 0;

  li {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 75px;

    .img {
      height: 50px;
      width: 50px;
      border-radius: 50%;
      overflow: hidden;

      img {
        height: 100%;
        /*border-radius: 50%;*/
      }
    }

    .text {
      width: e('calc(100% - 60px)');
      margin-left: 10px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      // border-bottom: 1px solid#ddd;

      .text-footer {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;

        .tools {
          font-size: 25px;
          display: flex;
          height: 32px;
          line-height: 32px;

          .number {
            margin-right: 15px;
            font-size: 20px;
          }

          .plus-one {
            width: 40px;
            height: 30px;
            border: 1px solid#ddd;
            border-radius: 0 15px 15px 0;
            font-size: 20px;
            line-height: 30px;
            text-align: center;
          }

          .minus-one {
            width: 40px;
            height: 30px;
            border: 1px solid#ddd;
            border-radius: 15px 0 0 15px;
            font-size: 30px;
            line-height: 30px;
            text-align: center;
          }

          span {
            margin-left: 20px;
            color: #666;
          }
        }
      }
    }
  }
}

.background {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-direction: column;

  span {
    font-size: 50px;
    color: #666;
  }
}


.sweet-alert .sa-icon.sa-success .sa-placeholder {
  border: 4px solid rgba(255, 102, 0, 0.7) !important;
}

.sweet-alert .sa-icon.sa-success .sa-line {
  background-color: rgba(255, 102, 0, 1) !important;
}
</style>
