<template>
  <div>
      <!--卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <div style="margin-top: 10px;">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input clearable placeholder="请输入任务名称" v-model="queryInfo.query" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="getTaskList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select v-model="value" placeholder="请选择template执行浏览器" filterable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <span>
            <div>
              <el-button style="float: right; margin-right:10px;" type="primary" @click="deleteTask">删除任务</el-button>
            </div>
            <div>
              <el-button style="float: right; margin-right:10px;" type="primary" @click="updateTask">编辑任务</el-button>
            </div>
            <div>
              <el-button style="float: right; margin-right:10px;" type="primary" @click="addTask">新增任务</el-button>
            </div>
          </span>
        </el-row>
        <el-table style="width: 100%" :data="taskList" @selection-change="handleSelectionChange" tooltip-effect="dark" border stripe>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="proname" label="项目名称" width="150px"></el-table-column>
          <el-table-column prop="taskname" label="任务名称"></el-table-column>
          <el-table-column prop="taskdescription" label="任务描述"></el-table-column>
          <el-table-column prop="count" label="用例个数" width="100px"></el-table-column>
          <el-table-column prop="taskcreatetime" label="创建时间"></el-table-column>
          <el-table-column prop="taskupdateTime" label="修改时间"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status === 2">执行成功</el-tag>
              <el-tag type="primary" v-if="scope.row.status === 1">未执行</el-tag>
              <el-tag type="warning" v-if="scope.row.status === 3">执行失败</el-tag>
              <el-tag type="danger" v-if="scope.row.status === 4">执行错误</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="executetime" label="执行时间"></el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="临时执行" placement="top" :enterable="false">
                <el-button size="mini" type="primary" icon="el-icon-video-play" @click="tempExecuteTask(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="定时配置执行" placement="top" :enterable="false">
                <el-button size="mini" type="warning" icon="el-icon-s-tools" @click="setTimeOpen"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="更新任务用例" placement="top" :enterable="false">
                <el-button size="mini" type="primary" icon="el-icon-circle-plus"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!--分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageNum"
          :page-size="queryInfo.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加测试项目弹框 -->
    <el-dialog
      title="新增测试任务"
      :visible.sync="addTaskDialog"
      width="60%"
      height= "50%"
      @close="addDialogClose">
      <div style="margin-top: 15px;">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-input clearable placeholder="请输入自动化测试用例名称" v-model="queryCaseInfo.query" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="getCaseList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select v-model="taskQuery.proid" placeholder="请选择项目" filterable @change="showCaseList">
              <el-option
                v-for="item in projectList"
                :key="item.id"
                :label="item.projectname"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input v-model="taskQuery.taskname" placeholder="请输入任务名称"></el-input>
          </el-col>
          <el-col :span="4">
            <el-input v-model="taskQuery.taskdescription" placeholder="请输入任务描述"></el-input>
          </el-col>
          <span>
             <div>
              <el-button style="float: right; margin-right:10px;" type="primary" @click="addCaseInTask">加入任务</el-button>
            </div>
          </span>
        </el-row>
        <el-table style="width: 100%" :data="autoCaseList" @selection-change="handleSelectionChange" tooltip-effect="dark" border stripe>
            <el-table-column type="selection" width="55" ></el-table-column>
            <el-table-column prop="proname" label="所属项目"></el-table-column>
            <el-table-column prop="casename" label="用例名称"></el-table-column>
            <el-table-column prop="casedescription" label="用例描述"></el-table-column>
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.status === 2">执行成功</el-tag>
                <el-tag type="primary" v-if="scope.row.status === 1">未执行</el-tag>
                <el-tag type="warning" v-if="scope.row.status === 3">执行失败</el-tag>
                <el-tag type="danger" v-if="scope.row.status === 4">执行错误</el-tag>
              </template>
            </el-table-column>
          </el-table>

          <!--分页 -->
          <el-pagination
            @size-change="addTaskPageSizeChange"
            @current-change="addTaskPageCurrentChange"
            :current-page="queryCaseInfo.pageNum"
            :page-size="queryCaseInfo.pageSize"
            :page-sizes="[5, 10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count">
          </el-pagination>
        </div>
        <!-- 内容底部区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addTaskDialog = false">取 消</el-button>
          <el-button @click="saveTask" type="primary">保 存</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        userId: 0,
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      queryCaseInfo: {
        query: '',
        projectId: 0,
        pageNum: 1,
        pageSize: 5,
        type: 1
      },
      count: 0,
      addTaskDialog: false,
      taskList: [],
      autoCaseList: [],
      projectList: [],
      options: [{
        value: 'CHROME',
        label: 'chromebrowser'
      }, {
        value: 'FIREFOX',
        label: 'firefoxbrowser'
      }, {
        value: 'IE',
        label: 'iebrowser'
      }],
      value: '',
      multipleSelection: [],
      taskQuery: {
        taskname: '',
        taskdescription: '',
        caseList: '',
        proid: 0
      }
    }
  },
  created () {
    this.getTaskList()
  },
  methods: {
    addTaskPageSizeChange: function (newSize) {
      this.queryCaseInfo.pageSize = newSize
      this.getCaseList()
    },
    addTaskPageCurrentChange: function (newNum) {
      this.queryCaseInfo.pageNum = newNum
      this.getCaseList()
    },
    getTaskList: async function () {
      this.queryInfo.userId = JSON.parse(window.sessionStorage.getItem('user')).id
      const { data: res } = await this.$http.get('/getTaskList', { params: this.queryInfo })
      if (res.status !== 200) {
        return this.$message.waring(res.msg)
      }
      this.total = parseInt(res.log)
      this.taskList = res.obj
    },
    tempExecuteTask: async function (taskId) {
      if (this.value === '') {
        return this.$message.warning('请先选择要执行的浏览器！！！')
      }
      const browserType = this.value
      const model = 1
      const loading = this.$loading({
        lock: true,
        text: '正在执行用例，请稍等！！！',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { data: res } = await this.$http.get('/executeAutoTask', { params: { taskId, model, browserType } })
      if (res.status !== 200) {
        loading.close()
        this.getTaskList()
        return this.$message.error(res.msg)
      }
      loading.close()
      this.getTaskList()
      this.$message.success(res.msg)
    },
    showCaseList: function () {
      this.queryCaseInfo.projectId = parseInt(this.taskQuery.proid)
      this.getCaseList()
    },
    addTask: async function () {
      this.taskQuery.caseList = ''
      this.taskQuery.proid = ''
      this.autoCaseList = []
      this.queryInfo.userId = JSON.parse(window.sessionStorage.getItem('user')).id
      const { data: res } = await this.$http.get('/prolist', { params: { userId: this.queryInfo.userId } })
      if (res.status !== 200) {
        return this.$message.waring(res.msg)
      }
      this.projectList = res.obj
      this.addTaskDialog = true
    },
    getCaseList: async function () {
      const { data: res } = await this.$http.get('/templateOrCaseListByPro', { params: this.queryCaseInfo })
      if (res.status !== 200) {
        this.autoCaseList = []
        this.count = 0
        return this.$message.warning(res.msg)
      }
      this.autoCaseList = res.obj.autoCaseList
      this.count = res.obj.total
    },
    addCaseInTask: function () {
      for (let index = 0; index < this.multipleSelection.length; index++) {
        this.taskQuery.caseList += this.multipleSelection[index].id + ','
      }
      this.$message.success('添加成功！！！')
      console.info(this.taskQuery.caseList)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    saveTask: async function () {
      const { data: res } = await this.$http.post('/saveTask', this.taskQuery)
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.getTaskList()
      this.addTaskDialog = false
      return this.$message.success(res.msg)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
