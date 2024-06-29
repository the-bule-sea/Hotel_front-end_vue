<template>
  <div>
    <h1>订单信息</h1>
    <!-- <el-button type="primary" @click="back()">返回主界面</el-button> -->
    <el-row>
      <el-col :span="24" v-for="book in bookings" :key="book.bookingID">
        <el-card :body-style="{ padding: '0px' }" class="booking-card">
          <el-row>
            <el-col :span="11">
              <div style="padding: 10px">
                <h3>订单酒店为：{{ book.hotelName }}</h3>
                <p>入住日期: {{ formatDate(book.checkInDate) }}</p>
                <p>登出日期: {{ formatDate(book.checkOutDate) }}</p>
              </div>
            </el-col>
            <el-col :span="11">
              <div style="padding: 10px;">
                <p>状态: {{ book.bookStatus }}</p>
                <p>入住用户：{{ book.bookName }}</p>
                <p>订单价格为：{{ book.price }}</p>
                <p>房间类型为：{{ book.roomTypeName }}</p>
              </div>
            </el-col>
            <el-col :span="2">
              <div class="button-group">
                <!-- 原来对不齐，套了三个div就行了 -->
                <div><el-button round v-if="book.bookStatus === '已预定未入住'" type="danger" @click="cancelBooking(bookingID)">退订</el-button></div>
                <div><el-button round v-if="book.bookStatus === '已预定未入住'" type="success" >付款</el-button></div>
                <div><el-button round v-if="book.bookStatus !== '已预定未入住'" type="primary" @click="review(book)">评价</el-button></div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <div>
      <el-dialog title="写评论" :visible.sync="dialogFormVisible" width="50%">
        <el-form :model="reviewForm" :rules="rules" ref="reviewForm">
          <el-form-item label="评论内容" prop="content" label-width="15%">
            <el-input v-model="reviewForm.content" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="评分" prop="rating" label-width="15%">
            <el-rate v-model="reviewForm.rating"></el-rate>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitReview('reviewForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  name: "HistoryinfoView",
  data() {
    return {
      bookings: [],
      dialogFormVisible: false,
      reviewForm: {
        content: '',
        rating: 0,
        bookingID: null
      },
      rules: {
        content: [{ required: true, message: '请输入评论内容', trigger: 'blur' }],
        rating: [{ required: true, message: '请评分', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.fetchBookings();
  },
  methods: {
    fetchBookings() {
      
      const user = JSON.parse(localStorage.getItem('user'));
      request.get(`/book/${user.userId}`)
        .then(res => {
          if (res.code === "0") {
            this.bookings = res.data;
          }
        });
    },
    back() {
      this.$router.push("/user");
    },
    review(book) {
      this.reviewForm.bookingID = book.bookingID;
      this.dialogFormVisible = true;
    },
    submitReview(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const reviewData = {
            bookingID: this.reviewForm.bookingID,
            content: this.reviewForm.content,
            rating: this.reviewForm.rating
          };
          request.post('/reviews', reviewData)
            .then(res => {
              if (res.code === "0") {
                this.dialogFormVisible = false;
                this.$message.success('评论提交成功');
                this.fetchBookings(); // 重新获取预订信息，刷新页面
              }
            });
        }
      });
    },
    // 退订功能
    cancelBooking(bookingID){
      
      request.post(`/book/cancelBooking/${bookingID}`)
      .then(res => {
          if (res.code === "0") {
            this.$message.success('退订成功');
            this.fetchBookings(); // 重新获取预订信息，刷新页面
          }
        });
    },
    formatDate(dateTime){
      if (!dateTime) return '';
      // 原来的数据长这样的：checkInDate=2024-06-27T08:00, checkOutDate=2024-07-24T08:00
      // 通过创建Date对象，并使用toLocaleDateString方法仅显示日期部分
      return new Date(dateTime).toLocaleDateString();
    }
  }
};
</script>

<style>
.booking-card {
  margin-bottom: 20px;
}
.button-group {
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 14px;
}





</style>