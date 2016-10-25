<template lang="jade">
header.header.header-waterfall.ui-header.affix
  ul.nav.nav-list.pull-left
    li
      a(data-toggle='menu', href='#ui_menu')
        span.icon.icon-lg menu
  a.header-logo.header-affix-hide.margin-left-no.margin-right-no.affix-top(data-offset-top='213', data-spy='affix') 管理中心
  span.header-logo.header-affix.margin-left-no.margin-right-no.affix-top(data-offset-top='213', data-spy='affix') 管理中心
  ul.nav.nav-list.pull-right
    li.dropdown.margin-right
      a.dropdown-toggle.padding-left-no.padding-right-no(data-toggle='dropdown')
        span.access-hide John Smith
        span.avatar.avatar-sm
          img(alt='alt text for John Smith avatar', src='images/users/avatar-001.jpg')
      ul.dropdown-menu.dropdown-menu-right
        li
          a.padding-right-lg.waves-attach.waves-effect(href='javascript:void(0)')
            span.icon.icon-lg.margin-right account_box
            | Profile Settings
        li
          a.padding-right-lg.waves-attach.waves-effect
            span.icon.icon-lg.margin-right exit_to_app
            | Logout
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {},
  components: {}
}
</script>

<style lang="less">
.header {
  background-color: #ff6600 !important;
  color: white !important;
}
</style>
