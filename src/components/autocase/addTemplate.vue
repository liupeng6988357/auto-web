<template>
  <div>
    <el-card style="margin-top: 10px">
      <div slot="header" class="clearfix">
        <span>
          <div>
            <el-button style="float: right; margin-right:15px;" type="primary" @click="saveAutoTest" :disabled="isOperate">保存</el-button>
          </div>
          <div>
            <el-button style="float: right; margin-right:15px;" type="primary" @click="openAddDialog" :disabled="isOperate">添加步骤</el-button>
          </div>
          <div>
            <el-button style="float: right; margin-right:15px;" type="primary" @click="searchLog" :disabled="isOperate">查看日志</el-button>
          </div>
          <div>
            <el-button style="float: right; margin-right:15px;" type="primary" @click="executeCase" :disabled="isOperate">调试</el-button>
          </div>
          <div :hidden = "isImportButton">
            <el-button style="float: right; margin-right:15px;" type="primary" @click="openAddTemplateDialog" :disabled="isOperate">引用模板</el-button>
          </div>
          <div>
            <el-button style="float: left; margin-right:20px;" type="primary" icon="el-icon-refresh-left" @click="reback"></el-button>
          </div>
        </span>
      </div>
      <div>
        <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign" :disabled="isOperate"
        :inline="true" class="demo-form-inline">
          <el-form-item label="模板名称">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="模板描述">
            <el-input v-model="formLabelAlign.description"></el-input>
          </el-form-item>
          <el-form-item label="所属项目">
            <el-select v-model="isSelectedId" id="selectId" :disabled="selectIsClick" placeholder="请选择用例所属项目" filterable>
              <el-option
                v-for="item in proList"
                :key="item.id"
                :label="item.projectname"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div style="text-align:center" :hidden = "isImportButton">
        <el-table style="width: 100%; margin: auto;" :data="templateList" border>
          <el-table-column label="导入模板">
            <el-table-column type="index" prop="index" label="#"></el-table-column>
            <el-table-column prop="proname" label="项目名称"></el-table-column>
            <el-table-column prop="localId" label="前置or后置">
              <template slot-scope="scope">
                <span type="success" v-if="scope.row.localId === 2" style="color: red;">后置模板</span>
                <span type="primary" v-if="scope.row.localId === 1" style="color: blue;">前置模板</span>
              </template>
            </el-table-column>
            <el-table-column prop="casename" label="模板名称"></el-table-column>
            <el-table-column prop="casedescription" label="模板描述"></el-table-column>
            <el-table-column prop="status" label="模板状态">
              <template slot-scope="scope">
                <span type="success" v-if="scope.row.status === 2" style="color: green;">执行成功</span>
                <span type="primary" v-if="scope.row.status === 1" style="color: black;">未执行</span>
                <span type="warning" v-if="scope.row.status === 3" style="color: red;">执行失败</span>
                <span type="danger" v-if="scope.row.status === 4" style="color: red;">执行错误</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="删除引用模板" placement="top" :enterable="false">
                  <el-button size="mini" type="warning" icon="el-icon-delete" @click="deleteTemplate(scope.row.index)" :disabled="isOperate"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="查看模板详情" placement="top" :enterable="false">
                  <el-button size="mini" type="primary" icon="el-icon-search"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-table style="width: 100%;" :data="stepList" border>
          <el-table-column label="添加步骤">
            <el-table-column type="index" prop="step" label="step"></el-table-column>
            <el-table-column prop="elename" label="元素名称"></el-table-column>
            <el-table-column prop="eleeventname" label="元素事件"></el-table-column>
            <el-table-column prop="pagename" label="元素所在页面"></el-table-column>
            <el-table-column prop="paraname" label="设置参数"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="添加参数" placement="top" :enterable="false">
                  <el-button size="mini" type="primary" icon="el-icon-edit" :disabled="isOperate"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除步骤" placement="top" :enterable="false">
                  <el-button size="mini" type="warning" icon="el-icon-delete"  @click="deleteStep(scope.row.index)" :disabled="isOperate"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="查看元素详情" placement="top" :enterable="false">
                  <el-button size="mini" type="primary" icon="el-icon-search" :disabled="isOperate"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog title="添加测试步骤" :visible.sync="addDialogVisible" width="30%"
      @close="addDialogClose">
      <!-- 内容主体区 -->
      <el-form ref="addFormRef" :model="addForm" label-width="80px"  class="demo-ruleForm">
        <el-form-item label="页面选择">
          <el-select v-model="isSelectedPageId" placeholder="请选择元素所在页面" @change="getEleList" filterable>
            <el-option
              v-for="item in pagelist"
              :key="item.id"
              :label="item.pagename"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="元素名称">
          <el-select v-model="isSelectedEleId" placeholder="请选择元素" @change="getEleEvent" filterable>
            <el-option
              v-for="item in elelist"
              :key="item.id"
              :label="item.elename"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="元素事件" prop="elename">
          <el-input v-model="addForm.event" disabled></el-input>
        </el-form-item>
        <el-form-item label="参数设置" prop="elename">
          <el-input v-model="addForm.params"></el-input>
        </el-form-item>
      </el-form>

      <!-- 内容底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStep">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="引用模板" :visible.sync="addTemplateDialogVisible" width="30%"
      @close="addDialogClose">
      <!-- 内容主体区 -->
      <el-form label-width="80px"  class="demo-ruleForm">
        <el-form-item label="位置选择">
          <el-select v-model="isSelectedLocal" placeholder="请选择模板位置" filterable>
            <el-option
              v-for="item in localList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板选择">
          <el-select v-model="isSelectedTemplateId" placeholder="请选择模板" filterable>
            <el-option
              v-for="item in allTemplateList"
              :key="item.id"
              :label="item.casename"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 内容底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTemplateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTemplate">确 定</el-button>
      </span>
    </el-dialog>
    <el-drawer
          title="AUTO_TEST_CASE_EXECUTE_LOG"
          :visible.sync="drawer"
          :with-header="false">
          <div style="font-size: 12px;" v-html="auto_execute_log"></div>
        </el-drawer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        description: ''
      },
      proList: [],
      isSelectedId: '',
      elelist: [],
      stepList: [],
      addDialogVisible: false,
      isEdit: true,
      autoTestCase: {
        casename: '',
        casedescription: '',
        proid: '',
        elelist: '',
        paramslist: '',
        pretemplate: '',
        posttemplate: '',
        type: 0
      },
      selectIsClick: false,
      addForm: {
        params: '',
        event: ''
      },
      isSelectedPageId: '',
      isSelectedEleId: '',
      isSelectedTemplateId: '',
      isSelectedLocal: '',
      projectId: 0,
      pagelist: [],
      auto_execute_log: '',
      drawer: false,
      addTemplateDialogVisible: false,
      allTemplateList: [],
      //  渲染模板页面数据
      templateList: [],
      localList: [
        {
          name: '前置',
          id: 1
        },
        {
          name: '后置',
          id: 2
        }
      ],
      query: {
        fromPage: '',
        param: {}
      },
      isImportButton: false,
      backPath: '',
      isOperate: false
    }
  },
  created () {
    this.getPageData()
    this.getProjectList()
  },
  watch: {
    stepList: function (val) {
      if (val.length !== 0) {
        this.selectIsClick = true
      }
    },
    templateList: function (val) {
      if (val.length !== 0) {
        this.selectIsClick = true
      }
    }
  },
  methods: {
    //  打开添加步骤页面
    openAddDialog: async function () {
      if (this.isSelectedId === '') {
        return this.$message.error('请选择项目！！！')
      }
      this.projectId = this.isSelectedId
      const { data: res } = await this.$http.get('/getPageListByProId', { params: { projectId: this.projectId } })
      this.pagelist = res.obj
      this.addDialogVisible = true
    },
    openAddTemplateDialog: async function () {
      if (this.isSelectedId === '') {
        return this.$message.error('请选择项目！！！')
      }
      this.projectId = this.isSelectedId
      const { data: res } = await this.$http.get('/allCaseOrTemplate', { params: { projectId: this.projectId, type: 0 } })
      this.allTemplateList = res.obj
      this.addTemplateDialogVisible = true
    },
    addDialogClose: function () {},
    getEleList: async function () {
      const { data: res } = await this.$http.get('/getElementListByPageId', { params: { pageId: this.isSelectedPageId } })
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.elelist = res.obj
      console.log(this.elelist)
    },
    getEleEvent: async function () {
      const { data: res } = await this.$http.get('/getEleById', { params: { id: this.isSelectedEleId } })
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.addForm.event = res.obj.eleeventname
      console.log(res.obj)
    },
    /** 添加步骤 */
    addStep: async function () {
      const { data: res } = await this.$http.get('/getEleById', { params: { id: this.isSelectedEleId } })
      const step = { elename: '', eleeventname: '', pagename: '', paraname: '', eleId: 0 }
      step.paraname = this.addForm.params
      step.eleeventname = this.addForm.event
      step.elename = res.obj.elename
      step.pagename = res.obj.pagename
      step.eleId = this.isSelectedEleId
      this.addDialogVisible = false
      this.stepList.push(step)
      console.log(this.stepList)
    },
    /** 添加模板 */
    addTemplate: async function () {
      const { data: res } = await this.$http.get('/findById', { params: { id: this.isSelectedTemplateId } })
      const template = { casename: '', casedescription: '', proname: '', status: '', localId: '' }
      template.localId = this.isSelectedLocal
      template.casename = res.obj.casename
      template.casedescription = res.obj.casedescription
      template.proname = res.obj.proname
      template.status = res.obj.status
      this.addTemplateDialogVisible = false
      this.templateList.push(template)
      //  设置autocase 的前置和后置模板
      if (this.isSelectedLocal === 1) {
        this.autoTestCase.pretemplate += (res.obj.id + ',')
      } else {
        this.autoTestCase.posttemplate += (res.obj.id + ',')
      }
      console.log(this.templateList)
    },
    /** 获取项目列表 */
    getProjectList: async function () {
      const userId = JSON.parse(window.sessionStorage.getItem('user')).id
      const { data: res } = await this.$http.get('/prolist', { params: { userId: userId } })
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.proList = res.obj
      console.log(this.proList)
    },
    /** 保存模板 */
    saveAutoTest: async function () {
      if (this.templateList.length === 0 && this.stepList.length === 0) {
        return this.$message.error('请先添加模板！！！')
      }
      this.autoTestCase.casename = this.formLabelAlign.name
      this.autoTestCase.casedescription = this.formLabelAlign.description
      this.autoTestCase.proid = this.isSelectedId
      // 设计模板参数，eleId的拼接
      for (let i = 0; i < this.stepList.length; i++) {
        this.autoTestCase.elelist += (this.stepList[i].eleId + ',')
        this.autoTestCase.paramslist += (this.stepList[i].paraname + ',')
      }
      if (this.query.fromPage === 'autocase') {
        this.autoTestCase.type = 1
      } else if (this.query.fromPage === 'template') {
        this.autoTestCase.type = 0
      } else {
        return this.$message.warning('参数错误！！！')
      }
      console.info(this.autoTestCase)
      const { data: res } = await this.$http.post('/addAutoTestCase', this.autoTestCase)
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.autoTestCase.elelist = []
      this.autoTestCase.paramslist = []
      return this.$message.success(res.msg)
    },
    /** 调试模板 */
    executeCase: async function () {
      if (this.templateList.length === 0 && this.stepList.length === 0) {
        return this.$message.error('请先添加模板！！！')
      }
      this.autoTestCase.casename = this.formLabelAlign.name
      this.autoTestCase.casedescription = this.formLabelAlign.description
      this.autoTestCase.proid = this.isSelectedId
      for (let i = 0; i < this.stepList.length; i++) {
        this.autoTestCase.elelist = this.autoTestCase.elelist + this.stepList[i].eleId + ','
        this.autoTestCase.paramslist = this.autoTestCase.paramslist + this.stepList[i].paraname + ','
      }
      // 组装 设计模板和引用模板的拼接
      let eleIdStr = ''
      let paramStr = ''
      let eleIdStrLast = ''
      let paramStrLast = ''
      if (this.templateList.length !== 0) {
        for (let i = 0; i < this.templateList.length; i++) {
          if (this.templateList[i].localId === 1) {
            eleIdStr = eleIdStr + this.templateList[i].elelist
            paramStr = paramStr + this.templateList[i].paramslist
          } else {
            eleIdStrLast = eleIdStrLast + this.templateList[i].elelist
            paramStrLast = paramStrLast + this.templateList[i].paramslist
          }
        }
      }
      this.autoTestCase.elelist = eleIdStr + this.autoTestCase.elelist + eleIdStrLast
      this.autoTestCase.paramslist = paramStr + this.autoTestCase.paramslist + paramStrLast
      console.info(this.autoTestCase)
      const loading = this.$loading({
        lock: true,
        text: '正在执行用例，请稍等！！！',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { data: res } = await this.$http.post('/executeCase', this.autoTestCase)
      if (res.status !== 200) {
        loading.close()
        this.auto_execute_log = res.log
        return this.$message.error(res.msg)
      }
      loading.close()
      this.auto_execute_log = res.log
      this.$message.success(res.msg)
    },
    /** 查询日志 */
    searchLog: function (caseId) {
      if (this.auto_execute_log === '') {
        return this.$message.error('未产生日志！！！')
      }
      this.drawer = true
    },
    /** 删除引用模板 */
    deleteTemplate: function (index) {
      this.templateList.splice(index - 1, 1)
    },
    /** 删除步骤 */
    deleteStep: function (index) {
      this.stepList.splice(index - 1, 1)
    },
    /** 获取page页面传过来的值 */
    getPageData: async function () {
      this.query.fromPage = this.$route.query.fromPage
      //  新增模板跳转到模板页面
      if (this.query.fromPage === 'template') {
        this.isImportButton = true
        this.backPath = '/templates'
      //  查看用例跳转到用例详情页面
      } else if (this.query.fromPage === 'viewcase') {
        this.query.param = this.$route.query.param
        if (this.query.param !== {}) {
          this.formLabelAlign.name = this.query.param.casename
          this.formLabelAlign.description = this.query.param.casedescription
          this.isSelectedId = this.query.param.proid
          this.isOperate = true
          const { data: res } = await this.$http.get('/findTemplateAndCaseList',
            {
              params: {
                elelist: this.query.param.elelist,
                pretemplate: this.query.param.pretemplate,
                posttemplate: this.query.param.posttemplate,
                paraname: this.query.param.paramslist
              }
            })
          if (res.status !== 200) {
            return this.$message.error(res.msg)
          }
          this.templateList = res.obj.templateList
          this.stepList = res.obj.elelist
        }
        this.backPath = '/cases'
      // 新增模板
      } else if (this.query.fromPage === 'autocase') {
        this.backPath = '/cases'
      // 编辑用例，跳转到编辑用例页面
      } else if (this.query.fromPage === 'updatecase') {
        this.query.param = this.$route.query.param
        if (this.query.param !== {}) {
          this.formLabelAlign.name = this.query.param.casename
          this.formLabelAlign.description = this.query.param.casedescription
          this.isSelectedId = this.query.param.proid
          const { data: res } = await this.$http.get('/findTemplateAndCaseList',
            {
              params: {
                elelist: this.query.param.elelist,
                pretemplate: this.query.param.pretemplate,
                posttemplate: this.query.param.posttemplate,
                paraname: this.query.param.paramslist
              }
            })
          if (res.status !== 200) {
            return this.$message.error(res.msg)
          }
          this.templateList = res.obj.templateList
          this.stepList = res.obj.elelist
        }
        this.backPath = '/cases'
      }
    },
    /** 返回页面 */
    reback: function () {
      this.$router.push(this.backPath)
    }
  }
}
</script>

<style lang="less" scoped>
.text {
    font-size: 14px;
  }

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
</style>
