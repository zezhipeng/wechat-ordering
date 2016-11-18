<template lang="jade">
#app
  //- v-head
  router-view
  .snackbar
</template>

<script>
import VHead from './layout/head.vue'
// import VAside from './layout/aside.vue'
// import orderings from './components/orderings.vue'
// import tables from './components/tables.vue'
// import dishes from './components/dishes.vue'

export default {
  data () {
    return {}
  },
  computed: {
    // page() {
    //   return this.$store.getters.page
    // }
  },
  mounted () {
    // this.$store.dispatch('init')
  },
  methods: {},
  components: {
    VHead
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
    width: e('calc(100% - 250px)');
    padding-left: 20px;
  }
}


.fade-enter-active, .fade-leave-active {
  transition: all .2s ease;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}

.fadeLeft-enter-active, .fadeLeft-leave-active {
  transition: all .3s;
}
.fadeLeft-enter, .fadeLeft-leave-active {
  opacity: 0;
  transform: translateX(30px);
}

.floatBtn {
  position: fixed;
  bottom: 40px;
  right: 70px;
  z-index: 100;
}
</style>
