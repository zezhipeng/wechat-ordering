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
                span(style='float: right; margin-right: 20px; color: #666', v-bind:class='{"waiting": item.status === "等待"}') {{item.status}}

              span.collapsed-show(style='width: 100%')
                span.icon card_membership
                span(style='margin-left: 10px') {{item.trader.name}}
                span(style='float: right; margin-right: 20px; color: #666', v-bind:class='{"waiting": item.status === "等待"}') {{item.status}}

              br
              span(style='color: #999') {{fdate(item.meta.createdAt)}}
            .collapsible-region
              table.table(style='box-shadow: none; background-color: #fff')
                //- thead
                //-   tr
                //-     th 名称
                //-     th 价格
                //-     th 数量
                //-     th 总价
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
      #ui_tab_example_2.tab-pane.fade
        .coupon-item(v-for='item in coupon') {{item.minus}} 元
          br
          span 截止：{{item.due}}
      #ui_tab_example_3.tab-pane.fade
        //- p

</template>

<script>
import moment from 'moment'

require('moment/locale/zh-cn')

export default {
  data () {
    return {}
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
  },
  methods: {
    fdate(date) {
      return moment(date).format('YYYY年MM月DD日 hh:mm')
    }
  },
  components: {}
}
</script>

<style lang="less">
.account-main {
  background-color: #f7f7f7;
  height: 100%;
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
    color: #f9a825;
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
</style>
