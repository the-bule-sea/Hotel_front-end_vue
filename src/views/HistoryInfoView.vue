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
                <h2>订单酒店为：{{ book.hotelName }}</h2>
                <p>入住日期: {{ formatDate(book.checkInDate) }}</p>
                <p>登出日期: {{ formatDate(book.checkOutDate) }}</p>
                <h3 style="color: #e6a23c">状态: {{ book.bookStatus }}</h3>
              </div>
            </el-col>
            <el-col :span="9">
              <div style="padding: 9px;">
                <p>入住用户：{{ book.bookName }}</p>
                <p>
                  <span v-if="isVIP">VIP价格为：{{ calculatePrice(book.price) }}</span>
                  <span v-else>订单价格为：{{ book.price }}</span>
                </p>
                <p>房间类型为：{{ book.roomTypeName }}</p>
                <p>房间号为：{{ book.roomID }}</p>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="button-group">
                <!-- 原来对不齐，套了三个div就行了 -->
                <!-- 这个地方不能直接传bookingID，传book.bookingID才行 -->
                <div><el-button round v-if="book.bookStatus === '已预定未入住'" type="danger" @click="cancelBooking(book.bookingID)">退订</el-button></div>
                <div><el-button round v-if="book.bookStatus === '已预定未入住'" type="success" @click="payDialogVisible = true" >付款</el-button></div>
                <div><el-button round v-if="book.bookStatus === '订单已支付'" type="primary" @click="review(book)">评价</el-button></div>
                <div><el-button round v-if="book.bookStatus === '已评价'" type="primary" @click="viewReview(book.bookingID)">查看评价</el-button></div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <div>
      <el-dialog :title="isViewMode ? '查看评论' : '写评论'" :visible.sync="dialogFormVisible" width="50%">
        <el-form :model="reviewForm" :rules="rules" ref="reviewForm">
          <el-form-item label="评论内容" prop="content" label-width="15%">
            <el-input v-model="reviewForm.content" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="评分" prop="rating" label-width="15%">
            <el-rate v-model="reviewForm.rating"></el-rate>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="!isViewMode">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitReview('reviewForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div>
      <el-dialog title="支付订单" :visible.sync="payDialogVisible" width="50%">
        <div style="text-align: center;">
          <img src="../static/qr_code.png" alt="支付二维码" style="width: 200px;">
          <div class="payment-buttons">
            <el-button type="success" @click="payDialogVisible = false, payBooking(book.bookingID)">已付款</el-button>
            <el-button @click="payDialogVisible = false">取消</el-button>
          </div>
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
      isVIP: false, // 判断是否为vip
      dialogFormVisible: false,
      payDialogVisible: false,
      reviewForm: {
        content: '',
        rating: 0,
        bookingID: null
      },
      rules: {
        content: [
          { required: true, message: '请输入评论内容', trigger: 'blur' },
          { max: 255, message: '评论内容不得超过 255 个字符', trigger: 'blur' }
        ],
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
      request.get(`/user/userStatus/${user.userId}`)
        .then(res =>{
          if(res.code === "0"){
            if(res.data.userType === "vip"){
              this.isVIP = true; // 设置为vip
            }else{
              this.isVIP = false; // 设置为非vip
            }
          }
        });
    },
    back() {
      this.$router.push("/user");
    },
    // 评价
    review(book) {
      this.isViewMode = false;
      this.reviewForm.bookingID = book.bookingID;
      this.dialogFormVisible = true;
      this.reviewForm.content = '';
      this.reviewForm.rating = 0; // 重置评分
    },
    submitReview(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const reviewData = {
            bookingID: this.reviewForm.bookingID,
            userID: JSON.parse(localStorage.getItem('user')).userId, // 获取当前用户ID
            comment: this.reviewForm.content,
            rating: this.reviewForm.rating
          };
          request.post('book/reviews', reviewData)
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
    viewReview(bookingID){
      request.get(`/book/getviews/${bookingID}`)
      .then(res => {
        if (res.code === "0") {
          this.isViewMode = true;
          this.dialogFormVisible = true;
          this.reviewForm.content = res.data.comment;
          this.reviewForm.rating = res.data.rating;
        } else {
          this.$message.error('未找到相关评论');
        }
      });
    },
    // 退订功能
    cancelBooking(bookingID){
      this.$confirm('确定要退订吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirmCancel(bookingID); // 用户点击确定后的操作，这里调用confirmCancel函数
      }).catch(() => {});
    },
    confirmCancel(bookingID){ // 用户点击确定后的操作，取消预订
      console.log(bookingID)
      request.post(`/book/cancelBooking/${bookingID}`) //注意是反引号，不然不读bookingID
      .then(res => {
          if (res.code === "0") {
            this.$message.success('退订成功');
            this.fetchBookings(); // 重新获取预订信息，刷新页面
          }
        });
    },
    //付款功能,试着扫码
    payBooking(bookingID){
      request.post(`/book/payBooking/${bookingID}`)
      .then(res => {
        if(res.code === "0"){
          this.$message.success('付款成功！');
          this.fetchBookings();
        }
      })
      console.log(bookingID);
    },
    // 格式转化
    formatDate(dateTime){
      if (!dateTime) return '';
      // 原来的数据长这样的：checkInDate=2024-06-27T08:00, checkOutDate=2024-07-24T08:00
      // 通过创建Date对象，并使用toLocaleDateString方法仅显示日期部分
      return new Date(dateTime).toLocaleDateString();
    },
    // vip价格返回
    calculatePrice(price) {
      return this.isVIP ? (price * 0.9).toFixed(2) : price.toFixed(2);
    },
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