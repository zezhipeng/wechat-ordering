<template lang="jade">
.card-main
  v-header
  .dishes-content
    recommend
    menu-content
</template>

<script>
import VHeader from '../layout/header.vue'
import recommend from './recommend.vue'
import menuContent from './menuContent.vue'

export default {
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {},
  components: {
    VHeader,
    menuContent,
    recommend
  }
}
</script>

<style lang="less">
.dishes-content {
  padding: 0 15px;
  overflow: scroll;
  width: 100%;
  height: 100%;
  -webkit-overflow-scrolling: touch;
  background: #f3f3f3;
}
</style>
