<template lang="jade">
.col-md-12
  .row
    .col-md-6
      .card(v-for='user in users')
        .card-main
          .card-inner
            p {{user.nickname}}
              span(style='float: right; font-size: 20px; cursor: pointer;', @click='pushCoupon(user)')
                span.icon edit
                span 修改
            table.table(v-for='item, index in user.coupon', style='box-shadow: none; margin-bottom: 0; margin-top: 0')
              tbody
                tr
                  td {{item.minus}} 元
                  td {{item.due}}
    .col-md-6
      table.table
        thead
          tr
            th #
            th 金额
            th 有效日期
            th 选择
        tbody
          tr(v-for='item, index in coupon')
            td {{index + 1}}
            td {{item.minus}} 元
            td {{item.due}} {{item.checked}}
            td
              .checkbox.checkbox-adv
                label(:for='item._id')
                  input.access-hide(type='checkbox', :id='item._id', :name='item._id', v-model='item.checked')
                  span.checkbox-circle
                  span.checkbox-circle-check
                  span.checkbox-circle-icon.icon done




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
      console.log(data)
      data.checked = !data.checked
      // let item = data.item
      // let i = data.i
      // let $index = data.$index
      //
      // let exit = item.coupon.indexOf(i._id)
      //
      // if (exit > -1) {
      //   this.spliceCoupon(item, i, $index)
      // } else {
      //   this.pushCoupon(item, i)
      // }
    },
    toggleCheck(index) {
      this.$store.commit('toggleCheck', index)
    },
    pushCoupon(item) {
      var _coupon = this.coupon.filter(i => i.checked)
      _coupon = _coupon.map(i => i._id)

      let req = {
        model: 'user',
        // operator: 'push',
        key: 'coupon',
        value: _coupon,
        _id: item._id
      }
      console.log(_coupon)
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
