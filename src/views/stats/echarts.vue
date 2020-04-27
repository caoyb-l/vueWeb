<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="版本号">
              <a-input v-model="queryParam.robotCode" id="robotCode"/>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="24">
            <a-form-item label="开始时间：">
              <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" id="startTime" @change="onStartChange" />
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="24">
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
        robotCode: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  methods: {

    loadData () {
      var robotCode = document.getElementById('robotCode').value
      var startTime = document.getElementById('startTime').value
      var endTime = document.getElementById('endTime').value
      console.log('机器人编码', robotCode)
      const orgId = JSON.parse(localStorage.getItem('user')).orgId
      console.log('组织机构编码', orgId)
      return queryData(Object.assign(this.queryParam, { orgId: orgId }), '/robotLog/analyseRobotLog')
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
          text: '交互数据统计汇总',
          subtext: '总计交互次数' + param.total + '次',
          textStyle: {
            fontSize: 25
          },
          subtextStyle: {
            fontSize: 15
          },
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: '10',
          textStyle: {
            fontSize: 15
          },
          data: ['成功次数', '失败次数', '闲聊次数', '业务匹配次数']
        },
        series: [
          {
            name: '数据统计',
            type: 'pie',
            radius: '55%',
            center: ['25%', '60%'],
            data: [
              { value: param.successCount, name: '成功次数' },
              { value: param.failCount, name: '失败次数' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0)'
              }
            }
          }, {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['70%', '60%'],
            data: [
              { value: param.chatCount, name: '闲聊次数' },
              { value: param.busiCount, name: '业务匹配次数' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0.5)'
              }
            }
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
