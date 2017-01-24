<template lang="jade">
div
  v-head
  .serverAlert.noPrint

  v-aside
  .main
    transition(name="fade-right" mode="out-in")
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
  mounted () {
    $('.serverAlert').on('click', '.close', function(e) {

      $(this).parent().remove()
    })
  },
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
