<template lang="jade">
.aside(v-bind:class='{"active": aside}')
  ul
    li(v-for='item in classes', @click='slideTo(item.name)') {{item.name}}
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {
    classes() {
      return this.$store.getters.classes
    },
    aside () {
      return this.$store.getters.aside
    }
  },
  mounted () {},
  methods: {
    slideTo(key) {
      $('.filterClasses').find('.classesTitle').each((index, item) => {
        var _key = $(item).attr('data-key')
        if (_key === key) {
          var top = $(item).offset().top

          $('.dishes-content').animate({scrollTop: top}, '500')
        }
      })
    }
  },
  components: {}
}
</script>

<style lang="less">
.aside {
  display: none;
  transform: translateX(-100%);
  margin-top: 50px;
  // padding-top: 50px;
  background: white;
  height: e('calc(100% - 48px)');
  overflow: scroll;
  box-shadow: 1px 0 3px #eee;

  &.active {
    display: block;
    transform: translateX(0);
    animation: .2s flyIn;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    // border-bottom: 1px solid#ddd;

    li {
      width: 80px;
      height: 60px;
      line-height: 60px;
      background: white;
      color: #666;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: normal;
      white-space: nowrap;
      border-bottom: 1px solid#ddd;
      a {
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
      }

    }
  }
}

@keyframes flyIn{
    from{
        transform: translateX(-100%);
    }
    to{
      transform: translateX(0);
    }
}
</style>
