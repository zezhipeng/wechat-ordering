<template lang="jade">
.col-md-8
  .row
    .tile-wrap
      .col-md-4
        .input-group
          span.input-group-addon 起始日期
          input.form-control(placeholder='起始日期', type='date', style='width: 200px; float: left', v-model='theFilter.start')
      .col-md-4
        .input-group
          span.input-group-addon 结束日期
          input.form-control(placeholder='结束日期', type='date', style='width: 200px; float: left', v-model='theFilter.end')
      br
      h2(v-if='!done.length') 暂无数据
      transition-group(name='fadeLeft')
        .tile.col-md-12(v-for='item, $index in done', :key='item._id')
          .card-main
            .card-inner(style='margin: 0 20px')
              p
                .tile-side.pull-left
                  span.tableNumber {{$index + 1}}
                .tile-side.pull-left
                  span {{item.table}}
                .tile-side.pull-left
                  .avatar.avatar-sm.avatar-brand-accent
                    img(:src='item.user.headimgurl')
                .tile-side.pull-left
                        a.btn.btn-flat.waves-attach.waves-effect.collapsed(data-toggle='collapse', :href='"#" + item._id', aria-expanded='false')
                          span.collapsed-hide 详情
                          span.collapsed-show 详情
                .tile-action
                  ul.nav.nav-list.margin-no.pull-right
                    li
                      a.text-black-sec.waves-attach.waves-effect.del-btn(@click='backToOrder(item)')
                        span 撤销
                        span.icon sync
              .collapsible-region.collapse(aria-expanded='false', style='height: 0px;', :id='item._id')
                .tile-inner
                  span.text-overflow {{item.user.nickname}}
                    span(style='margin-left: 20px') 时间 {{moment(item.meta.createdAt).format('YYYY MM/DD hh:mm')}}
                  span 评论：{{item.assess.text ? item.assess.text : '无'}}


                  //- .tile-inner
                table.table(style='box-shadow: none; background-color: #f7f7f7')
                  thead
                    tr
                      th 名称
                      th 价格
                      th 数量
                      th 总价
                  tbody
                    tr(v-for='dish in item.dishes')
                      td {{dish.name}}
                      td ¥{{dish.price}}
                      td x {{dish.number}}
                      td ¥ {{dish.price * dish.number}}
                    tr
                      td
                      td
                      td 总费用:
                      td(style='color: #FF6600; font-size: 20px') ¥ {{item.totalFee}}
        //- .tile(v-for='item, $index in done', :key='item._id')
        //-   .tile-side.pull-left
        //-     span.tableNumber {{$index + 1}}
        //-   .tile-side.pull-left
        //-     span {{item.table}}
        //-   .tile-side.pull-left
        //-     .avatar.avatar-sm.avatar-brand-accent
        //-       img(:src='item.user.headimgurl')
        //-
        //-   .tile-action
        //-     ul.nav.nav-list.margin-no.pull-right
        //-       li
        //-         a.text-black-sec.waves-attach.waves-effect(@click='backToOrder(item)')
        //-           span 撤销
        //-           span.icon sync
        //-   .tile-inner
        //-     span.text-overflow {{item.user.nickname}}
        //-     span 评论：{{item.assess.text}}
        //-
        //-   .tile-inner
        //-     span(style='margin-right: 20px') 时间 {{moment(item.meta.createdAt).format('YYYY MM/DD hh:mm')}}

</template>

<script>
import moment from 'moment'

require('moment/locale/zh-cn')

export default {
  data () {
    return {
    }
  },
  computed: {
    theFilter() {
      return this.$store.getters.theFilter
    },
    done() {
      return this.$store.getters.done
    },
    moment() {
      return moment
    }
  },
  watch: {
    'theFilter.start': function(newVal, oldVal) {
      this.$store.commit('theFilterStart', newVal)
    },
    'theFilter.end': function(newVal, oldVal) {
      this.$store.commit('theFilterEnd', newVal)
    }
  },
  mounted () {},
  methods: {
    backToOrder(item) {
      var r = window.confirm('确认撤回？')

      if (r) {
        let req = {
          model: 'orderings',
          _id: item._id,
          key: 'status',
          value: '等待'
        }

        this.$store.dispatch('updateOrder', req)

      }
    }
  },
  components: {}
}
</script>

<style lang="less">
</style>
