<template lang="jade">
.col-md-12
  .col-md-10
    .col-md-5.col-sm-5
      h2 今日售额 {{today}} 元
    .col-md-5.col-sm-5
      h2 本月售额 {{thisMonth}} 元
    canvas#myChart(width='1062', height='530')
    canvas#myChart2(width='1062', height='530')

</template>

<script>
import Chart from 'chart.js'

export default {
  data () {
    return {}
  },
  computed: {
    thisMonth() {
      return this.$store.getters.thisMonth
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
    dishesLabels() {
      return this.$store.getters.dishesLabels
    },
    dishesData() {
      return this.$store.getters.dishesData
    }
  },
  mounted () {
    var labels = this.maxDay()
    var label = this.getMonth()

    var ctx = document.getElementById("myChart")
    var data = {
        labels: labels,
        datasets: [
            {
                label: '本月数据',
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: this.daily,
                spanGaps: false,
            }
        ]
    }

    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        scales: {
          xAxes: [{
            display: false
          }]
        }
      }
    })


    var barData = {
        labels: this.dishesLabels,
        datasets: [
            {
                label: "本月菜品销售量",
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

    new Chart(ctx2, {
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
</style>
