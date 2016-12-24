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
          th 类别
          th 删除
      tbody
        tr(v-for='item, $index in classes')
          td {{$index + 1}}
          td {{item.name}}
          td
            a(@click='del(item)')
              span.icon.waves-attach.waves-effect delete
  .col-md-5
    .card
      .card-main
        .card-inner
          .form-group.form-group-label
            label.floating-label 名称
            input.form-control(type='text', v-model='data.name')
          .card-action-btn.pull-left
            span.icon add
            a.btn.btn-flat.waves-attach.waves-effect(@click='add(data)') 添加
        .fbtn-container
  //- .floatBtn
  //-   a.fbtn.fbtn-brand-accent.fbtn-lg.waves-attach.waves-circle.waves-light.waves-effect(style='padding-top: 18px;', @click='updateTrader')
  //-     span.icon save
</template>

<script>
export default {
  data () {
    return {
      data: {}
    }
  },
  computed: {
    classes() {
      return this.$store.getters.trader.classes
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
      let req = {
        model: 'trader',
        operator: 'splice',
        key: 'classes',
        value: $index
      }

      this.$store.dispatch('update', req)
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
