<template lang="jade">
.account-main
  .account-head
    .user
      .name {{user.nickname}}
        .city {{user.city}}
      .img
        img(:src='user.headimgurl')
    nav.tab-nav.margin-top-no
      ul.nav.nav-justified
        li.active
          a.waves-attach.waves-effect(data-toggle='tab', href='#ui_tab_example_1', aria-expanded='true') 订单
        li
          a.waves-attach.waves-effect(data-toggle='tab', href='#ui_tab_example_2', aria-expanded='false') 优惠券
        li
          a.waves-attach.waves-effect(data-toggle='tab', href='#ui_tab_example_3', aria-expanded='false') 会员卡
      .tab-nav-indicator(style='left: 0px; right: 412px;')
  .account-content
    .tab-content
      #ui_tab_example_1.tab-pane.fade.active.in
        .card-main(v-for='item in myOrder', style='background-color:#fff')
          .card-inner
            a.btn.btn-flat.waves-attach.waves-effect.collapsed(data-toggle='collapse', :href='"#" + item._id', aria-expanded='false', style='text-align: left; width: 100%')
              span.collapsed-hide(style='width: 100%')
                span.icon card_membership
                span(style='margin-left: 10px') {{item.trader.name}}
                span(style='float: right; margin-right: 20px; color: #f50057', v-bind:class='{"waiting": item.status === "等待"}') {{item.status}}

              span.collapsed-show(style='width: 100%')
                span.icon card_membership
                span(style='margin-left: 10px') {{item.trader.name}}
                span(style='float: right; margin-right: 20px; color: #f50057', v-bind:class='{"waiting": item.status === "等待"}') {{item.status}}

              br
              span(style='color: #999') {{fdate(item.meta.createdAt)}}
            .collapsible-region
              table.table(style='box-shadow: none; background-color: #fff')
                tbody
                  tr(v-for='dish in item.dishes')
                    td
                      img(:src='"//og2h60o77.bkt.clouddn.com/" + dish.src', style='width: 40px; height: 40px')
                    td {{dish.name}} ¥{{dish.price}}
                    td x {{dish.number}}
                    td ¥ {{dish.price * dish.number}}
                  tr
                    td
                    td
                    td 总费用:
                    td(style='color: #FF6600; font-size: 20px') ¥ {{item.totalFee}}
            .collapsible-action
              a.btn.btn-brand.waves-attach.waves-light.waves-effect(data-backdrop='static', data-toggle='modal', href='#ul', @click='changeItem(item)', v-if='!item.assess.text', style='margin-right: 20px') 评价
              button.btn.btn-brand-accent.waves-attach.waves-light.waves-effect(@click='pay(item)', v-if='item.status === "等待"') 确认付款
      #ui_tab_example_2.tab-pane.fade
        .coupon-item(v-for='item in coupon') {{item.minus}} 元
          br
          span 截止：{{item.due}}
      #ui_tab_example_3.tab-pane.fade
        //- p
  #ul.modal.modal-va-middle.fade(aria-hidden='true', role='dialog', tabindex='-1')
    .modal-dialog.modal-xs
      .modal-content
        .modal-heading
          p.modal-title 我的评价
        .modal-inner
          span.stars(v-for='i in stars')
            span.icon(@click='assessStart(i)') {{startIcon(i)}}
          textarea.textarea(v-model='assess.text')
        .modal-footer
          p.text-right
            a.btn.btn-flat.btn-brand-accent.waves-attach.waves-effect(data-dismiss='modal') 取消
            a.btn.btn-flat.btn-brand-accent.waves-attach.waves-effect(data-dismiss='modal', @click='assessItem') 确认

</template>

<script>
import moment from 'moment'

require('moment/locale/zh-cn')

