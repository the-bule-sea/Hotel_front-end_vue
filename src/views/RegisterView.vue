<template>
  <div>
    <div class="register-box" style="width: 450px; height: 530px; margin: 100px auto; ">
      <div style="width: 100%; height: 100px; font-size: 30px; line-height: 100px; text-align: center; color: white">
        欢迎注册</div>
      <div style="margin-top: 15px; text-align: center; height: 320px;">
        <el-form :model="user" :rules="rules" ref="user">
          <el-form-item prop="userName">
            <el-input v-model="user.userName" prefix-icon="el-icon-user" style="width: 80%"
              placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="user.password" show-password prefix-icon="el-icon-lock" style="width: 80%"
              placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input v-model="user.confirmPassword" show-password prefix-icon="el-icon-lock" style="width: 80%"
              placeholder="请再次输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input v-model="user.phone" style="width: 80%" placeholder="请输入注册手机号"></el-input>
          </el-form-item>
          <el-form-item prop="idNumber">
            <el-input v-model="user.idNumber" style="width: 80%" placeholder="请输入身份证号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 80%; margin-top: 10px" type="danger" @click="register('user')">注册</el-button>
          </el-form-item>
          <div style=" text-align: center">
            已有账号？<a href="javascript:void(0)" style="text-decoration: none" @click="navLogin">点击登录</a>
          </div>
        </el-form>

      </div>
    </div>
  </div>
</template>

<script>

import request from "@/utils/request";

export default {
  name: "RegisterView",
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
    const validdatePassword2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.user.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    const validdatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      }
      setTimeout(() => {
        if (!Number.isInteger(Number(value))) {
          callback(new Error('请输入数字值'));
        } else {
          if (value.toString().length !== 11) {
            callback(new Error('请输入11位手机号码'));
          } else {
            callback();
          }
        }
      })
    };
    const validateIdNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('身份证号不能为空'));
      }
      setTimeout(() => {
        if (value.toString().length !== 18) {
          callback(new Error('请输入18位身份证号码!'));
        } else if (!/^\d{6}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}(\d|X)$/i.test(value)) {
          callback(new Error("身份证号格式错误"));
        } else {
          callback();
        }
      })
    };

    return {
      user: {
        userName: '',
        password: '',
        phone: '',
        confirmPassword: '',
        idNumber: '',
      },
      rules: {
        userName: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validdatePhone, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validdatePassword2, trigger: 'blur' }
        ],
        idNumber: [
          { required: true, validator: validateIdNumber, trigger: 'blur' }
        ],
      },
    }
  },
  // 页面加载的时候，做一些事情，在created里面
  created() {
  },
  // 定义一些页面上控件出发的事件调用的方法
  methods: {
    register(user) {
      //其实下面这个提示代码可以不用了，算了放着吧
      // 6.28：发现还真得用，得修改一下。
      this.$refs[user].validate((valid) => {
        if (valid) {
          // alert('submit!');
          console.log(this.user)
          request.post("/user/register", this.user).then(res => {
            if (res.code === '0') {
              this.$message({
                message: '注册成功',
                type: 'success'
              });
              this.$router.push("/login");
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              });
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
    navLogin() {
      this.$router.push("/login")
    }
  }
}
</script>

<style>
.register-box {
  width: 100%;
  height: 100%;
  background-color: rgba(40, 40, 40, 0.6);
  /* 灰黑色带透明效果 */
  border: 6px solid rgba(255, 255, 255, 0.5);
  /* 浅白色边框 */
  padding: 20px;
  box-sizing: border-box;

}
</style>