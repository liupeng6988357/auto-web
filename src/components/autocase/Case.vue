<template>
  <div>
    <!--卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <div style="margin-top: 10px;">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input clearable placeholder="请输入自动化测试用例名称" v-model="queryInfo.query" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="searchAutoTestCaseList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select v-model="value" placeholder="请选择浏览器" filterable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="testEnvironment" placeholder="请选择用例执行环境" filterable>
              <el-option
                v-for="item in environments"
                :key="item.paramsvalue"
                :label="item.paramsname"
                :value="item.paramsvalue">
              </el-option>
            </el-select>
          </el-col>
          <span>
            <div>
              <el-button style="float: right; margin-right:10px;" type="primary" @click="updatecase">编辑用例</el-button>
            </div>
            <div>
              <el-button style="float: right; margin-right:10px;" type="primary" @click="redictAddTestCasePage">新增用例</el-button>
            </div>
            <div>
              <el-button style="float: right; margin-right:10px;" type="primary" @click="deleteTemplate">删除用例</el-button>
            </div>
          </span>
        </el-row>
        <el-table style="width: 100%" :data="autoTestCaseList" @selection-change="handleSelectionChange" tooltip-effect="dark" border stripe>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="proname" label="所属项目" width="200"></el-table-column>
          <el-table-column prop="casename" label="用例名称" width="220"></el-table-column>
          <el-table-column prop="casedescription" label="用例描述" width="350"></el-table-column>
          <el-table-column prop="status" label="状态" width="150">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status === 2">执行成功</el-tag>
              <el-tag type="primary" v-if="scope.row.status === 1">未执行</el-tag>
              <el-tag type="warning" v-if="scope.row.status === 3">执行失败</el-tag>
              <el-tag type="danger" v-if="scope.row.status === 4">执行错误</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createtime" label="创建时间" width="200"></el-table-column>
          <el-table-column prop="executetime" label="执行时间" width="200"></el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="查看日志" placement="top" :enterable="false">
                <el-button size="mini" type="primary" icon="el-icon-search" @click="searchLog(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="查看用例" placement="top" :enterable="false">
                <el-button size="mini" type="warning" icon="el-icon-search"
                @click="viewcase(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="执行用例" placement="top" :enterable="false">
                <el-button size="mini" type="info" icon="el-icon-caret-right"
                @click="executeCase(scope.row.id, 0)"></el-button>
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
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
    <el-drawer
      :visible.sync="drawer"
      title="AUTO_TEST_CASE_EXECUTE_LOG"
      :with-header="false"
      size="40%">
      <div v-html="auto_execute_log" style="font-size: 12px; width:764px; height: 965px; overflow: scroll;"></div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        userId: 0,
        type: 1,
        pageNum: 1,
        pageSize: 10
      },
      drawer: false,
      autoTestCaseList: [],
      rowId: 0,
      auto_execute_log: '',
      total: 0,
      multipleSelection: [],
      options: [{
        value: 'CHROME',
        label: 'chrome'
      }, {
        value: 'FIREFOX',
        label: 'firefox'
      }, {
        value: 'IE',
        label: 'IE'
      }],
      value: '',
      testEnvironment: '',
      environments: []
    }
  },
  created () {
    this.getTestEnvironmentList()
    this.getAutoTestCaseList()
  },
  methods: {
    getAutoTestCaseList: async function () {
      this.queryInfo.userId = JSON.parse(window.sessionStorage.getItem('user')).id
      window.console.log(this.queryInfo)
      const { data: res } = await this.$http.get('/templateOrCaseListByUser', { params: this.queryInfo })
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.autoTestCaseList = res.obj.autoCaseList
      this.total = res.obj.total
      window.console.log(this.autoTestCaseList)
    },
    handleSizeChange: function (newSize) {
      this.queryInfo.pageSize = newSize
      this.getAutoTestCaseList()
    },
    handleCurrentChange: function (pageNum) {
      this.queryInfo.pageNum = pageNum
      this.getAutoTestCaseList()
    },
    executeCase: async function (caseId, model) {
      if (this.value === '' || this.testEnvironment === '') {
        return this.$message.warning('请选择浏览器和测试环境！！！')
      }
      const browserType = this.value
      const testEnvironment = this.testEnvironment
      const loading = this.$loading({
        lock: true,
        text: '正在执行用例，请稍等！！！',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { data: res } = await this.$http.get('/executeAutoCase', { params: { caseId, model, browserType, testEnvironment } })
      if (res.status !== 200) {
        loading.close()
        this.getAutoTestCaseList()
        this.auto_execute_log = res.obj.executelog
        this.rowId = caseId
        return this.$message.error(res.msg)
      }
      loading.close()
      this.auto_execute_log = res.obj.executelog
      this.rowId = caseId
      this.getAutoTestCaseList()
      this.$message.success(res.msg)
    },
    searchAutoTestCaseList: async function () {
      this.getAutoTestCaseList()
    },
    redictAddTestCasePage: function () {
      this.$router.push({ path: '/addTemplate', query: { fromPage: 'autocase' } })
    },
    searchLog: async function (id) {
      const { data: res } = await this.$http.get('/findById', { params: { id } })
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      if (res.obj.executelog === '') {
        return this.$message.warning('日志未生成!!!')
      }
      this.auto_execute_log = res.obj.executelog
      this.drawer = true
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      window.console.log(this.multipleSelection)
    },
    deleteTemplate: async function () {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请先选择要删除的模板！！！')
      }
      this.$confirm('是否删除已选中的模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { data: res } = this.$http.post('/deleteAutoCase', this.multipleSelection)
        if (res.status === 200) this.getAutoTestCaseList()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '删除失败'
        })
      })
    },
    viewcase: function (autocase) {
      this.$router.push({ path: '/addTemplate', query: { fromPage: 'viewcase', param: autocase } })
    },
    updatecase: function () {
      if (this.multipleSelection.length === 1) {
        this.$router.push({ path: '/addTemplate', query: { fromPage: 'updatecase', param: this.multipleSelection[0] } })
        return
      }
      this.$message.warning('只能选一个测试用例！！！')
    },
    getTestEnvironmentList: async function () {
      const { data: res } = await this.$http.get('/findEnvironment', { params: { paramtype: 'Environment' } })
      if (res.status === 200) {
        this.environments = res.obj
      } else {
        return this.$message.error(res.msg)
      }
    }
  }
}
</script>

<style lang="less" scope>

</style>
