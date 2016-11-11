<template lang="jade">
div
  v-head
  v-aside
  .main
    router-view
</template>

<script>
import VHead from '../layout/head.vue'
import VAside from '../layout/aside.vue'
export default {
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {},
  components: {
    VHead,
    VAside
  }
}
</script>

<style lang="less">
.main {
  float: left;
  width: e('calc(100% - 260px)');
}
html, body {
  background: #f3f3f3 !important;
}
</style>
