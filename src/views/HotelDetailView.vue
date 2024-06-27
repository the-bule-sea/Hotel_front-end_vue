<template>
  <div>
    <h1>酒店详情</h1>
    <!-- 返回按钮 -->
    <el-button type="primary" @click="back()">返回主界面</el-button>
    <h2>{{ hotel.hotelName }}</h2>
    <p>酒店ID: {{ hotel.id }}</p>
    <p>城市: {{ hotel.city }}</p>
    <p>介绍: {{ hotel.hotelDescription }}</p>
    <!-- 其他酒店信息展示 -->
    <!-- <el-button type="primary" @click="fetchHotelDetail()">test</el-button> -->
    <h3>房间信息</h3>
    <el-row>
      <el-col :span="24" v-for="room in rooms" :key="room.Id">
        <el-card :body-style="{ padding: '0px' }" class="room-card">
          <el-row>
            <el-col :span="8">
              <img :src="room.image" class="room-image" />
            </el-col>
            <el-col :span="16">
              <div style="padding: 14px;">
                <h3>{{ room.roomTypeName }}</h3>
                <div class="name-divider"></div>
                <p>价格: {{ room.price }}</p>
                <p>状态: {{ room.status }}</p>
                <el-button type="primary" @click="bookadd(room)">预定房间</el-button>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <div>
      <el-dialog title="请填写信息" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="form">
          <el-form-item label="姓名" label-width="15%">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker v-model="value1" type="datetimerange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" class="custom-date-picker">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="性别" label-width="15%">
            <el-radio v-model="form.sex" label="男">男</el-radio>
            <el-radio v-model="form.sex" label="女">女</el-radio>
          </el-form-item>
          <el-form-item label="年龄" label-width="15%">
            <el-input v-model="form.age" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" label-width="15%">
            <el-input v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false, submit()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  name: "HotelDetailView",
  props: {
    hotel: {
      type: Object,
      required: true,
      // 一开始没有用localStorage，所以刷新后，vuerouter就挂了。
      default: () => JSON.parse(localStorage.getItem('currentHotel'))
    }
  },
  data() {
    return {
        rooms:[],
        dialogFormVisible: false,
        form:{}
    };
  },
  //load()不对
  // 在 Vue 组件中，生命周期钩子函数是用于在特定的时刻执行一些代码的，
  // 应该使用 created 或 mounted 生命周期钩子来加载数据。
  mounted() {
    this.fetchHotelDetail();
    // this.fetchRooms();
  },
  methods: {
    fetchHotelDetail() {
      request.get(`/hotel/${this.hotel.id}`)//注意反引号
      .then(res => {
        if(res.code === "0"){
          this.rooms = res.data;
        }
      })
    },
    back() {
      this.$router.push("/user");
    },
    bookadd(){
      this.form = {};
      this.dialogFormVisible = true;
    }
    
    
 }
};
</script>

<style>
/* 样式根据需求进行添加 */
.room-card {
  margin-bottom: 20px;
}

.room-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.name-divider {
  height: 1px;
  background-color: #ddd;
  margin: 10px 0;
}

</style>

<style scoped>
.custom-date-picker {
  width: 100%;
}
</style>