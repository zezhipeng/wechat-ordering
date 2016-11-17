<template lang="jade">
.col-md-12
  .col-md-7
    table.table
      thead
        tr
          th #
          th 金额
          th 优惠券张数
          th 使用金额下限
          th 截止日期
          th 删除
      tbody
        tr(v-for='item, $index in coupon')
          td(style='color: #ff6600') {{$index + 1}}
          td {{item.minus}} 元
          td {{item.counter}} 张
          td {{item.limit}} 元
          td {{item.due}}
          td
            span.icon delete
  .col-md-5
    .card
      .card-main
        .card-inner
          .form-group.form-group-label
            label.floating-label 金额
            input.form-control(type='text', v-model.number='data.minus')
          .form-group.form-group-label
            label.floating-label 优惠券张数
            input.form-control(type='text', v-model.number='data.counter')
          .form-group.form-group-label
            label.floating-label 使用金额下限
            input.form-control(type='text', v-model.number='data.limit')
          .form-group.form-group-label
            label.floating-label 截止日期
            input.form-control#selector(type='text', v-model='data.due')
          .card-action-btn.pull-left
            span.icon add
            a.btn.btn-flat.waves-attach.waves-effect(@click='add') 添加
</template>

<script>
export default {
  data () {
    return {
      data: {}
    }
  },
  computed: {
    coupon() {
      return this.$store.getters.coupon
    }
  },
  mounted () {
    var vm = this

    $('#selector').pickdate(
      {
        format: 'yyyy 年 mm 月 dd 日', // escape any formatting characters with an exclamation mark
        formatSubmit: 'yyyy 年 mm 月 dd 日',
        onClose(e) {
          let val = $('input[name="_submit"]').val()

          vm.data.due = val
        }
      }
    )

  },
  methods: {
    add() {
      let body = this.data

      if (!body) {
        return
      }

      let req = {
        model: 'coupon',
        body: body
      }

      this.$store.dispatch('create', req)
      this.data = {}
    },
  },
  components: {}
}
</script>

<style lang="less">
</style>
