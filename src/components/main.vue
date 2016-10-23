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
        recommend-content
        menu-content
        .card-footer
          footer-bar
      #ui_tab_example_2_red.tab-pane.fade
        user-order
      #ui_tab_example_3_red.tab-pane.fade
        p USER.
</template>

<script>
import recommendContent from './recommend.vue'
import menuContent from './menuContent.vue'
import userOrder from './userOrder.vue'
import footerBar from './footerBar.vue'
import _ from 'lodash'

export default {
  data () {
    return {
    }
  },
  computed: {
    orderLength () {
      return this.$store.getters.orderLength
    }
  },
  mounted () {},
  methods: {
  },
  components: {
    recommendContent,
    menuContent,
    userOrder,
    footerBar
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

.card-footer {

}

.card-inner {
  margin: 0 !important;
  padding: 0 16px 0 16px;
}
#ui_tab_example_1_red {
  padding-bottom: 60px;
}
</style>
