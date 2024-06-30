<template>
  <div>
    <div>
      <el-input v-model="params.userName" placeholder="请输入用户名" style="width: 120px"></el-input>
      <el-input
        v-model="params.bookName"
        placeholder="请输入预订人姓名"
        style="width: 120px; margin-left: 5px"
      ></el-input>
      <el-select
        v-model="params.bookStatus"
        placeholder="请选择订单状态"
        style="width: 120px; margin-left: 5px"
      >
        <el-option label="全部" value></el-option>
        <el-option label="待处理" value="待处理"></el-option>
        <el-option label="已确认" value="已确认"></el-option>
        <el-option label="已完成" value="已完成"></el-option>
        <el-option label="已取消" value="已取消"></el-option>
      </el-select>
      <el-button type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>
      <el-button type="warning" style="margin-left: 10px" @click="reset()">清空</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="bookingID" label="订单ID" width="100px"></el-table-column>
        <el-table-column prop="roomID" label="房间ID" width="100px"></el-table-column>
        <el-table-column prop="formatDate.(checkInDate)" label="入住日期" width="120px"></el-table-column>
        <el-table-column prop="formatDate.(checkOutDate)" label="退房日期" width="120px"></el-table-column>
        <el-table-column prop="bookStatus" label="订单状态" width="100px"></el-table-column>
        <el-table-column prop="bookName" label="预订人姓名" width="120px"></el-table-column>
        <el-table-column prop="hotelName" label="酒店名称" width="150px"></el-table-column>
        <el-table-column prop="userName" label="下单用户名" width="150px"></el-table-column>
      </el-table>
    </div>
    <div class="block" style="margin-top: 20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
  
  <script>
import request from "@/utils/request";

export default {
  name: "Admin_bookinfoView",

  data() {
    return {
      params: {
        userName: "",
        bookName: "",
        bookStatus: "",
        pageNum: 1,
        pageSize: 5
      },
      tableData: [],
      total: 0
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.findBySearch();
    },
    findBySearch() {
      request
        .get("/admin/searchBookinfo", {
          params: this.params
        })
        .then(res => {
          if (res.code === "0") {
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
        });
    },
    reset() {
      this.params = {
        userName: "",
        bookName: "",
        bookStatus: "",
        pageNum: 1,
        pageSize: 5
      };
      this.load();
    },
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize;
      this.load();
    },
    handleCurrentChange(pageNum) {
      this.params.pageNum = pageNum;
      this.load();
    },
    // 格式转化
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
.el-table {
  border-right: none !important;
}
</style>
  