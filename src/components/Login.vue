<template>
  <div class="login_container">
    <div class="login_left">
      <img src="../assets/pages/login_logo.png" alt="">
    </div>
    <div class="login_right">
      <div class="login_box">
        <div class="contain_box">
          <div id="login_logo">
            <img src="../assets/pages/crm_logo.png" alt="">
          </div>
          <div class="login_title">
            <div id="title">UI自动化平台</div>
          </div>
          <div class="login_form">
            <el-input class="login_input account_name" placeholder="请输入用户名" v-model="user.username" type="text" clearable></el-input>
            <el-input class="login_input account_name" placeholder="请输入密码" v-model="user.password" type="password" clearable></el-input>
          </div>
          <div style="margin-top: 48px; display: block;">
            <el-button type="primary" style="border-redius: 10%;" class="login_button" @click="login">登 录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        username: 'admin',
        password: '123456'
      }
    }
  },
  methods: {
    login: async function () {
      const { data: res } = await this.$http.post('/doLogin', this.user)
      if (res.status !== 200) {
        return this.$message.warning(res.msg)
      }
      const token = new Date().toLocaleString()
      window.sessionStorage.setItem('user', JSON.stringify(res.obj))
      window.sessionStorage.setItem('token', token)
      this.$router.push('/home')
      return this.$message.success(res.msg)
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  height: 100%;
}
.login_left>.login_right{
display:  inline-block;
}
.login_left{
  height: 100%;
  width: 32%;
  position: relative;
  float: left;
  display: block;
  img {
    width: 100%;
    height: 100%;
  }
}
.login_right{
  width: auto;
  height: 100%;
  display: block;
}
.login_box{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 56%;
  height: calc(100% - 100px);
  max-width: 450px;
  min-width: 288px;
  margin: 0px auto;
  padding: 0px;
  -webkit-box-pack: center;
  -webkit-box-align: center;
}
#login_logo {
  padding-bottom: 64px;
  padding-top: 32px;
  img {
    height: 32px;
  }
}
.login_title{
  margin: 0px 0px 8px;
  display: block;
  #title {
    text-align: left;
    font-size: 24px;
    font-weight: 600;
    color: rgb(38, 49, 66);
    display: block;
  }
}
.contain_box {
  width: 100%;
  height: auto;
  margin-bottom: 0px;
  display: block;
}
.login_form {
  display: block;
}
.login_input {
  margin-top: 40px;
  position: relative;
  flex: 1 1 0%;
}
.login_button {
  width: 100%;
  font-size: 17px;
  color: rgb(255, 255, 255);
  height: 40px;
  line-height: 22px;
  text-align: center;
  background-color: rgb(78, 128, 245);
  box-shadow: rgba(79, 139, 243, 0.3) 0px 4px 10px 0px;
  border-width: initial;
  border-style: none;
  border-color: initial;
  border-image: initial;
  border-radius: 25px;
  outline: none;
  text-decoration: none;
}
</style>