export default {
  data () {
    return {
      pre: '',
      stars: 5,
      assess: {
        text: '',
        stars: 0
      },
      item: {}
    }
  },
  computed: {
    coupon() {
      return this.$store.getters.coupon
    },
    user() {
      return this.$store.getters.user
    },
    myOrder() {
      return this.$store.getters.myOrder
    }
  },
  mounted () {
    var vm = this
    $.get('/myOrder').then(res => {
      vm.$store.commit('myOrder', res)
    })
    var sign = $.get(`/wx/signature?url=${window.location.href}`, res => {
      wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: 'wx3c3c10b371693534', // 必填，公众号的唯一标识
          timestamp: 12345, // 必填，生成签名的时间戳
          nonceStr: 'WECHAT_API_SERVICE', // 必填，生成签名的随机串
          signature: res,// 必填，签名，见附录1
          jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      })

      wx.ready(function(){
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      });
      wx.error(function(res){
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      });
    })

  },
  methods: {
    startIcon(i) {
      return i <= this.assess.stars
        ? 'star'
        : 'star_border'
    },
    assessStart(i) {
      this.assess.stars = i
    },
    changeItem(item) {
      this.item = item
    },
    assessItem() {
      let req = {
        model: 'orderings',
        _id: this.item._id,
        key: 'assess',
        value: this.assess
      }
      var vm = this
      $.ajax({
        type: 'PUT',
        url: `/api/updateOrder`,
        data: req,
        dataType: 'json'
      })
      .then(res => {
        $.get('/myOrder').then(res => {
          vm.$store.commit('myOrder', res)
        })
      })
    },
    fdate(date) {
      return moment(date).format('YYYY年MM月DD日 hh:mm')
    },
    pay(item) {
      var vm = this

      async function onBridgeReady(){
        var data = await $.get(`/wx/pay?orderId=${item._id}`)

         WeixinJSBridge.invoke(
             'getBrandWCPayRequest', data,
             function(res){
                 vm.pre = res
                 if(res.err_msg == "get_brand_wcpay_request：ok" || /ok/.test(res.err_msg)) {
                   let req = {
                     model: 'orderings',
                     _id: item._id,
                     key: 'status',
                     value: '已付款'
                   }

                   $.ajax({
                     type: 'PUT',
                     url: `/api/updateOrder`,
                     data: req,
                     dataType: 'json'
                   })
                   .then(res => {
                     $.get('/myOrder').then(res => {
                       vm.$store.commit('myOrder', res)
                     })
                   })
                 }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
             }
         );
      }
      if (typeof WeixinJSBridge == "undefined"){
         if( document.addEventListener ){
             document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
         }else if (document.attachEvent){
             document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
             document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
         }
      }else{
         onBridgeReady();
      }
    }
  },
  components: {}
}
</script>

<style lang="less">
.account-main {
  background-color: #f7f7f7;
  height: 100%;
  .stars {
    text-align: center;

    span {
      color: #ccc;
      font-size: 50px;
    }
  }
  .textarea {
    width: 95%;
    height: 100px;
    border: 1px solid#ddd;
  }
  .account-head {
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 158px;
    z-index: 2;
  }
  .account-content {
    height: e('calc(100%)');
    overflow: scroll;
    padding-top: 178px;
    position: relative;
    z-index: 1;
  }
  .user {
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    align-items: center;
    padding: 20px 30px;

    .name {
      font-size: 20px;
      color: #333;
      .city {
        font-size: 13px;
        color: #999;
      }
    }
    .img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      border: 2px solid#ddd;

      img {
        width: 100%;
        border-radius: 50%;
      }
    }
  }
}
.tab-pane {
  .card-main {
    box-shadow: 1px 1px 2px #ddd;
  }
  .waiting {
    color: #f9a825 !important;
  }
  .done {
    color: #f50057;
  }
  .card-inner {
    margin: 10px;
  }
  tr {
    background: #f7f7f7;
    td {
      text-align: center;
      line-height: 40px;
    }
  }
  .coupon-item {
    box-shadow: 0 1px 2px #eee;
    padding: 10px 0 10px 30px;
    background: #f50057;
    color: white;
    margin-bottom: 10px;
  }
  p {
    margin: 5px 0;
  }
}
.collapsible-action {
  padding-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  // button {
  //   float: right
  // }
}
</style>
