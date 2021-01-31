<template>
  <div id="app">
    <div class="carvns" style="margin: 10px">
      <el-card :hidden="mainShow">
        <div id="main" style="margin-top: 20px; margin-left: -30px;" class="chart"></div>
      </el-card>
    </div>
    <div class="carvns" style="margin: 10px">
      <el-card :hidden="taskCaseShow">
        <div id="taskCase" style="margin-top: 20px; margin-left: -30px;" class="chart"></div>
      </el-card>
    </div>
    <div class="carvns" style="margin: 10px" >
      <el-card :hidden="autoShow">
        <div id="autoTask"  style="margin-top: 20px; margin-left: -30px;" class="chart"></div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userId: '',
      option: {
        title: {
          text: '用例统计',
          left: 50
        },
        tooltip: {},
        legend: {
          data: ['用例个数'],
          right: 50,
          show: true
        },
        xAxis: {
          data: [],
          type: 'category',
          axisLabel: {
            interval: 0,
            rotate: 30
          },
          axisLine: {
            color: 'rgb(128, 128, 128)'
          }
        },
        yAxis: {},
        series: [{
          name: '用例个数',
          barWidth: '40%',
          type: 'bar',
          itemStyle: {
            normal: {
              color: '#1E90FF'
            }
          },
          data: []
        }]
      },
      autoTaskOption: {
        title: {
          text: '任务执行统计',
          left: 50,
          axisPointer: {
            type: 'shadow'
          }
        },
        tooltip: {},
        legend: {
          data: ['失败次数', '成功次数'],
          right: 50,
          show: true
        },
        xAxis: {
          data: [],
          type: 'category',
          axisLabel: {
            interval: 0,
            rotate: 30
          },
          axisLine: {
            color: 'rgb(128, 128, 128)'
          }
        },
        yAxis: {},
        series: [
          {
            name: '失败次数',
            barWidth: '30%',
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#DC143C'
              }
            },
            data: []
          },
          {
            name: '成功次数',
            barWidth: '30%',
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#008000'
              }
            },
            data: []
          }
        ]
      },
      autoTaskCaseOption: {
        title: {
          text: '任务用例统计',
          left: 50,
          axisPointer: {
            type: 'shadow'
          }
        },
        tooltip: {},
        legend: {
          data: ['用例个数'],
          right: 50,
          show: true
        },
        xAxis: {
          data: [],
          type: 'category',
          axisLabel: {
            rotate: 30,
            interval: 0
          },
          axisLine: {
            color: 'rgb(128, 128, 128)'
          }
        },
        yAxis: {},
        series: [
          {
            name: '用例个数',
            barWidth: '30%',
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#1E90FF'
              }
            },
            data: []
          }
        ]
      },
      autoTestCase: '',
      autoTask: '',
      autoTaskCounts: '',
      mainShow: false,
      taskCaseShow: false,
      autoShow: false
    }
  },
  created () {
    this.userId = JSON.parse(window.sessionStorage.getItem('user')).id
    this.getPorjectName()
    this.getAutoCaseCount()
    this.getAutoTask()
    this.getAutoTaskCase()
  },
  methods: {
    drawChart: function () {
      this.autoTestCase = this.$echarts.init(document.getElementById('main'))
      this.autoTaskCounts = this.$echarts.init(document.getElementById('taskCase'))
      this.autoTask = this.$echarts.init(document.getElementById('autoTask'))
      this.autoTestCase.setOption(this.option)
      this.autoTaskCounts.setOption(this.autoTaskCaseOption)
      this.autoTask.setOption(this.autoTaskOption)
    },
    getPorjectName: async function () {
      const { data: res } = await this.$http.get('/getProjectName', { params: { userId: this.userId } })
      this.option.xAxis.data = res.obj
    },
    getAutoCaseCount: async function () {
      const { data: res } = await this.$http.get('/getAutoTestCaseCountList', { params: { userId: this.userId, type: 1 } })
      this.option.series[0].data = res.obj
    },
    getAutoTask: async function () {
      const { data: res } = await this.$http.get('/getAllTaskList', { params: { userId: this.userId } })
      const taskList = res.obj
      for (let i = 0; i < taskList.length; i++) {
        this.autoTaskOption.xAxis.data.push(taskList[i].taskname)
        this.autoTaskOption.series[0].data.push(taskList[i].fail)
        this.autoTaskOption.series[1].data.push(taskList[i].success)
      }
    },
    getAutoTaskCase: async function () {
      const { data: res } = await this.$http.get('/getAllTaskList', { params: { userId: this.userId } })
      const taskList = res.obj
      for (let i = 0; i < taskList.length; i++) {
        this.autoTaskCaseOption.series[0].data.push(taskList[i].count)
        this.autoTaskCaseOption.xAxis.data.push(taskList[i].taskname)
      }
    }
  },
  mounted () {
    this.drawChart()
  },
  watch: {
    // 观察option的变化
    option: {
      handler (newVal, oldVal) {
        this.autoTestCase.setOption(newVal)
        this.drawChart()
      },
      deep: true // 对象内部属性的监听，关键。
    },
    autoTaskOption: {
      handler (newVal, oldVal) {
        this.autoTask.setOption(newVal)
        this.drawChart()
      },
      deep: true // 对象内部属性的监听，关键。
    },
    autoTaskCaseOption: {
      handler (newVal, oldVal) {
        console.log(newVal)
        this.autoTaskCounts.setOption(newVal)
        this.drawChart()
      },
      deep: true // 对象内部属性的监听，关键。
    }
  }
}
</script>

<style lang="less" scoped>
.carvns {
  height: 350px;
  margin: 0;
  padding: 0;
  width: 535px;
  display: inline-block;
}
.chart {
  height: 350px;
  margin: 0;
  padding: 0;
  width: 535px;
}
</style>
