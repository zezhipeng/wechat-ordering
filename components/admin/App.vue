<template lang="jade">
#app
  router-view.noPrint
  .print
    h1 {{trader.name}}
    table.table(style='box-shadow: none; background-color: #f7f7f7')
      thead
        tr
          th 名称
          th 价格
          th 数量
          th 总价
      tbody
        tr(v-for='dish in print.dishes')
          td {{dish.name}}
          td ¥{{dish.price}}
          td x {{dish.number}}
          td ¥ {{dish.price * dish.number}}
        tr
          td
          td
          td 总费用:
          td(style='color: #FF6600; font-size: 20px') ¥ {{print.totalFee}}

  .snackbar
</template>

<script>
import VHead from './layout/head.vue'

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
  methods: {},
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
    width: 58mm
  }
  .print {
    display: block;
    font-size: 9pt;
    font-weight: bold;
  }
}

@page {
  size: 55mm 210mm;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
}
@page :left {
  margin: 0;
  padding: 0;
}
@page :right {
  margin: 0;
  padding: 0;
}
@page :first {
	margin: 0;
  padding: 0;
}

</style>
