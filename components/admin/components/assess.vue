<template lang="jade">
.col-md-12
  .col-md-7
    //- .card
    //-   .card-main
    //-     .card-inner
    table.table
      thead
        tr
          th #
          th 用户
          th 内容
          th 星星数
      tbody
        tr(v-for='item, $index in allOrdering')
          td {{$index + 1}}
          td {{item.user.nickname}}
          td {{item.assess.text}}
          td {{item.assess.stars}}
</template>

<script>
export default {
  data () {
    return {
      data: {}
    }
  },
  computed: {
    allOrdering() {
      return this.$store.getters.allOrdering
    }
  },
  mounted () {},
  methods: {
    add(item) {
      let value = this.data

      if (!value || !value.name) {
        $('.snackbar').snackbar({
          alive: 4000,
          content: `<div>请填写完整表单</div>`
        })
        return
      }

      let req = {
        model: 'trader',
        operator: 'push',
        key: 'classes',
        value: this.data
      }

      this.$store.dispatch('update', req)
      this.data = {}
    },
    del($index) {
      var r = confirm('确认删除？')

      if (r) {
        let req = {
          model: 'trader',
          operator: 'splice',
          key: 'classes',
          value: $index
        }

        this.$store.dispatch('update', req)
      }
    },
    updateTrader() {
      this.dispatch('updateTrader', 'trader')
    }
  },
  components: {}
}
</script>

<style lang="less">
// .floatBtn {
//
// }
</style>
