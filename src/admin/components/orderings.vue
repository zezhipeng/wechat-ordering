<template lang="jade">
.tile-wrap
  .tile
    .tile-side.pull-left
      span.tableNumber 1
    .tile-side.pull-left

      .avatar.avatar-sm.avatar-brand-accent
        img(src='images/1.jpg')
    .tile-action
      ul.nav.nav-list.margin-no.pull-right
        li
          a.text-black-sec.waves-attach.waves-effect(href='javascript:void(0)')
            span.icon check
        li
          a.text-black-sec.waves-attach.waves-effect(href='javascript:void(0)')
            span.icon delete
    .tile-inner
      span.name 红烧肉 x 1
      span.time 已等待 10 分钟
  .tile
    .tile-side.pull-left
      span.tableNumber 1
    .tile-side.pull-left

      .avatar.avatar-sm.avatar-brand-accent
        img(src='images/1.jpg')
    .tile-action
      ul.nav.nav-list.margin-no.pull-right
        li
          a.text-black-sec.waves-attach.waves-effect(href='javascript:void(0)')
            span.icon check
        li
          a.text-black-sec.waves-attach.waves-effect(href='javascript:void(0)')
            span.icon delete
    .tile-inner
      span.name 红烧肉 x 2
      span.username 明月光照沟
      span.time 已等待 10 分钟
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {},
  components: {

  }
}
</script>

<style lang="less">

.avatar {
  height: 32px;
  line-height: 32px;
  width: 32px;
  display: flex !important;
  justify-content: center;
  align-items: center;

}

.tableNumber {
  color: #ff6600;
  font-size: 25px;
}
.tile-inner {
  .name {
    width: 170px;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }
  .username {
    color: #ff6600;
  }
  .time {

  }
}
</style>
