<template lang="jade">
div
  header.header.header-transparent.header-waterfall.ui-header
    ul.nav.nav-list.pull-left
      li
        a
          span.icon.icon-lg
    a.header-logo.header-affix-hide.margin-left-no.margin-right-no(data-offset-top='213', data-spy='affix', @click='init') 商户中心
    span.header-logo.header-affix.margin-left-no.margin-right-no(data-offset-top='213', data-spy='affix') About US

    ul.nav.nav-list.pull-right
      li.dropdown.margin-right
        a.dropdown-toggle.padding-left-no.padding-right-no(data-toggle='dropdown')
          span.access-hide John Smith
          span.avatar.avatar-sm
            img(alt='alt text for John Smith avatar', src='http://og2h60o77.bkt.clouddn.com/avatar-001.jpg')
        ul.dropdown-menu.dropdown-menu-right
          li
            a.padding-right-lg.waves-attach(href='/admin/signout', @click='clearCookie')
              span.icon.icon-lg.margin-right exit_to_app
              | 登出
        //-   li
        //-     a.padding-right-lg.waves-attach(href='javascript:void(0)')
        //-       span.icon.icon-lg.margin-right account_box
        //-       | Profile Settings
        //-   li
        //-     a.padding-right-lg.waves-attach(href='javascript:void(0)')
        //-       span.icon.icon-lg.margin-right add_to_photos
        //-       | Upload Photo
          //- li
          //-   a.padding-right-lg.waves-attach(href='')
          //-     span.icon.icon-lg.margin-right exit_to_app
          //-     | Logout
  nav#ui_menu.menu(aria-hidden='true', tabindex='-1')
    .menu-scroll
      .menu-content
        a.menu-logo(href='') 商户中心
        ul.nav
          li
            a.waves-attach(@click="page('tables')") 桌位管理
            //- ul#ui_menu_components.menu-collapse.collapse.in
            //-   li
            //-     a.waves-attach(href='ui-button.html') Buttons
</template>

<script>
import Cookies from 'js-cookie'

export default {
  data () {
    return {}
  },
  computed: {
  },
  mounted () {},
  methods: {
    clearCookie() {
      Cookies.remove('trader')
    },
    page(url) {
      this.$store.commit('page', url)
    },
    init () {
      this.$store.dispatch('init', {
        fn: 'page',
        url: 'tables'
      })
    }
  },
  components: {}
}
</script>

<style lang="less">
.header {
  background-color: #ff6600 !important;
  color: white !important;
}
</style>
