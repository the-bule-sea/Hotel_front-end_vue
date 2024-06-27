<template>
    <div>
      <div class="login-box" style="width: 400px; height: 350px; margin: 150px auto;">
        <div style="width: 100%; height: 100px; font-size: 30px; line-height: 100px; text-align: center; color: #409EFF">欢迎登录</div>
        <div style="margin-top: 25px; text-align: center; height: 320px;">
          <el-form :model="user" :rules="rules" ref="user">
            <el-form-item prop="userName">
              <el-input v-model="user.userName" prefix-icon="el-icon-user" style="width: 80%" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="user.password" show-password prefix-icon="el-icon-lock" style="width: 80%" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button style="width: 80%; margin-top: 10px" type="primary" @click="login()">登录</el-button>
            </el-form-item>
            <div style="text-align: center">
              未有账号？<a href="javascript:void(0)" style="text-decoration: none" @click="navRegister()">点击注册</a>
            </div>
          </el-form>
        </div>
      </div>
    </div>
</template>
  
<script>
import request from "@/utils/request";
export default {
    
  // 定义页面的名称
  name: "LoginView",
  data() {
    const validateName = (rule,value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'));
      }else{
        callback();
      }
    };
    const validatePassword = (rule,value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'));
      }else{
        callback();
      }
    };
    // 定义页面上的数据
    return {
        user:{
          userName: '',
          password: '',
        },
        rules:{
          userName: [
            { validator: validateName, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ]
        }
    };
  },

  // 页面加载时，做的事
  created() {},
  // 定义一些页面上触发的事件
  methods: {
    login(){
      console.log(this.user)
      console.log(JSON.stringify(this.user))
        // 发送登录请求
        request.post("/user/login",this.user).then(res =>{
            if(res.code === '0'){
                this.$message({
                    type:"success",
                    message:"登录成功"
                });
                localStorage.setItem("user",JSON.stringify(res.data));
                // 登录成功后，把用户信息保存在本地存储中
                
                this.$router.push("/user");
                // 登录成功后，跳转到首页
            }else{
                this.$message({
                    type:"error",
                    message:res.msg
                });
            }
        })
    },
    navRegister(){
        this.$router.push("/register");
        // 跳转到注册页面
    }
    
  }
};
</script>

<style>
.login-box{
  width: 100%;
  height: 100%;
  background-color: rgba(40, 40, 40, 0.6); /* 灰黑色带透明效果 */
  border: 6px solid rgba(255, 255, 255, 0.5); /* 浅白色边框 */
  padding: 20px;
  box-sizing: border-box;

}

</style>
  