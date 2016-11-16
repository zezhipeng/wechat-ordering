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

  .col-md-5
    .card
      .card-main
        .card-inner
          .form-group.form-group-label
            label.floating-label 金额
            input.form-control(type='text', v-model='data.minus')
          .form-group.form-group-label
            label.floating-label 优惠券张数
            input.form-control(type='text', v-model.number='data.counter')
          .form-group.form-group-label
            label.floating-label 使用金额下限
            input.form-control(type='text', v-model.number='data.limit')
          .form-group.form-group-label
            label.floating-label 截止日期
            input.form-control#selector(type='text', number, v-model='data.due')
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
  computed: {},
  mounted () {
    $('#selector').pickdate()
  },
  methods: {},
  components: {}
}
</script>

<style lang="less">
</style>
