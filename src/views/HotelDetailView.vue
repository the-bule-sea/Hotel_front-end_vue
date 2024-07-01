<template>
  <div>
    <h1>酒店详情</h1>
    <!-- 返回按钮 -->
    <el-button type="primary" @click="back()">返回主界面</el-button>
    <h2>{{ hotel.hotelName }}</h2>
    <p>酒店ID: {{ hotel.hotelID }}</p>
    <p>城市: {{ hotel.city }}</p>
    <p>介绍: {{ hotel.hotelDescription }}</p>
    <!-- 其他酒店信息展示 -->
    <!-- <el-button type="primary" @click="fetchHotelDetail()">test</el-button> -->
    <h3>房间信息</h3>
    <el-row>
      <el-col :span="24" v-for="room in rooms" :key="room.roomID">
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
                <el-button type="primary" @click="bookadd(room.roomID)">预定房间</el-button>
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
        <!-- 这次能找到原因，还是看了console的报错信息：Invalid prop: type check failed for prop "rules". Expected Object, got String with value "rules". -->
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
            <el-date-picker
              v-model="bookform.checkInDate"
              type="date"
              placeholder="选择日期"
              :picker-options="checkInDateOptions"
              @change="updateCheckOutDateOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="登出日期" prop="checkOutDate" label-width="15%">
            <el-date-picker
              v-model="bookform.checkOutDate"
              type="date"
              placeholder="选择日期"
              :picker-options="checkOutDateOptions"
            ></el-date-picker>
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
import request from "@/utils/request";

export default {
  name: "HotelDetailView",
  props: {
    hotel: {
      type: Object,
      required: true,
      // 一开始没有用localStorage，所以刷新后，vuerouter就挂了。
      default: () => JSON.parse(localStorage.getItem("currentHotel"))
    }
  },
  data() {
    // form表单校验
    const validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入姓名"));
      } else {
        callback();
      }
    };
    const validateIdNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入身份证号"));
      }else if(value.length!=18){
        callback(new Error("身份证号长度必须为18位"));
      }else if(!/^\d{6}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])\d{3}(\d|X)$/i.test(value)){
        callback(new Error("身份证号格式错误"));
      }else {
        callback();
      }
    };
    const validateCheckInDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择入住日期"));
      } else {
        callback();
      }
    };
    const validateCheckOutDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择登出日期"));
      } else {
        callback();
      }
    };
    return {
      currentRoomId: null,
      rooms: [],
      dialogFormVisible: false,
      bookform: {
        name: "",
        idNumber: "",
        checkInDate: "",
        checkOutDate: ""
      },
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        idNumber: [{ validator: validateIdNumber, trigger: "blur" }],
        checkInDate: [{ validator: validateCheckInDate, trigger: "blur" }],
        checkOutDate: [{ validator: validateCheckOutDate, trigger: "blur" }]
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
        disabledDate: time => {
          if (!this.bookform.checkInDate) {
            return time.getTime() < Date.now() - 8.64e7;
          }
          const checkInDate = new Date(this.form.checkInDate);
          const maxCheckOutDate = new Date(checkInDate);
          maxCheckOutDate.setDate(checkInDate.getDate() + 30);
          return (
            time.getTime() < checkInDate.getTime() ||
            time.getTime() > maxCheckOutDate.getTime()
          );
        }
      }
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
      request
        .get(`/hotel/${this.hotel.hotelID}`) //注意反引号
        .then(res => {
          if (res.code === "0") {
            this.rooms = res.data;
            console.log(this.rooms);
          }
        });
    },
    back() {
      this.$router.push("/user");
    },
    bookadd(roomID) {
      this.dialogFormVisible = true;
      this.bookform = {};
      this.currentRoomId = roomID;
      console.log(this.currentRoomId);
    },
    updateCheckOutDateOptions() {
      this.checkOutDateOptions.disabledDate = time => {
        if (!this.bookform.checkInDate) {
          return time.getTime() < Date.now() - 8.64e7;
        }
        const checkInDate = new Date(this.bookform.checkInDate);
        const maxCheckOutDate = new Date(checkInDate);
        maxCheckOutDate.setDate(checkInDate.getDate() + 30);
        return (
          time.getTime() < checkInDate.getTime() ||
          time.getTime() > maxCheckOutDate.getTime()
        );
      };
    },
    // 预定
    submit(formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          const user = JSON.parse(localStorage.getItem("user"));
          const hotel = JSON.parse(localStorage.getItem("currentHotel"));
          const bookinfo = {
            userID: user.userId,
            hotelID: hotel.hotelID,
            roomID: this.currentRoomId,
            bookName: this.bookform.name,
            idNumber: this.bookform.idNumber,
            checkInDate: this.bookform.checkInDate,
            checkOutDate: this.bookform.checkOutDate
          };
          // alert("submit");
          console.log("bookinfo", bookinfo);
          this.dialogFormVisible = false;
          request.post("/book/room", bookinfo).then(res => {
            if (res.code === "0") {
              this.$message({
                type: "success",
                message: "预订成功"
              });
            } else {
              this.$message({
                type: "error",
                message: res.msg
              });
            }
          });
        }
      });
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

// 关于这里用到的正则表达式。
//       ^: 匹配字符串的开始。
// \d{6}: 匹配前六位数字，这通常代表身份证号码的行政区划代码。
// (18|19|20): 匹配“18”或“19”或“20”，表示世纪部分。这个部分用于确定出生年份的世纪部分，如“1980”或“2005”。
// \d{2}: 匹配两位数字，表示年份的后两位，如“80”或“05”。
// (0[1-9]|1[0-2]): 匹配月份。具体来说：
// 0[1-9] 匹配01到09月
// 1[0-2] 匹配10到12月
// (0[1-9]|[1-2]\d|3[0-1]): 匹配日期。具体来说：
// 0[1-9] 匹配01到09日
// [1-2]\d 匹配10到29日
// 3[0-1] 匹配30到31日
// \d{3}: 匹配任意三位数字，表示顺序码，通常包括性别信息。
// (\d|X): 匹配一位数字或字母X，这表示校验码。身份证的最后一位可能是数字0-9或字母X。
// $: 匹配字符串的结束。
// i: 正则表达式标志，表示忽略大小写。
