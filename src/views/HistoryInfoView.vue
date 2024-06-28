<template>
  <div>
    <h1>预订信息</h1>
    <el-button type="primary" @click="back()">返回主界面</el-button>
    <el-row>
      <el-col :span="24" v-for="book in bookings" :key="book.bookingID">
        <el-card :body-style="{ padding: '0px' }" class="booking-card">
          <el-row>
            <el-col :span="8">
              <img :src="book.hotelImage" class="hotel-image" />
            </el-col>
            <el-col :span="16">
              <div style="padding: 14px;">
                <h3>{{ book.hotelName }}</h3>
                <div class="name-divider"></div>
                <p>入住日期: {{ book.checkInDate }}</p>
                <p>登出日期: {{ book.checkOutDate }}</p>
                <p>状态: {{ book.bookStatus }}</p>
                <el-button type="primary" @click="review(book)">写评论</el-button>
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
      request.get(`/user/${user.userId}/bookings`)
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
    }
  }
};
</script>

<style>
.booking-card {
  margin-bottom: 20px;
}

.hotel-image {
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