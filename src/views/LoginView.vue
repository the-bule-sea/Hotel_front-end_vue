<template>
  <div>
    <div class="login-box" style="width: 400px; height: 400px; margin: 150px auto;">
      <div style="width: 100%; height: 100px; font-size: 30px; line-height: 100px; text-align: center; color: #409EFF">欢迎登录</div>
      <div style="margin-top: 25px; text-align: center; height: 370px;">
        <el-form :model="user" :rules="rules" ref="user">
          <el-form-item prop="role">
            <el-select v-model="user.role" placeholder="选择角色" style="width: 80%">
              <el-option label="用户" value="user"></el-option>
              <el-option label="管理员" value="admin"></el-option>
            </el-select>
          </el-form-item>
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
  name: "LoginView",
  data() {
    const validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'));
      } else {
        callback();
      }
    };
    const validateRole = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择角色'));
      } else {
        callback();
      }
    };
    return {
      user: {
        role: '',
        userName: '',
        password: '',
      },
      rules: {
        role: [
          { validator: validateRole, trigger: 'change' }
        ],
        userName: [
          { validator: validateName, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ]
      }
    };
  },
  created() {},
  methods: {
    login() {
      console.log(this.user)
      console.log(JSON.stringify(this.user))
      this.$refs.user.validate((valid) => {
        if (valid) {
          if (this.user.role === 'user') {
            // 用户登录请求
            request.post("/user/login", this.user).then(res => {
              if (res.code === '0') {
                this.$message({
                  type: "success",
                  message: "登录成功"
                });
                localStorage.setItem("user", JSON.stringify(res.data));
                this.$router.push("/user");
              } else {
                this.$message({
                  type: "error",
                  message: res.msg
                });
              }
            })
          } else if (this.user.role === 'admin') {
            // 管理员登录请求
            const adminData = {
            adminName: this.user.userName,
            password: this.user.password
          };
            request.post("/admin/login", adminData).then(res => {
              if (res.code === '0') {
                this.$message({
                  type: "success",
                  message: "登录成功"
                });
                localStorage.setItem("admin", JSON.stringify(res.data));
                this.$router.push("/admin");
              } else {
                this.$message({
                  type: "error",
                  message: res.msg
                });
              }
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    navRegister() {
      this.$router.push("/register");
    }
  }
};
</script>

<style>
.login-box {
  width: 100%;
  height: 100%;
  background-color: rgba(40, 40, 40, 0.6);
  border: 6px solid rgba(255, 255, 255, 0.5);
  padding: 20px;
  box-sizing: border-box;
}
</style>
