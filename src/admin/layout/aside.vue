<template lang="jade">
ul.aside
  li.waves-attach.waves-effect
    span.icon inbox
    span 新订单
  li.waves-attach.waves-effect
    span.icon playlist_add_check
    span 已处理
  li.waves-attach.waves-effect
    span.icon delete
    span 回收站
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {},
  mounted () {},
  methods: {},
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
