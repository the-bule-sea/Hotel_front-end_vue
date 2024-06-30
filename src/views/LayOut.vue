<template>
  <div>
    <el-container>
      <el-header style="background-color:lightslategray;">
        <span style="font-size: 20px; color: white">写成旅行后台界面</span>
        <el-dropdown style="float: right; hight: 50px; line-height: 50px;">
          <span class="el-dropdown-link" style="color: white;">
            {{ user.name }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item @click="logout()">退出登录</el-dropdown-item> 点击事件没能生效-->
            <el-dropdown-item>
              <div @click="logout()">退出登录</div>
            </el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item disabled>双皮奶</el-dropdown-item>
            <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
    </el-container>

    <el-container>
      <el-aside style="overflow: auto; min-height: 100vh; background-color: #545c64; width: 250px;">
        <el-menu
          :default-active="$route.path"
          router
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="/admin">
            <i class="el-icon-menu"></i>
            <span slot="title">系统首页</span>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="/admin/admin">管理员信息</el-menu-item>
              <el-menu-item index="/admin/user">用户信息</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>信息管理</span>
            </template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="/admin/bookinfo">订单信息</el-menu-item>
              <el-menu-item index="/admin/hotelinfo">酒店信息</el-menu-item>
              <el-menu-item index="/admin/roominfo">房间信息</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "LayOut",

  data() {
    return {
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {} //判断有无，若无则返回{}，若有则转化为JSON返回
    };
  },

  methods: {
    logout() {
      console.log("退出登录test");
      //清除token
      localStorage.clear();
      //跳转到登录页
      this.$router.push("/login");
    }
  }
};
</script>


<style>
.el-menu {
  border-right: none !important;
}
</style>