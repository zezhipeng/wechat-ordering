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
        //- .card-header
        //- .card-img
        //-   img(alt='alt text', src='images/landscape.jpg', style='width: 100%;')
        //-   p.card-img-heading 新桌子
        .card-inner
          .form-group.form-group-label
            label.floating-label 名称
            input.form-control(type='text', v-model='data.name')
          .card-action-btn.pull-left
            span.icon add
            a.btn.btn-flat.waves-attach.waves-effect(@click='add(data)') 添加
        //- .card-action
        //-     .card-action-btn.pull-left
        //-       span.icon check
        //-       a.btn.btn-flat.waves-attach.waves-effect 添加
        .fbtn-container
  .floatBtn
    a.fbtn.fbtn-brand-accent.fbtn-lg.waves-attach.waves-circle.waves-light.waves-effect(style='padding-top: 18px;', @click='updateTrader')
      span.icon save
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
      // console.log(this.classes)
      this.classes.push(item)
      // console.log(this.classes)
      this.data = {}
    },
    del($index) {
      this.classes.splice($index, 1)
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
