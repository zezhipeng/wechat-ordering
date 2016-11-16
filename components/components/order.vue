<template lang="jade">
div
  transition(name='slide-fade')
    .background(v-if='!order.length')
      svg(xmlns='http://www.w3.org/2000/svg', width='100', height='100')
        g(fill='none', fill-rule='evenodd')
          circle(cx='50', cy='50', r='50', fill='#f9a825')
          path(fill='#324A5E', d='M61.39 73.69l-36.965 9.94V26.29l36.964-9.92')
          path(fill='#FFF', d='M24.425 26.29h51.13v57.34h-51.13z')
          path(fill='#E6E9EE', d='M24.425 56.032v27.6H70.1c-1.092-1.33-2.183-2.66-3.294-3.99-.834-1.01-1.687-2.043-2.858-2.638-2.6-1.33-5.952-.12-8.53-1.508-3.037-1.607-3.612-6.052-6.608-7.778-2.68-1.528-6.23-.297-8.99-1.647-3.193-1.586-4.344-6.15-7.776-7.122-1.032-.297-2.143-.198-3.195-.357-1.747-.217-3.314-1.19-4.425-2.558z')
          g(fill='#FF7058')
            path(d='M38.313 36.687l-2.5 5.04h-1.23l-2.48-5.04V42.5H30.04v-9.226h2.777l2.38 5.08 2.382-5.08h2.777V42.5h-2.064v-5.813M49.305 33.274v1.845h-4.603v1.904h4.127v1.766H44.7v1.924h4.742v1.826H42.64v-9.226h6.665v-.04M57.738 33.274H59.8V42.5H57.74l-4.405-5.794V42.5H51.27v-9.226h1.924l4.524 5.952v-5.952M64.524 40.12c.337.436.813.634 1.39.634.574 0 1.03-.218 1.388-.635.337-.437.515-1.013.515-1.747v-5.1h2.064v5.16c0 1.35-.376 2.36-1.11 3.095-.734.714-1.687 1.07-2.837 1.07-1.15 0-2.104-.356-2.838-1.09-.734-.714-1.11-1.746-1.11-3.075v-5.16h2.063v5.1c-.04.734.12 1.31.476 1.746z')
          path(fill='#4CDBC4', d='M30.14 45.02h39.7v1.13h-39.7z')
          path(fill='#54C0EB', d='M30.14 48.056h39.7v1.13h-39.7z')
      p(style='color: #f9a825') 空空如也，快点去点餐吧
  transition(name='slide-fade')
    .order-list(tag='ul' v-if='order.length', name='fadeIn')
      li.coupon
        a(data-toggle='collapse', href='#ui_collapse_example')
          span.collapsed-hide  可用优惠券 {{coupon.length}}
          span.collapsed-show
            span.icon expand_less
        ul#ui_collapse_example.collapsible-region.collapse(aria-expanded='false', style='height: 0px;')
          li(v-for='item in coupon',  :key='item._id', @click='useCoupon(item)') ¥{{item.price}}
            span 实付金额满{{item.limit}}
              span 有效期至{{item.due}}
      transition-group(name='fadeIn')
        li(v-for='(item, $index) in order', :key='item._id')
          .img
            img(:src='"//og2h60o77.bkt.clouddn.com/" + item.src')
          .text
            .name {{item.name}}
            .text-footer
              .price {{item.price}} /{{item.unit}}
              .tools
                span.number(style='color: #666') x {{item.number}}
                .minus-one(@click='minus(item)') -
                .plus-one(@click='add(item)') +
                //- span.icon(@click='minus(item)') indeterminate_check_box
                //- span.icon(@click='add(item)') add_box
  transition(name='fade')
    .footer-bar(v-if='order.length')
      .coupon
        span.text 减
        span.number ¥{{couponNow.minus || 0}}
      .total 合计：
        span ¥{{totalFee}}
      .pay-btn(@click='submitOrder') 立即下单({{order.length}})
</template>

<script>
import { mapMutations } from 'vuex'
// import VAlert from './alert.vue'
import _ from 'lodash'

export default {
  data () {
    return {
      showCoupon: false,
      couponNow: {
        minus: 0
      }
    }
  },
  computed: {
    order () {
      return this.$store.getters.order
    },
    totalFee () {
      return this.$store.getters.totalFee
    },
    coupon () {
      return this.$store.getters.coupon
    }
  },
  created () {},
  mounted () {},
  methods: {
    useCoupon(coupon) {
      this.couponNow = coupon
    },
    submitOrder() {

      // $.ajax({
      //   url: '/orderings',
      //   type: 'POST',
      //   data: {
      //     orderings: this.order,
      //     tableNumber: 1
      //   },
      //   dataType: 'json'
      // })
      // .done(res => {
      //   swal("下单成功", "布噜布噜⋯布噜布噜⋯", "success")
      //   console.log(res)
      // })

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
    add (item) {
      this.$store.commit('addOrder', {item})
    },
    minus (item) {
      this.$store.commit('removeOrder', {item})
    }
  },
  components: {
  }
}
</script>

<style lang="less">

.footer-bar {
  position: fixed;
  bottom: 50px;
  left: 0;
  height: 50px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  // border-top: 1px solid#ddd;
  background-color: white;

  .coupon {
    margin-right: 40px;

    .number {
      color: #666;
    }
    .text {
      background-color: #FF7058;
      color: white;
      padding: 3px;
      border-radius: 4px;
      margin-right: 3px;
    }
  }
  .total {
    margin-right: 20px;
    color: #666;

    span {
      color: #F9A825;
    }
  }

  .pay-btn {
    height: 100%;
    padding-left: 30px;
    padding-right: 30px;
    color: #F9A825;
    font-size: 16px;
    // background: #FF6600;
    display: flex;
    border: 1px solid#F9A825;
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

  .coupon {
    display: flex;
    flex-direction: column;
    height: 40px;
    justify-content: center;
    // justify-content: space-between;
    // height: 40px;
    // align-items: center;
    .content {
      color: #666;
      height: 40px;
    }
    ul {
      display: none;
      height: 0;
      width: 100%;
      padding: 0;
      transition: all 500ms ease;
    }
    .active {
      display: block;
      height: auto;
    }
  }

  li {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    margin-bottom: 10px;
    // border-top: 1px solid#ddd;
    // border-bottom: 1px solid#ddd;
    background: white;
    padding: 0 10px;

    .img {
      height: 70px;
      width: 70px;
      // border-radius: 50%;
      overflow: hidden;

      img {
        height: 100%;
        /*border-radius: 50%;*/
      }
    }

    .text {
      width: e('calc(100% - 80px)');
      margin-left: 10px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-start;
      font-size: 17px;
      // border-bottom: 1px solid#ddd;

      .text-footer {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;

        .price {
          color: #FF7058;
        }

        .tools {
          font-size: 25px;
          display: flex;
          height: 32px;
          line-height: 32px;

          .number {
            margin-right: 15px;
            font-size: 18px;
          }

          .plus-one {
            width: 40px;
            height: 30px;
            border: 1px solid#ddd;
            border-radius: 0 8px 8px 0;
            font-size: 20px;
            line-height: 23px;
            text-align: center;
          }

          .minus-one {
            width: 40px;
            height: 30px;
            border: 1px solid#ddd;
            border-radius: 8px 0 0 8px;
            font-size: 30px;
            line-height: 23px;
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
  border: 4px solid rgba(249, 168, 37, 0.7) !important;
}
.sweet-alert button {
  background-color: #f9a825 !important;
}
.sweet-alert .sa-icon.sa-success .sa-line {
  background-color: rgb(249, 168, 37) !important;
}
</style>
