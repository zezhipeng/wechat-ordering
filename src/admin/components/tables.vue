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
          th 名称
          th 人数
          th 删除
      tbody
        tr(v-for='item, $index in tables')
          td {{$index}}
          td {{item.name}}
          td {{item.size}}
          td
            a(@click='del($index)')
              span.icon.waves-attach.waves-effect delete
  .col-md-5
    .card
      .card-main
        //- .card-header
        //- .card-img
        //-   img(alt='alt text', src='images/landscape.jpg', style='width: 100%;')
        //-   p.card-img-heading 新桌子
        .card-inner
          .form-group.form-group-label
            label.floating-label 名称
            input.form-control(type='text', v-model='data.name')
          .form-group.form-group-label
            label.floating-label 人数
            input.form-control(type='text', number, v-model='data.size')
          .card-action-btn.pull-left
            span.icon add
            a.btn.btn-flat.waves-attach.waves-effect(@click='add') 添加
        //- .card-action
        //-     .card-action-btn.pull-left
        //-       span.icon check
        //-       a.btn.btn-flat.waves-attach.waves-effect 添加
</template>

<script>
export default {
  data () {
    return {
      data: {}
    }
  },
  computed: {
    tables() {
      return this.$store.getters.trader.tables
    }
  },
  mounted () {},
  methods: {
    add() {
      this.tables.push(this.data)
    },
    del($index) {
      this.tables.splice($index, 1)
    }
  },
  components: {}
}
</script>

<style lang="less">
</style>
