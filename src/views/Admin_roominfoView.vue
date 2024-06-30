<template>
  <div>
    <div>
      <el-input
        v-model="params.hotelName"
        placeholder="请输入酒店名"
        style="width: 120px; margin-left : 5px"
      ></el-input>
      <el-input
        v-model="params.roomTypeName"
        placeholder="请输入房间类型"
        style="width: 120px; margin-left : 5px"
      ></el-input>
      <el-button type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>
      <el-button type="warning" style="margin-left: 10px" @click="reset()">清空</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="add()">新增</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="hotelID" label="酒店ID" width="80px"></el-table-column>
        <el-table-column prop="hotelName" label="酒店名" width="220px"></el-table-column>
        <el-table-column prop="roomID" label="房间ID" width="80px"></el-table-column>
        <el-table-column prop="price" label="价格" width="80px"></el-table-column>
        <el-table-column prop="roomTypeName" label="房间类型" width="120px"></el-table-column>
        <el-table-column prop="remainder" label="剩余数量" width="80px"></el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="del(scope.row.roomID)">
              <el-button slot="reference" type="danger" style="margin-left: 5px">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
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
    <div>
      <el-dialog title="请填写信息" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="form">
          <el-form-item label="房间ID" label-width="15%">
            <el-input v-model="form.roomID" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="酒店ID" label-width="15%">
            <el-input v-model="form.hotelID" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="价格" label-width="15%">
            <el-input v-model="form.price" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="房间类型" label-width="15%">
            <el-input v-model="form.roomTypeName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="剩余数量" label-width="15%">
            <el-input v-model="form.remainder" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false; submit()">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
  
  <script>
import request from "@/utils/request";

export default {
  data() {
    // 定义页面上的数据
    return {
      params: {
        roomID: "",
        hotelID: "",
        roomTypeName: "",
        hotelName:"",
        pageNum: 1,
        pageSize: 5
      },
      tableData: [],
      total: 0,
      dialogFormVisible: false,
      form: {}
    };
  },
  // 页面加载时，做的事
  created() {
    this.load();
  },
  // 定义一些页面上触发的事件
  methods: {
    load() {
      // 调用 findBySearch
      this.findBySearch();
    },
    findBySearch() {
        console.log(this.params);
      request
        .get("/admin/searchRoominfo", {
          params: this.params
        })
        .then(res => {
          if (res.code === "0") {
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
        });
    },
    add() {
      this.form = {};
      this.dialogFormVisible = true;
    },
    // 编辑数据
    edit(obj) {
      this.form = obj;
      this.dialogFormVisible = true;
    },
    // 提交数据
    submit() {
      request.post("/admin/roominfo", this.form).then(res => {
        if (res.code === "0") {
          this.$message({
            type: "success",
            message: "操作成功"
          });
          this.findBySearch();
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      });
      this.load();
    },
    reset() {
      this.params = {
        roomID: "",
        hotelID: "",
        roomTypeName: "",
        pageNum: 1,
        pageSize: 5
      };
      this.load();
    },
    // 删除
    del(id) {
      request.delete("/admin/roominfo/" + id).then(res => {
        if (res.code === "0") {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.findBySearch();
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      });
    },
    // 每页显示个数
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize;
      this.load();
    },
    // 第几页
    handleCurrentChange(pageNum) {
      this.params.pageNum = pageNum;
      this.load();
    }
  }
};
</script>
  