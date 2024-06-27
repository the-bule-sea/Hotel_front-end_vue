<template>
  <div>
    <div>
      <el-input placeholder="请选择并输入查询内容" v-model="input3" class="input-with-select" style="width:320px">
          <el-select v-model="select" slot="prepend" placeholder="请选择" style="width: 120px;">
            <el-option label="城市" value="city"></el-option>
            <el-option label="酒店名" value="aboutname"></el-option>
            <!-- <el-option label="用户电话" value="3"></el-option> -->
          </el-select>
        </el-input>
      <!-- <el-input v-model="hotelparams.city" placeholder="请输入城市" style="width: 120px"></el-input> -->
      <el-button type="primary" style="margin-left: 10px" @click="findBySearch">查询</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="reset">清空</el-button>
    </div>
    <div>
      <!-- 轮播图 -->
      <el-carousel :interval="4000">
        <el-carousel-item v-for="(image, index) in bingImages" :key="index">
          <div class="carousel-item-wrapper">
            <img :src="image" class="carousel-image" />
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div>
      <h1>HotelInfo</h1>
      <el-row>
        <el-col :span="24" v-for="hotel in hotels" :key="hotel.id">
          <el-card :body-style="{ padding: '0px' }" @click.native = "goToDetail(hotel)">
            <el-row>
              <el-col :span="8">
                <img :src="hotel.image" class="hotel-image" />
              </el-col>
              <el-col :span="16">
                <div style="padding: 14px;">
                  <!-- 通过前端查看数据，发现是小写的hotelName，有点意思。 -->
                  <h3>{{ hotel.hotelName }}</h3>
                  <div class="name-divider"></div>
                  <!-- 过时的Internet Explorer特定的CSS滤镜:<hr style="FILTER: progid:DXImageTransform.Microsoft.Shadow(color:#987cb9,direction:145,strength:15)" width="80%" color=#987cb9 SIZE=1></hr> -->
                  <!-- <p>Price: {{ hotel.price }}</p> -->
                  <!-- <p>Availability: {{ hotel.availability }}</p> -->
                  <p>城市: {{ hotel.city }}</p>
                  <p>介绍: {{ hotel.hotelDescription }}</p>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="block" style="margin-top: 20px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="hotelparams.pageNum" :page-sizes="[5, 10, 15, 20]" :page-size="hotelparams.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "BookingView",
  data() {
    return {
      // 搜索框
      input1: '',
      input2: '',
      input3: '',
      select: '',
      // 轮播图
      bingImages: [], // 将轮播图数据迁移至此处
      hotels: [],
      hotelparams: {
        aboutname: "",
        city: "",
        pageNum: 1,
        pageSize: 5
      },
      total: 0
    };
  },
  mounted() {
    this.fetchBingImages(); // 调用HotelHall.vue中的fetchBingImages方法
    this.findBySearch(); // 加载酒店数据
  },
  methods: {
    load() {
      this.findBySearch();
    },
    fetchBingImages() {
      // 将HotelHall.vue中的fetchBingImages方法迁移至此处
      const apiUrl = "https://dailybing.com/api/v1/";

      const today = new Date();
      const dates = [];
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date
          .toISOString()
          .substr(0, 10)
          .replace(/-/g, "");
        dates.push(dateString);
      }

      this.bingImages = dates
        .map(date => `${apiUrl}${date}/zh-cn/FHD`)
        .reverse();
    },
    findBySearch() {
      //打印log
      console.log("点击成功");
      console.log(this.hotelparams);
      // 根据select的值将input3的内容赋值到相应的hotelparams属性中
      // 感觉有点史山代码，hhh，辛苦后端判断了
      // 不对，后端也是我啊啊啊啊，w(*Д*)w，自产自吃了。
      if (this.select && this.input3) {
        this.hotelparams[this.select] = this.input3;
      }
      // 清空其他可能的搜索参数
      for (const key in this.hotelparams) {
        if (key !== this.select && key !== 'pageNum' && key !== 'pageSize') {
          this.hotelparams[key] = '';
        }
      }
      //调用后台接口
      request
        .get("/user/search", { params: this.hotelparams }) //注意，这里的params就是params，一开始写成hotelparams了，结果导致pageNum为NULL
        .then(res => {
          if (res.code === "0") {
            this.hotels = res.data.list;
            this.total = res.data.total;
          }
        });
    },
    reset() {
      this.input3 = "";
      this.select = "";
      this.hotelparams = {
        aboutname: "",
        city: "",
        pageNum: 1,
        pageSize: 5
      };
      this.findBySearch();
    },
    handleSizeChange(pageSize) {
      this.hotelparams.pageSize = pageSize;
      this.load();
    },
    // 第几页
    handleCurrentChange(pageNum) {
      this.hotelparams.pageNum = pageNum;
      this.load();
    },
    // 跳转酒店详情页
    goToDetail(hotel){
      
      this.$router.push({ name: 'HotelDetailView', params: { hotel } });
      // 666 ,这个地方用的是反引号`，不是单引号‘，哇yyx怎么想的？？？
      // this.$router.push({ path: `user/hotel/${id}`, params:{ hotel }});
    },
  }
};
</script>

<style>
.carousel-item-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center; 
}

.hotel-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.name-divider {
  height: 1px;
  background-color: #ddd;
  margin: 10px 0;
}
</style>