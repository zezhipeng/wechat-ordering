<template lang="jade">
.col-md-8
  table.table
    thead
      tr
        th 昵称
        th 头像
        th 性别
        th 城市
    tbody
      tr(v-for='item in users')
        td {{item.nickname}}
        td
          img.img-responsive(:src='item.headimgurl')
        td {{item.sex == '1' ? '男' : '女'}}
        td {{item.city}}

</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {
    users() {
      return this.$store.getters.users
    }
  },
  mounted () {},
  methods: {},
  components: {}
}
</script>

<style lang="less">
</style>
