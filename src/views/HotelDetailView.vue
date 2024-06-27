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
      <el-dialog title="请填写信息" :visible.sync="dialogFormVisible" width="50%">
        <!-- 有些人的代码,丑得像一桩冤案。——2024.6.27 -->
        <!-- 没想到，改了一晚上的bug，就是为了找到前端校验失败的原因，结果居然是少一个冒号导致的。服了。 -->
        <!-- 警钟撅烂，el-form的rules必须前加 ： -->
        <el-form :model="bookform" :rules="rules" ref="bookform">
          <el-form-item label="姓名" prop="name" label-width="15%">
            <el-input v-model="bookform.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="idNumber" label-width="15%">
            <el-input v-model="bookform.idNumber" autocomplete="off"></el-input>
          </el-form-item>
          <!-- disabled-date没用啊啊啊啊啊 -->
          <el-form-item label="入住日期" prop="checkInDate" label-width="15%">
            <el-date-picker v-model="bookform.checkInDate" type="date" placeholder="选择日期"
              :picker-options="checkInDateOptions"></el-date-picker>
          </el-form-item>
          <el-form-item label="登出日期" prop="checkOutDate" label-width="15%">
            <el-date-picker v-model="bookform.checkOutDate" type="date" placeholder="选择日期"
              :picker-options="checkOutDateOptions"></el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit('bookform')">确 定</el-button>
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
    // form表单校验
    const validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入姓名'));
      } else {
        callback();
      }
    };
    const validateIdNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入身份证号'));
      } else {
        callback();
      }
    };
    const validateCheckInDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择入住日期'));
      } else {
        callback();
      }
    };
    const validateCheckOutDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择登出日期'));
      } else {
        callback();
      }
    };
    return {
      rooms: [],
      dialogFormVisible: false,
      bookform: {
        name: '',
        idNumber: '',
        checkInDate: '',
        checkOutDate: '',
      },
      rules: {
        name: [{ validator: validateName, trigger: 'blur' }],
        idNumber: [{ validator: validateIdNumber, trigger: 'blur' }],
        checkInDate: [{ validator: validateCheckInDate, trigger: 'blur' }],
        checkOutDate: [{ validator: validateCheckOutDate, trigger: 'blur' }]
      },
      // 日期选择器配置
      // disabled-date没用啊啊啊啊啊啊
      // 入住日期不能小于今天，登出日期不能小于入住日期，登出日期不能大于入住日期+30天
      checkInDateOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      checkOutDateOptions: {
        disabledDate: (time) => {
          if (!this.form.checkInDate) {
            return time.getTime() < Date.now() - 8.64e7;
          }
          const checkInDate = new Date(this.form.checkInDate);
          const maxCheckOutDate = new Date(checkInDate);
          maxCheckOutDate.setDate(checkInDate.getDate() + 30);
          return time.getTime() < checkInDate.getTime() || time.getTime() > maxCheckOutDate.getTime();
        }
      },

    }
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
          if (res.code === "0") {
            this.rooms = res.data;
          }
        })
    },
    back() {
      this.$router.push("/user");
    },
    bookadd() {
      // this.form = {};
      this.dialogFormVisible = true;
    },
    submit(formname) {
      this.$refs[formname].validate((valid) => {
        if(valid){
          const user = JSON.parse(localStorage.getItem('user'));
          const hotel = JSON.parse(localStorage.getItem('currentHotel'));
          const bookinfo = {
            userID: user.userId,
            hotelID: hotel.id,
            userName: this.form.name,
            idNumber: this.form.idNumber,
            checkInDate: this.form.checkInDate,
            checkOutDate: this.form.checkOutDate,
          };
          alert('submit');
          console.log('bookinfo', bookinfo);
          this.dialogFormVisible = false;
          
        }
        
      })



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
