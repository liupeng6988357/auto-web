<template>
  <div>
    <!--卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <div style="margin-top: 10px;">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input clearable placeholder="请输入页面名称" v-model="queryInfo.query" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addPageOpen">添加页面</el-button>
          </el-col>
        </el-row>
        <el-table style="width: 100%" :data="pageList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="pagename" label="页面名称"></el-table-column>
          <el-table-column prop="pagedesc" label="页面描述"></el-table-column>
          <el-table-column prop="projectname" label="所属项目"></el-table-column>
          <el-table-column prop="elecount" label="元素个数"></el-table-column>
          <el-table-column prop="createby" label="创建者"></el-table-column>
          <el-table-column prop="createdate" label="创建时间"></el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope" style="">
              <el-tooltip effect="dark" content="编辑页面" placement="top" :enterable="false">
                <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除页面" placement="top" :enterable="false">
                <el-button size="mini" type="warning" icon="el-icon-delete" @click="deletePage(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="查看元素" placement="top" :enterable="false">
                <el-button size="mini" type="primary" icon="el-icon-search" @click="pushElePage(scope.row)"></el-button>
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
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加测试项目弹框 -->
    <el-dialog
      title="新增测试项目"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClose">
      <!-- 内容主体区 -->
      <el-form ref="addFormRef" :model="addForm" label-width="80px"  class="demo-ruleForm">
        <el-form-item label="页面名称" prop="pagename">
          <el-input v-model="addForm.pagename"></el-input>
        </el-form-item>
        <el-form-item label="页面描述" prop="pagedesc">
          <el-input v-model="addForm.pagedesc"></el-input>
        </el-form-item>
        <el-form-item label="所属项目">
            <el-select v-model="isSelectedId" placeholder="请选择页面所属项目">
              <el-option
                v-for="item in proList"
                :key="item.id"
                :label="item.projectname"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
      </el-form>

      <!-- 内容底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button @click="addPage" type="primary">确 定</el-button>
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
      addForm: {
        pagename: '',
        pagedesc: '',
        userId: 0,
        projectid: 0
      },
      pageList: [],
      addDialogVisible: false,
      proList: [],
      isSelectedId: ''
    }
  },
  created () {
    this.getPageList()
  },
  methods: {
    addDialogClose: function () {},
    /**  获取页面列表 */
    getPageList: async function () {
      this.queryInfo.userId = JSON.parse(window.sessionStorage.getItem('user')).id
      const { data: res } = await this.$http.get('/getAllPageList', { params: this.queryInfo })
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.pageList = res.obj
      window.console.log(this.pageList)
    },
    /** 页面size变化 */
    handleSizeChange: function (newSize) {
      this.queryInfo.pageSize = newSize
      this.getPageList()
    },
    /** 分页页面切换 */
    handleCurrentChange: function (pageNum) {
      this.queryInfo.pageNum = pageNum
      this.getPageList()
    },
    /** 添加页面 */
    addPage: async function () {
      this.addForm.userId = JSON.parse(window.sessionStorage.getItem('user')).id
      this.addForm.projectid = this.isSelectedId
      const { data: res } = await this.$http.post('/addPage', this.addForm)
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.addDialogVisible = false
      this.getPageList()
      return this.$message.success(res.msg)
    },
    /** 打开添加页面 */
    addPageOpen: async function () {
      const userId = JSON.parse(window.sessionStorage.getItem('user')).id
      const { data: proList } = await this.$http.get('/prolist', { params: { userId } })
      if (proList.obj === null) {
        return this.$message.error(proList.msg)
      }
      this.proList = proList.obj
      this.addDialogVisible = true
    },
    /**  进入页面元素页面 */
    pushElePage: function (row) {
      this.$router.push({ path: '/elements', query: { pageId: row.id, pagename: row.pagename, projectId: row.projectid } })
    },
    /** 删除页面 */
    deletePage: async function (id) {
      window.console.log(id)
      const { data: res } = await this.$http.delete('/deletePage', { params: { id } })
      if (res.status === 500) {
        return this.$message.error(res.msg)
      }
      this.getPageList()
      this.$message.success(res.msg)
    }
  }
}
</script>

<style lang="less" scope>

</style>
