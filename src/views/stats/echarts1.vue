<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="开始时间：">
              <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" id="startTime" @change="onStartChange" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="结束时间：">
              <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" id="endTime" @change="onEndChange"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-button type="primary" @click="loadData()">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <hr>
    <br><br>
    <div ref="chart" style="width: 100%;height: 500px;"></div>
  </a-card>
</template>
<script>
import { queryData } from '@/api/common'
const echarts = require('echarts')
export default {
  data () {
    return {
      queryParam: {
        startTime: '',
        endTime: ''
      }
    }
  },
  methods: {

    loadData () {
      const orgId = JSON.parse(localStorage.getItem('user')).orgId
      console.log('组织机构编码', orgId)
      return queryData(Object.assign(this.queryParam, { orgId: orgId }), '/robotLog/tobotTopTen')
        .then(res => {
          console.log(res)
          // var res=JSON.parse(res);
          this.initCharts(res)
          return res
        })
    },

    initCharts (param) {
      const myChart = this.$echarts.init(this.$refs.chart)
      console.log(this.$refs.chart)
      var option = {
        title: {
          text: '交互数据TOP10统计',
          x: 'center',
          textStyle: {
            fontSize: 25
          }
        },

        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: '{a} <br/>{b} : {c}'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['TOP1', 'TOP2', 'TOP3', 'TOP4', 'TOP5', 'TOP6', 'TOP7', 'TOP8', 'TOP9', 'TOP10'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '数据统计',
            type: 'bar',
            barWidth: '60%',
            data: param
          }
        ]

      }
      myChart.setOption(option)
      window.onresize = function () {
        myChart.resize()
      }
    },

    onStartChange (date, dateString) {
      this.queryParam.startTime = dateString
      console.log(date, dateString)
    },
    onEndChange (date, dateString) {
      this.queryParam.endTime = dateString
      console.log(date, dateString)
    }
  },
  mounted () {
    this.loadData()
  }
}

</script>
