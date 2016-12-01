<template lang="jade">
.col-md-8
  .row
    .tile-wrap
      transition-group(name='fadeLeft')
        .tile.tile-column(v-for='item, $index in orderings', :key='item._id')
          .tile-content(@click='showTile($index)')
            .tile-side.pull-left
              span.tableNumber {{$index + 1}}
            .tile-side.pull-left
              span {{item.table}}
            .tile-side.pull-left
              .avatar.avatar-sm.avatar-brand-accent
                img(:src='item.user.headimgurl')
            .tile-side.pull-left
              span.name {{item.user.nickname}}
            .tile-inner
              span.time 历时 {{moment.preciseDiff(item.meta.createdAt, Date.now())}}
            //- .tile-action.tile-action-show
            //-   ul.nav.nav-list.margin-no.pull-right
            //-     li
            //-       a.text-black-sec.waves-attach.waves-effect
            //-         span.icon view_list
          transition(name='growUp')
            .tile-footer(v-if='tileCollapse == $index')
              .tile-footer-content
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

              .tile-action
                a.btn.btn-flat.waves-attach.waves-effect(data-toggle='tile', href='#ui_tile_example_2', @click='print(item)')
                  span.icon print
                  | 打印
                a.btn.btn-flat.waves-attach.waves-effect(@click='orderFinish(item)')
                  span.icon check
                  | 完成
</template>

<script>
import moment from 'moment'
import _ from 'lodash'

require('moment/locale/zh-cn')

export default {
  data () {
    return {
      tileCollapse: null,
      orderCache: {}
    }
  },
  computed: {
    orderings() {
      return this.$store.getters.orderings
    },

    moment() {
      var STRINGS = {
          nodiff: '',
          year: '年',
          years: '年',
          month: '月',
          months: '月',
          day: '天',
          days: '天',
          hour: '小时',
          hours: '小时',
          minute: '分钟',
          minutes: '分钟',
          second: '秒',
          seconds: '秒',
          delimiter: ' '
      }

      function pluralize(num, word) {
          return num + ' ' + STRINGS[word + (num === 1 ? '' : 's')];
      }

      function buildStringFromValues(yDiff, mDiff, dDiff, hourDiff, minDiff, secDiff){
          var result = [];

          if (yDiff) {
              result.push(pluralize(yDiff, 'year'));
          }
          if (mDiff) {
              result.push(pluralize(mDiff, 'month'));
          }
          if (dDiff) {
              result.push(pluralize(dDiff, 'day'));
          }
          if (hourDiff) {
              result.push(pluralize(hourDiff, 'hour'));
          }
          if (minDiff) {
              result.push(pluralize(minDiff, 'minute'));
          }
          if (secDiff) {
              result.push(pluralize(secDiff, 'second'));
          }

          return result.join(STRINGS.delimiter);
      }

      moment.fn.preciseDiff = function(d2, returnValueObject) {
          return moment.preciseDiff(this, d2, returnValueObject);
      };

      moment.preciseDiff = function(d1, d2, returnValueObject) {
          var m1 = moment(d1), m2 = moment(d2), firstDateWasLater;

          m1.add(m2.utcOffset() - m1.utcOffset(), 'minutes'); // shift timezone of m1 to m2

          if (m1.isSame(m2)) {
              return STRINGS.nodiff;
          }
          if (m1.isAfter(m2)) {
              var tmp = m1;
              m1 = m2;
              m2 = tmp;
              firstDateWasLater = true;
          } else {
              firstDateWasLater = false;
          }

          var yDiff = m2.year() - m1.year();
          var mDiff = m2.month() - m1.month();
          var dDiff = m2.date() - m1.date();
          var hourDiff = m2.hour() - m1.hour();
          var minDiff = m2.minute() - m1.minute();
          var secDiff = m2.second() - m1.second();

          if (secDiff < 0) {
              secDiff = 60 + secDiff;
              minDiff--;
          }
          if (minDiff < 0) {
              minDiff = 60 + minDiff;
              hourDiff--;
          }
          if (hourDiff < 0) {
              hourDiff = 24 + hourDiff;
              dDiff--;
          }
          if (dDiff < 0) {
              var daysInLastFullMonth = moment(m2.year() + '-' + (m2.month() + 1), "YYYY-MM").subtract(1, 'M').daysInMonth();
              if (daysInLastFullMonth < m1.date()) { // 31/01 -> 2/03
                  dDiff = daysInLastFullMonth + dDiff + (m1.date() - daysInLastFullMonth);
              } else {
                  dDiff = daysInLastFullMonth + dDiff;
              }
              mDiff--;
          }
          if (mDiff < 0) {
              mDiff = 12 + mDiff;
              yDiff--;
          }

          if (returnValueObject) {
              return {
                  "years"   : yDiff,
                  "months"  : mDiff,
                  "days"    : dDiff,
                  "hours"   : hourDiff,
                  "minutes" : minDiff,
                  "seconds" : secDiff,
                  "firstDateWasLater" : firstDateWasLater
              };
          } else {
              return buildStringFromValues(yDiff, mDiff, dDiff, hourDiff, minDiff, secDiff);
          }
      }
      return moment
    }
  },
  mounted () {

  },
  methods: {
    print(item) {
      this.$store.commit('print', item)
      setTimeout(function() {
        window.print()
      }, 500)
    },
    orderFinish(item) {
      const vm = this

      let req = {
        model: 'orderings',
        _id: item._id,
        key: 'status',
        value: '完成'
      }

      this.orderCache = req

      $('.snackbar').snackbar({
        alive: 4000,
        content: `<div>已移动到"已完成"中 <a class="backToOrder" data-dismiss='snackbar'>撤销</a></div>`
      })

      this.tileCollapse = null
      this.$store.dispatch('updateOrder', req)

      $('.backToOrder').click(e => {
        vm.orderCache.value = '等待'
        vm.tileCollapse = null
        vm.$store.dispatch('updateOrder', vm.orderCache)
      })
    },
    backToOrder(item) {
      let req = {
        model: 'orderings',
        _id: item._id,
        key: 'status',
        value: '等待'
      }

      this.tileCollapse = null
      this.$store.dispatch('updateOrder', req)
    },
    totalFee(dishes) {
      return _.reduce(dishes, (total, item) => {
        return total += item.price * item.number
      }, 0)
    },
    showTile($index) {
      if (this.tileCollapse === $index) {
        this.tileCollapse = null
      } else {
        this.tileCollapse = $index
      }
    }
  },
  components: {

  }
}
</script>

<style lang="less">

.avatar {
  height: 32px;
  line-height: 32px;
  width: 32px;
  display: flex !important;
  justify-content: center;
  align-items: center;
}

.tableNumber {
  color: #ff6600;
  font-size: 25px;
}

.tile-column {
  flex-direction: column;

  .tile-content {
    display: flex;
  }

  .tile-footer {
    background-color: #F7F7F7;
    .tile-action {
      background: #f6f6f6;
      border-bottom: 1px solid#ddd;
    }

    .tile-footer-content {
      padding: 5px 20px;
    }
    .tile-action {
      border-top: 1px solid#ddd;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-left: 20px
    }
  }
}

.tile-inner {
  .name {
    width: 170px;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }
  .username {
    color: #ff6600;
  }
  .time {

  }
}

.growUp-enter-active {
  transition: all .3s ease;
  transform-origin: top;
}
.growUp-leave-active {
  transition: all 0 cubic-bezier(1.0, 0.5, 0.8, 1.0);
  transform-origin: top;
}
.growUp-enter, .growUp-leave-active {
  opacity: 0;
  transform: scale(1, 0);
}

</style>
