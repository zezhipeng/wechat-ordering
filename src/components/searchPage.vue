<template lang="jade">
.search-page
  .search-header
    span.icon(@click='backTo') arrow_back
    input(placeholder='搜索')

</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {
    backTo () {
      this.$emit('back')
    }
  },
  components: {}
}
</script>

<style lang="less">
.search-page {
  position: absolute;
  top: 65px;
  left: 0;
  width: 100vw;
  height: e('calc(100vh - 65px)');
  background: #f5f5f5;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  z-index: 12;

  .search-header {
    background: white;
    position: fixed;
    bottom: 0;
    box-shadow: 0 -2px 2px -1px #ddd;
    padding: 0 30px;
    display: flex;
    justify-content: space-around;
    height: 50px;
    width: 100%;
    align-items: center;
    color: #666;

    span {
      margin-right: 30px;
    }

    input {
      background-color: transparent;
      background-image: none;
      border: 0;
      border-bottom: 1px solid#fff;
      border-radius: 0;
      color: inherit;
      display: block;
      font-size: 14px;
      height: 36px;
      line-height: 20px;
      padding: 8px 0 7px;
      width: 100%;
    }
  }
}
</style>
