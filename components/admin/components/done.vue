<template lang="jade">
.col-md-8
  .row
    .tile-wrap
      transition-group(name='fadeLeft')
        .tile(v-for='item, $index in done', :key='item._id')
          .tile-side.pull-left
            span.tableNumber {{$index + 1}}
          .tile-side.pull-left
            span {{item.table}}
          .tile-side.pull-left
            .avatar.avatar-sm.avatar-brand-accent
              img(:src='item.user.headimgurl')
          .tile-side.pull-left
          .tile-action
            ul.nav.nav-list.margin-no.pull-right
              li
                a.text-black-sec.waves-attach.waves-effect(@click='backToOrder(item)')
                  span 撤销
                  span.icon sync
          .tile-inner
            span.text-overflow {{item.user.nickname}}

</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {
    done() {
      return this.$store.getters.done
    }
  },
  mounted () {},
  methods: {
    backToOrder(item) {
      let req = {
        model: 'orderings',
        _id: item._id,
        key: 'status',
        value: '等待'
      }

      this.$store.dispatch('updateOrder', req)
    }
  },
  components: {}
}
</script>

<style lang="less">
</style>
