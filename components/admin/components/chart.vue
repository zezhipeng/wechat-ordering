<template lang="jade">
.col-md-12
  .col-md-10
    .dropdown-wrap
      .dropdown.dropdown-inline
        a.btn.dropdown-toggle-btn.waves-attach.waves-effect(data-toggle='dropdown', aria-expanded='false')
          | {{select.label}}
          span.icon.margin-left-sm keyboard_arrow_down
        ul.dropdown-menu.nav
          li(v-for='item in chartFilter', @click='filter(item)')
            a.waves-attach.waves-effect {{item.label}}
    .card
      .card-main
        .card-inner
          canvas#myChart2(width='1062', height='530')
    canvas#myChart(width='1062', height='530')

</template>

<script>
import Chart from 'chart.js'

export default {
  data () {
    return {
      total: 0,
      chartFilter: [
        {label: '今日', value: 'today'},
        {label: '本月', value: 'thisMonth'},
        {label: '今年', value: 'thisYear'}
      ],
      select: {label: '今日', value: 'today'}
      // dishesData: {
      //   today: this.today,
      //   thisMonth: this.thisMonth,
      //   thisYear: this.thisYear
      // }
    }
  },
  computed: {
    thisMonth() {
      return this.$store.getters.thisMonth
    },
    thisYear() {
      return this.$store.getters.thisYear
    },
    lastMonth() {
      return this.$store.getters.lastMonth
    },
    daily() {
      return this.$store.getters.daily
    },
    today() {
      return this.$store.getters.today
    },
    // chartFilter() {
    //   return this.$store.getters.chartFilter
    // },
    dishesLabels() {
      return this.$store.getters.dishesLabels
    },
    dishesData() {
      return this.$store.getters[this.select.value]
    }
  },
  watch: {
    'select': function(newVal, val) {
      this.dishesData = this.$store.getters[newVal.value]
      this.ctx2.data.datasets[0].data = this.dishesData
      this.ctx2.update()
    },
    'dishesData': function(newVal, val) {
      console.log(newVal)
    }
  },
  mounted () {
    var labels = this.maxDay()
    var label = this.getMonth()

    // var ctx = document.getElementById("myChart")
    // var data = {
    //     labels: labels,
    //     datasets: [
    //         {
    //             label: '本月数据',
    //             fill: false,
    //             lineTension: 0.1,
    //             backgroundColor: "rgba(75,192,192,0.4)",
    //             borderColor: "rgba(75,192,192,1)",
    //             borderCapStyle: 'butt',
    //             borderDash: [],
    //             borderDashOffset: 0.0,
    //             borderJoinStyle: 'miter',
    //             pointBorderColor: "rgba(75,192,192,1)",
    //             pointBackgroundColor: "#fff",
    //             pointBorderWidth: 1,
    //             pointHoverRadius: 5,
    //             pointHoverBackgroundColor: "rgba(75,192,192,1)",
    //             pointHoverBorderColor: "rgba(220,220,220,1)",
    //             pointHoverBorderWidth: 2,
    //             pointRadius: 1,
    //             pointHitRadius: 10,
    //             data: this.daily,
    //             spanGaps: false,
    //         }
    //     ]
    // }
    //
    // var myLineChart = new Chart(ctx, {
    //   type: 'line',
    //   data: data,
    //   options: {
    //     scales: {
    //       xAxes: [{
    //         display: false
    //       }]
    //     }
    //   }
    // })
    console.log(this.dishesLabels)
    console.log(this.dishesData)
    var barData = {
        labels: this.dishesLabels,
        datasets: [
            {
                label: "销售量统计",
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
                data: this.dishesData,
            }
        ]
    }
    var ctx2 = document.getElementById("myChart2")

    this.ctx2 = new Chart(ctx2, {
        type: "bar",
        data: barData,
        options: {
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                       stepSize: 1
                   }
                }]
            },
        }
    })
  },
  methods: {
    filter(i) {
      this.select = i
    },
    maxDay(){
      var month = new Date().getMonth() + 1
      var d= new Date()
      var x = new Date(d.getFullYear(), month, 0).getDate()
      var r = []

      for (var i = 1; i < x + 1; ++i) {
        let _i = `${i}日`

        r.push(_i)
      }

      return r
    },
    getMonth() {
      var month = new Date().getMonth() + 1
      return `${month}月数据`
    }
  },
  components: {}
}
</script>

<style lang="less">
#myChart {
  display: block;
  width: 531px;
  height: 265px;
}
// #myChart2 {
//   padding: 20px;
//
// }
</style>
