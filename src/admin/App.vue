<template lang="jade">
#app
  v-head
  v-aside
  .main
    orderings
</template>

<script>
import VHead from './layout/head.vue'
import VAside from './layout/aside.vue'
import orderings from './components/orderings.vue'

export default {
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {},
  components: {
    VHead,
    VAside,
    orderings
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
    width: e('calc(100% - 400px)');
    padding-left: 20px;
  }
}
</style>
