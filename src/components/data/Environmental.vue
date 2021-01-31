<template>
  <div id="project_div">
    <!--卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <div style="margin-top: 10px;">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input clearable placeholder="请输入参数名称" v-model="queryInfo.query" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="findparamslist"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary">添加参数</el-button>
          </el-col>
        </el-row>
        <el-table style="width: 100%" :data="paramslist" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="paramsname" label="参数名称" width="150"></el-table-column>
          <el-table-column prop="paramstype" label="参数类型" width="200"></el-table-column>
          <el-table-column prop="paramsvalue" label="参数值" width="300"></el-table-column>
          <el-table-column prop="paramsdescription" label="参数描述" width="300"></el-table-column>
          <el-table-column prop="createtime" label="创建时间" width="200"></el-table-column>
          <el-table-column prop="createUser" label="创建人" width="150"></el-table-column>
          <el-table-column prop="updatetime" label="更新时间" width="200"></el-table-column>
          <el-table-column prop="updateUser" label="修改人" width="150"></el-table-column>
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
    <!-- 新增参数-->
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
      paramslist: []
    }
  },
  created () {
    this.findparamslist()
  },
  methods: {
    findparamslist: async function () {
      const { data: res } = await this.$http.get('/findparamslist', { params: this.queryInfo })
      if (res.status !== 200) {
        this.paramslist = res.obj
        return this.$message.error(res.msg)
      }
      this.paramslist = res.obj
    }
  }
}
</script>

<style lang="less" scope>

</style>
