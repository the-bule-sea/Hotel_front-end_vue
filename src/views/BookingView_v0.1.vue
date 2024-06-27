<template>
  <div>
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
          <el-card :body-style="{ padding: '0px' }">
            <el-row>
              <el-col :span="8">
                <img :src="require(`../static/${hotel.image}`)" class="hotel-image" />
              </el-col>
              <el-col :span="16">
                <div style="padding: 14px;">
                  <h3>{{ hotel.name }}</h3>
                  <p>Price: {{ hotel.price }}</p>
                  <p>Availability: {{ hotel.availability }}</p>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookingView",
  data() {
    return {
      bingImages: [], // 将轮播图数据迁移至此处
      hotels: [
        {
          id: 1,
          name: "Hotel A",
          price: "$100",
          availability: "Available",
          image: "A.png"
        },
        {
          id: 2,
          name: "Hotel B",
          price: "$150",
          availability: "Available",
          image: "B.png"
        }
        // Add more hotels here...
      ]
    };
  },
  mounted() {
    this.fetchBingImages(); // 调用HotelHall.vue中的fetchBingImages方法
  },
  methods: {
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
    }
  }
};
</script>

<style>
.carousel-item-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
}

.hotel-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>