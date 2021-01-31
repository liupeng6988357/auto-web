<template>
  <div>
    <!--卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <div style="margin-top: 15px;">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input clearable placeholder="请输入项目名称" v-model="queryInfo.query" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加元素</el-button>
          </el-col>
        </el-row>
        <el-table style="width: 100%" :data="elelist" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="elename" label="元素名称"></el-table-column>
          <el-table-column prop="eleeventname" label="元素事件" width="180px"></el-table-column>
          <el-table-column prop="elelocaltype" label="定位类型" width="180px"></el-table-column>
          <el-table-column prop="eleaddress" label="定位路径" width="400px"></el-table-column>
          <el-table-column prop="createby" label="创建者" width="180px"></el-table-column>
          <el-table-column prop="createdate" label="创建时间" width="180px"></el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="编辑项目" placement="top" :enterable="false">
                <el-button size="mini" type="primary" icon="el-icon-edit"  @click="updateById(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除元素" placement="top" :enterable="false">
                <el-button size="mini" type="warning" icon="el-icon-delete" @click="deleteById(scope.row.id)"></el-button>
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

    <!-- 添加测试项目弹框 -->
    <el-dialog
      title="添加测试元素"
      :visible.sync="addDialogVisible"
      width="30%">
      <!-- 内容主体区 -->
      <el-form ref="addFormRef" :model="addForm" label-width="80px"  class="demo-ruleForm">
        <el-form-item label="元素名称" prop="elename">
          <el-input v-model="addForm.elename"></el-input>
        </el-form-item>
        <el-form-item label="元素事件">
          <el-select v-model="isSelectedEvent" placeholder="请选择元素事件">
            <el-option
              v-for="item in eventList"
              :key="item.id"
              :label="item.eventType"
              :value="item.eventType">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="定位类型">
          <el-select v-model="isSelectedAddress" placeholder="请选择元素定位类型">
            <el-option
              v-for="item in addressList"
              :key="item.id"
              :label="item.addressType"
              :value="item.addressType">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="定位路径" prop="eleaddress">
          <el-input v-model="addForm.eleaddress"></el-input>
        </el-form-item>
      </el-form>

      <!-- 内容底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addElement">确 定</el-button>
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
        pageId: 0,
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      addForm: {
        elename: '',
        eleeventname: '',
        elelocaltype: '',
        eleaddress: '',
        pageid: 0,
        pagename: '',
        createby: ''
      },
      addDialogVisible: false,
      elelist: [],
      pageData: {
        pageId: 0,
        pagename: ''
      },
      isSelectedEvent: '',
      isSelectedAddress: '',
      eventList: [],
      addressList: []
    }
  },
  created () {
    this.getPageData()
    this.getElementList()
    this.getEventTypeList()
    this.getAddressTypeList()
  },
  methods: {
    /** 根据页面获取元素列表 */
    getElementList: async function () {
      this.queryInfo.pageId = this.pageData.pageId
      const { data: res } = await this.$http.get('/elelist', { params: this.queryInfo })
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.elelist = res.obj
      this.total = parseInt(res.log)
      console.log(this.elelist)
    },
    handleSizeChange: function (newSize) {
      this.queryInfo.pageSize = newSize
      this.getElementList()
    },
    handleCurrentChange: function (pageNum) {
      this.queryInfo.pageNum = pageNum
      this.getElementList()
    },
    /** 获取page页面传过来的值 */
    getPageData: function () {
      this.pageData.pageId = this.$route.query.pageId
      this.pageData.pagename = this.$route.query.pagename
    },
    reback: function () {
      this.$router.push('/pages')
    },
    /** 获取事件类型 */
    getEventTypeList: async function () {
      const { data: res } = await this.$http.get('/getEventTypeList')
      this.eventList = res.obj
    },
    /** 获取元素定位路径类型 */
    getAddressTypeList: async function () {
      const { data: res } = await this.$http.get('/getAddressTypeList')
      this.addressList = res.obj
      console.log(this.addressList)
    },
    /** 添加元素 */
    addElement: async function () {
      this.addForm.pageid = this.pageData.pageId
      this.addForm.pagename = this.pageData.pagename
      this.addForm.createby = JSON.parse(window.sessionStorage.getItem('user')).username
      console.log(this.addForm.createby)
      this.addForm.eleeventname = this.isSelectedEvent
      this.addForm.elelocaltype = this.isSelectedAddress
      const { data: res } = await this.$http.post('/addElement', this.addForm)
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.addDialogVisible = false
      this.getElementList()
      this.$message.success(res.msg)
    },
    /** 删除元素 */
    deleteById: async function (id) {
      const pageid = this.pageData.pageId
      const { data: res } = await this.$http.delete('/deleteElement', { params: { id, pageid } })
      if (res.status !== 200) {
        this.$message.error(res.msg)
      }
      this.getElementList()
      this.$message.success(res.msg)
    },
    /** 编辑元素 */
    updateById: function (id) {

    }
  }
}
</script>

<style lang="less" scope>

</style>
