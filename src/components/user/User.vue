<template>
  <div id="project_div">
    <!--卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <div style="margin-top: 10px;">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input clearable placeholder="请输入项目名称" v-model="queryInfo.query" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="finduserlist"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary">添加用户</el-button>
          </el-col>
        </el-row>
        <el-table style="width: 100%" :data="userlist" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="username" label="用户名称"></el-table-column>
          <el-table-column prop="company" label="所属公司"></el-table-column>
          <el-table-column prop="address" label="公司地址"></el-table-column>
          <el-table-column prop="createdate" label="创建时间"></el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="编辑用户" placement="top" :enterable="false">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="updateUser(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除用户" placement="top" :enterable="false">
                <el-button size="mini" type="warning" icon="el-icon-delete" @click="deleteProject(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="设置用户角色" placement="top" :enterable="false">
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 10
      },
      userlist: []
    }
  },
  created () {
    this.finduserlist()
  },
  methods: {
    finduserlist: async function () {
      const { data: res } = await this.$http.get('/finduserlist', { params: this.queryInfo })
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.userlist = res.obj
    }
  }
}
</script>

<style lang="less" scope>

</style>
