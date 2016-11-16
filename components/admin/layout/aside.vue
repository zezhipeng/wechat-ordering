<template lang="jade">
ul.aside
  router-link(to='/orderings')
    li.waves-attach.waves-effect
      span.icon inbox
      a 新订单
  router-link(to='/doneList')
    li.waves-attach.waves-effect
      span.icon playlist_add_check
      a 已处理
  hr(style='width: 100%;')
  router-link(to='/tables')
    li.waves-attach.waves-effect
      span.icon event_seat
      a 桌位管理
  router-link(to='/classes')
    li.waves-attach.waves-effect
      span.icon class
      a 分类管理
  router-link(to='/dishes')
    li.waves-attach.waves-effect
      span.icon restaurant_menu
      a 菜品管理
  hr(style='width: 100%;')
  router-link(to='/cheer')
    li.waves-attach.waves-effect
      span.icon event_note
      a 销售报表
  router-link(to='/coupon')
    li.waves-attach.waves-effect
      span.icon account_box
      a 营销管理
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {},
  mounted () {},
  methods: {
    page(url) {
      this.$store.commit('page', url)
    }
  },
  components: {}
}
</script>

<style lang="less">
.aside {
  height: 100%;
  width: 230px;
  background-color: #f3f3f3;
  padding: 0;
  display: flex;
  flex-direction: column;
  color: #666;
  float: left;

  a {
    color: #666;
  }
  li {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .icon {
      margin: 0 30px 0 50px;
      font-size: 30px;
    }
  }
}
</style>
