<template lang="jade">
#app
  router-view.noPrint
  .snackbar.noPrint
  .print
    h6 [商家]
    h6 {{trader.name}}
    h6 [下单时间]
    h6(v-if='print.meta') {{fdate(print.meta.createdAt)}}
    h6 [用户]
    h6(v-if='print.user') {{print.user.nickname}}
    table.table
      //- thead
      //-   tr
      //-     th 名称
      //-     th 价格
      //-     th 数量
      //-     th 总价
      tbody
        //- tr
        //-   td [商家]
        //-   td.second {{trader.name}}
        //- tr(v-if='print.meta')
        //-   td [下单时间]
        //-   td.second {{fdate(print.meta.createdAt)}}
        //- tr(v-if='print.user')
        //-   td [用户]
        //-   td.second {{print.user.nickname}}
        tr(v-for='dish in print.dishes')
          td {{dish.name}} x {{dish.number}}
          td.second ¥ {{dish.price * dish.number}}
        tr
          td 总费用:
          td.second(style='font-size: 20px') ¥ {{print.totalFee}}
</template>

<script>
import VHead from './layout/head.vue'
import moment from 'moment'

export default {
  data () {
    return {}
  },
  computed: {
    print() {
      return this.$store.getters.print
    },

    trader() {
      return this.$store.getters.trader

    }
  },
  mounted () {
    // this.$store.dispatch('init')
  },
  watch: {
    'snackbar': function (newVal, oldVal) {
      console.log(newVal)
      console.log(oldVal)
    }
  },
  methods: {
    fdate(date) {
      return moment(date).format('YYYY年MM月DD日 hh:mm')
    }
  },
  components: {
    VHead
  }
}
</script>

<style lang="less">
body, html {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  padding-bottom: 0 !important;
  background-color: #f3f3f3 !important;
}

#app {
  height: 100%;
  width: 100%;
  padding-top: 80px;

  .main {
    float: left;
    width: e('calc(100% - 250px)');
    padding-left: 20px;
  }
}


.fade-enter-active, .fade-leave-active {
  transition: all .2s ease;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}
.fade-right-enter-active, .fade-right-leave-active {
  transition: all .2s ease;
}
.fade-right-enter, .fade-right-leave-active {
  opacity: 0;
  transform: translateX(-20px);
}

.fadeLeft-enter-active, .fadeLeft-leave-active {
  transition: all .3s;
}
.fadeLeft-enter, .fadeLeft-leave-active {
  opacity: 0;
  transform: translateX(30px);
}

.floatBtn {
  position: fixed;
  bottom: 40px;
  right: 70px;
  z-index: 100;
}

.print {
  display: none;
}

@media print {
  .noPrint {
    display: none;
  }
  html, body {
    max-height: 210mm;
    width: 40mm;
  }
  .print {
    h6 {
      margin: 5px 0;
    }
    display: block;
    .table {
      width: 40mm;
    }
    tr {
      width: 40mm;
      padding: 0 10mm;
      td {
        font-size: 10px !important;
         overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .second {
        text-align: right;
        max-width: 25mm;
      }
    }
  }
}

@page {
  size: 40mm 210mm;
  padding: 0 4mm;
}
// @page :left {
//   margin: 10mm;
//   padding: 10mm;
// }
// @page :right {
//   margin: 10mm;
//   padding: 10mm;
// }
// @page :first {
//   margin: 10mm;
//   padding: 10mm;
// }

</style>
