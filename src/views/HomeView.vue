<template>
  <div>
    <div style="background-color: aqua;">欢迎来到写成旅行后台管理界面</div>
    <div style="margin-top:20px; display: flex; justify-content: space-between;">
      <div style="width: 48%">
        <div id="hotelChart" style="width: 100%; height: 400px;"></div>
      </div>
      <div style="width: 48%">
        <div id="orderChart" style="width: 100%; height: 400px;"></div>
      </div>
    </div>
    <div style="margin-top: 20px;">
      <div style="margin-bottom: 10px;">房间入住率统计,请输入时间范围</div>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="margin-right: 10px;"
      ></el-date-picker>
      <el-button type="primary" @click="loadRoomOccupancyRate">查询</el-button>
    </div>
    <div style="margin-top: 20px;">
      <div id="roomOccupancyRateChart" style="width: 100%; height: 400px;"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import request from "@/utils/request";

export default {
  name: "HomeView",
  data() {
    return {
      dateRange: []
    };
  },
  mounted() {
    this.initHotelChart();
    this.initOrderChart();
  },
  methods: {
    initHotelChart() {
      let chartDom = document.getElementById("hotelChart");
      let myChart = echarts.init(chartDom);

      request.get("/admin/getHotelData").then(res => {
        if (res.code === "0") {
          let hotelData = res.data; // 假设返回的数据格式为 [{name: "城市A", value: 10}, ...]

          let option = {
            title: {
              text: "各地区酒店数量",
              left: "center"
            },
            tooltip: {
              trigger: "item"
            },
            legend: {
              orient: "vertical",
              left: "left"
            },
            series: [
              {
                name: "酒店数量",
                type: "pie",
                radius: "50%",
                data: hotelData,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                }
              }
            ]
          };

          myChart.setOption(option);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    initOrderChart() {
      let chartDom = document.getElementById("orderChart");
      let myChart = echarts.init(chartDom);

      request.get("/admin/getOrderData").then(res => {
        if (res.code === "0") {
          let orderData = res.data; // 假设返回的数据格式为 [{name: "已预定未入住", value: 10}, ...]

          let option = {
            title: {
              text: "订单状态分布",
              left: "center"
            },
            tooltip: {
              trigger: "item"
            },
            legend: {
              orient: "vertical",
              left: "left"
            },
            series: [
              {
                name: "订单状态",
                type: "pie",
                radius: "50%",
                data: orderData,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                  }
                }
              }
            ]
          };

          myChart.setOption(option);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    loadRoomOccupancyRate() {
      let startDate = this.dateRange[0];
      let endDate = this.dateRange[1];

      request
        .get("/admin/getRoomOccupancyRate", {
          params: {
            startDate: startDate,
            endDate: endDate
          }
        })
        .then(res => {
          if (res.code === "0") {
            let occupancyRateData = res.data;

            let chartDom = document.getElementById("roomOccupancyRateChart");
            let myChart = echarts.init(chartDom);

            let option = {
              title: {
                text: "客房入住率(次数)",
                left: "center"
              },
              tooltip: {
                trigger: "item"
              },
              legend: {
                orient: "vertical",
                left: "left"
              },
              xAxis: {
                type: "category",
                data: occupancyRateData.map(item => item.roomTypeName)
              },
              yAxis: {
                type: "value"
              },
              series: [
                {
                  name: "入住率(次数)",
                  type: "bar",
                  data: occupancyRateData.map(item => item.bookingCount)
                }
              ]
            };

            myChart.setOption(option);
          } else {
            this.$message.error(res.msg);
          }
        });
    }
  }
};
</script>
