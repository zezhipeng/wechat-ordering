<template lang="jade">
.col-md-12
  .row
    .col-md-6
      table.table
        thead
          tr
            th 昵称
            th 头像
            th 性别
            th 城市
            th 优惠券
        tbody
          tr(v-for='item, $index in users')
            td {{item.nickname}}
            td
              img.img-responsive(:src='item.headimgurl', style='width: 30px')
            td {{item.sex == '1' ? '男' : '女'}}
            td {{item.city}}
            td(v-on:dragover='dragover' v-on:drop='drop(item)')
              ul.nav.nav-list.margin-no
                li.dropdown.open
                  a.dropdown-toggle.text-black.waves-attach.waves-effect(data-toggle='dropdown', aria-expanded='true')
                    span.icon(style='margin-left: 10px; color: #ff6600; font-size: 20px') view_list
                  ul.dropdown-menu.dropdown-menu-right
                    li(v-for='i, index in item.coupon')
                      a 减:{{i.minus}}元 上限金额:{{i.limit}}元 截止日期{{i.due}}
                        span.icon(style='margin-left: 10px; color: #ff6600; font-size: 20px', @click='deleteCoupon({item: item, index: index})') delete
    .col-md-6
      .tile-wrap
        .tile(v-for='item in coupon', draggable="true", v-on:dragstart='dragstart(item)')
          .tile-side.pull-left 减 {{item.minus}} 元
          .tile-side.pull-left 上限金额 {{item.limit}} 元
          .tile-inner  截止日期 {{item.due}}


</template>

<script>
import _ from 'lodash'

export default {
  data () {
    return {
      dropping: '',
      arr: []
    }
  },
  computed: {
    users() {
      return this.$store.getters.users
    },
    coupon() {
      return this.$store.getters.coupon
    }
  },
  created() {
  },
  mounted () {
  },
  methods: {
    drop(item) {
      let exit = _.find(item.coupon, this.dropping)
      if (!exit) {
        this.pushCoupon(item, this.dropping)
      }
    },
    dragover(e) {
      e.preventDefault()
      // console.log(e)
    },
    dragstart(item) {
      this.dropping = item
    },
    deleteCoupon(data) {
      let item = data.item
      let index = data.index
      this.spliceCoupon(item, index)
    },
    checkCoupon(data) {
      let item = data.item
      let i = data.i
      let $index = data.$index

      let exit = item.coupon.indexOf(i._id)

      if (exit > -1) {
        this.spliceCoupon(item, i, $index)
      } else {
        this.pushCoupon(item, i)
      }
    },
    pushCoupon(item, i) {
      let req = {
        model: 'user',
        operator: 'push',
        key: 'coupon',
        value: i._id,
        _id: item._id
      }

      this.$store.dispatch('update', req)
    },
    spliceCoupon(item, $index) {
      let req = {
        model: 'user',
        operator: 'splice',
        key: 'coupon',
        value: $index,
        _id: item._id
      }

      this.$store.dispatch('update', req)
    }
  },
  components: {}
}
</script>

<style lang="less">
.table {
  tr {
    td {
      vertical-align: middle;
    }
  }
}

.collapsible-region {
  ul {
    padding: 0;
    list-style: none;
  }
}
</style>
