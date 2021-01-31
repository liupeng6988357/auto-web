<template>
  <el-container class="home-container">
    <el-aside width="220px" height="100%;">
      <div style="position: fixed; height: 100%;">
        <div>
          <img src="../assets/pages/home_logo.png" alt="">
        </div>
        <div>
          <el-menu
          default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="rgba(15,41,80,1)"
          text-color="#fff"
          active-text-color="#ffd04b"
          :router="true"
          :unique-opened="true"
          :collapse-transition="true"
          >
            <el-menu-item index="/reporter" @click="saveNavState('reporter', '报表')">
              <i class="el-icon-s-data"></i>
              <span slot="title">报表</span>
            </el-menu-item>
            <!-- 一级菜单-->
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
              <!-- 一级菜单模板区域-->
              <template slot="title">
                <i :class="item.iconcls"></i>
                <span>{{item.name}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/'+items.path" v-for="items in item.children"
              :key="items.id" @click="saveNavState(items.path + '', items.name)">
                <template slot="title">
                  <i :class="items.iconcls"></i>
                  <span>{{items.name}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
        <div class="bottom_box">
          <el-button type="info" style="background-color: rgba(15,41,80,1); width: 220px; font-size: 14px;" @click="logout">退出登录</el-button>
        </div>
      </div>
    </el-aside>
    <el-container>
      <el-header class="header_box">
        <div class="title_div">
          {{title}}
        </div>
      </el-header>
      <el-main style="padding-left: 2px; padding-right: 2px; padding-top: 5px; background-color: #d3d7d4;">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      //  被激活的链接地址
      activePath: '',
      title: '首页'
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout: function () {
      this.$confirm('确认退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.replace('/login')
        window.sessionStorage.clear()
      }).catch(() => {
      })
    },
    getMenuList: async function () {
      const { data: res } = await this.$http.get('/menulist')
      this.menuList = res
      console.log(this.menuList)
    },
    saveNavState (activePath, activeName) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
      this.title = activeName
      console.log(this.activePath)
    }
  }
}
</script>

<style>
.home-container {
  height: 100%;
}
.el-aside {
  background-color: rgba(15,41,80,1);
}
.bottom_box {
  width: 100%;
  height: 50px;
  position: absolute;
  bottom: 5px;
  overflow: hidden;
  margin-bottom: 0px;
}
.header_box {
  position: relative;
  top: 0;
  height: 55px;
  padding: 0 0 0 20px;
  border-bottom: 1px solid #d8e3ef;
  background: #fff;
}
.title_div {
  float: left;
  margin-top: 16px;
}
</style>
