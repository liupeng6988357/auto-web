<template>
  <div id="project_div">
    <!--卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <div style="margin-top: 10px;">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input clearable placeholder="请输入项目名称" v-model="queryInfo.query" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="searchProject"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加项目</el-button>
          </el-col>
        </el-row>
        <el-table style="width: 100%" :data="projectList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="projectname" label="项目名称" width="200"></el-table-column>
          <el-table-column prop="projectaddress" label="项目地址" width="350"></el-table-column>
          <el-table-column prop="projectdescription" label="项目描述" width="400"></el-table-column>
          <el-table-column prop="projectcreateuser" label="创建者" width="150"></el-table-column>
          <el-table-column prop="projectcreatedate" label="创建时间" width="200"></el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="编辑项目" placement="top" :enterable="false">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="updateUser(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除项目" placement="top" :enterable="false">
                <el-button size="mini" type="warning" icon="el-icon-delete" @click="deleteProject(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="添加组员" placement="top" :enterable="false">
                <el-button size="mini" type="primary" icon="el-icon-setting" @click="addProjectUserOpen(scope.row)"></el-button>
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
        <el-form-item label="项目名称" prop="projectname">
          <el-input v-model="addForm.projectname"></el-input>
        </el-form-item>
        <el-form-item label="项目地址" prop="projectaddress">
          <el-input v-model="addForm.projectaddress"></el-input>
        </el-form-item>
        <el-form-item label="项目描述" prop="projectdescription">
          <el-input v-model="addForm.projectdescription"></el-input>
        </el-form-item>
      </el-form>

      <!-- 内容底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button @click="addProject" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加测试项目弹框 -->
    <el-dialog
      title="添加测试人员"
      :visible.sync="addUserDialogVisible"
      width="30%"
      @close="addDialogClose">
      <!-- 内容主体区 -->
      <el-form ref="addFormRef" :model="project" label-width="80px"  class="demo-ruleForm">
        <el-form-item label="项目名称" prop="projectname">
          <el-input v-model="project.projectname" disabled style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="用户名称">
          <el-select v-model="isSelectedUserId" filterable placeholder="请选择">
            <el-option v-for="item in userlist" :key="item.id" :label="item.username" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 内容底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProjectUser">确 定</el-button>
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
        projectType: 0,
        userId: 0,
        pageNum: 1,
        pageSize: 10
      },
      addForm: {
        projectname: '',
        projectaddress: '',
        projectdescription: '',
        uid: 0,
        projectcreateuser: ''
      },
      projectList: [],
      addDialogVisible: false,
      project: {},
      userlist: [],
      isSelectedUserId: '',
      addUserDialogVisible: false,
      addUserPro: {
        projectId: 0,
        userId: 0
      }
    }
  },
  created () {
    this.getProjectList()
  },
  methods: {
    addDialogClose: function () {},
    getProjectList: async function () {
      this.queryInfo.userId = JSON.parse(window.sessionStorage.getItem('user')).id
      console.log(this.queryInfo)
      const { data: res } = await this.$http.get('/projectlist', { params: this.queryInfo })
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.projectList = res.obj
      console.log(this.projectList)
    },
    handleSizeChange: function (newSize) {
      this.queryInfo.pageSize = newSize
      this.getProjectList()
    },
    handleCurrentChange: function (pageNum) {
      this.queryInfo.pageNum = pageNum
      this.getProjectList()
    },
    addProject: async function () {
      this.addForm.uid = JSON.parse(window.sessionStorage.getItem('user')).id
      this.addForm.projectcreateuser = JSON.parse(window.sessionStorage.getItem('user')).username
      console.log(this.addForm.uid)
      const { data: res } = await this.$http.post('/insertProject', this.addForm)
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.addDialogVisible = false
      this.getProjectList()
      return this.$message.success(res.msg)
    },
    deleteProject: async function (projectId) {
      this.$confirm('确认删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/deleteProjectById', { params: { projectId } })
        this.getProjectList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
      })
    },
    addProjectUserOpen: async function (user) {
      this.project = user
      const { data: userlist } = await this.$http.get('/userlist')
      if (userlist.obj === null) {
        return this.$message.error(userlist.msg)
      }
      this.userlist = userlist.obj
      this.addUserDialogVisible = true
    },
    addProjectUser: async function () {
      //  将用Qs.stringify()就是把传入的对象转换为键值对。
      const data = this.$qs.stringify({ projectId: this.project.id, userId: this.isSelectedUserId })
      const { data: res } = await this.$http.post('/addprojectuser', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      if (res.status === 500) {
        return this.$message.error(res.msg)
      }
      this.$message.success(res.msg)
    },
    searchProject: async function () {
      this.getProjectList()
    }
  }
}
</script>

<style lang="less" scope>

</style>
