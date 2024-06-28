<template>
  <div>
    <el-container>
      <el-header style="padding: 0;">
        <el-menu
          :default-active="$route.path"
          router
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          @open="handleOpen"
          @close="handleClose"
          background-color="#ffffff"
          text-color="#5678a8"
          active-text-color="#0086f6"
          style="display: flex; align-items: center;"
        >
          <a href="https://www.ctrip.com/">
            <img src="../static/Hotel_logo2.png" style="width: 150px; position: relative; " />
          </a>
          <el-menu-item index="/user">购票大厅</el-menu-item>
          <el-submenu index="2">
            <template slot="title">我的工作台</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
            <el-menu-item index="2-3">选项3</el-menu-item>
            <el-submenu index="2-4">
              <template slot="title">选项4</template>
              <el-menu-item index="2-4-1">选项1</el-menu-item>
              <el-menu-item index="2-4-2">选项2</el-menu-item>
              <el-menu-item index="2-4-3">选项3</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="3" disabled>消息中心</el-menu-item>
          <el-menu-item index="/user/historybook">订单管理</el-menu-item>
          
          <div style="margin-left:auto; margin-right:30px; display: flex; align-items: center;">
            <el-dropdown>
                <span class="el-dropdown-link" style="color: black;">
                {{ user.userName }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item @click="logout()">退出登录</el-dropdown-item> 点击事件没能生效-->
                <el-dropdown-item>
                  <div @click="logout()">退出登录</div>
                </el-dropdown-item>
                <el-dropdown-item divided disabled>更多功能持续开发中</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-menu>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
        <el-footer class="footer">
            <div class="footer-content">
        <div class="footer-section">
            <h3>旅游资讯</h3>
            <ul>
            <li><a href="#">宾馆索引</a></li>
            <li><a href="#">攻略索引</a></li>
            <li><a href="#">机票索引</a></li>
            <li><a href="#">网站导航</a></li>
            <li><a href="#">旅游索引</a></li>
            <li><a href="#">邮轮索引</a></li>
            <li><a href="#">企业差旅索引</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <h3>加盟合作</h3>
            <ul>
            <li><a href="#">分销联盟</a></li>
            <li><a href="#">友情链接</a></li>
            <li><a href="#">企业礼品卡采购</a></li>
            <li><a href="#">保险代理</a></li>
            <li><a href="#">代理合作</a></li>
            <li><a href="#">酒店加盟</a></li>
            <li><a href="#">目的地及景区合作</a></li>
            <li><a href="#">更多加盟合作</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <h3>关于写成旅行</h3>
            <ul>
            <li><a href="#">关于写成</a></li>
            <li><a href="#">联系我们</a></li>
            <li><a href="#">用户协议</a></li>
            <li><a href="#">营业执照</a></li>
            <li><a href="#">写成热点</a></li>
            <li><a href="#">诚聘英才</a></li>
            <li><a href="#">隐私政策</a></li>
            <li><a href="#">安全中心</a></li>
            <li><a href="#">知识产权</a></li>
            </ul>
        </div>
        <div class="footer-contact">
            <h3>联系我们</h3>
            <img src="../static/qr_code.png" alt="你被骗了" />
            <p>扫码了解更多</p>
        </div>
        </div>
    </el-footer>
    </el-container>
  </div>
</template>


<script>
export default {
  name: "HotelLayOut",
  data() {
    return {
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {} //判断有无，若无则返回{}，若有则转化为JSON返回
    };
  },

  mounted() {},
  methods: {
    logout() {
      console.log("退出登录test");
      //清除token
      localStorage.clear();
      //跳转到登录页
      this.$router.push("/login");
    },
    goToHistory(){
      this.$router.push({name: "HistoryInfoView"});
    }
  }
};
</script>

<style>

.footer {
  background-color: #f8fafd;
  padding: 20px 40px;
  min-height: 400px; /* 增加最小高度 */
  box-sizing: border-box;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap; /* 允许内容换行 */
  position: relative; /* 使子元素能够使用伪元素进行分割线 */
}

.footer-section, .footer-contact {
  flex: 1;
  margin: 10px; /* 增加间距 */
  min-width: 200px; /* 设置最小宽度，防止内容重叠 */
  position: relative;
  padding-right: 20px; /* 为分割线留出空间 */
}

.footer-section:not(:last-child)::after, .footer-contact:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background-color: #dcdcdc; /* 分割线颜色 */
}

.footer-section h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.footer-contact h3 {
  font-size: 16px;
  margin-bottom: 10px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 5px;
}

.footer-section ul li a {
  text-decoration: none;
  color: #333;
  transition: color 0.3s; /* 添加平滑过渡效果 */
}

.footer-section ul li:hover a {
  color: #0086f6; /* 鼠标悬停时变蓝色 */
}

.footer-contact {
  text-align: center;
}

.footer-contact p {
  margin: 5px 0;
}

.footer-contact img {
  width: 200px;
  margin-top: 10px;
}
</style>