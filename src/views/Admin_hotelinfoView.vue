<template>
  <div>
    <div>
      <el-input v-model="params.hotelName" placeholder="请输入酒店名" style="width: 120px"></el-input>
      <el-input v-model="params.city" placeholder="请输入城市" style="width: 120px; margin-left : 5px"></el-input>
      <el-button type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>
      <el-button type="warning" style="margin-left: 10px" @click="reset()">清空</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="add()">新增</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="hotelID" label="酒店ID" width="150px"></el-table-column>
        <el-table-column prop="hotelName" label="酒店名" width="150px"></el-table-column>
        <el-table-column prop="city" label="城市" width="100px"></el-table-column>
        <el-table-column prop="hotelDescription" label="描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="del(scope.row.hotelID)">
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
          <el-form-item label="酒店名" label-width="20%">
            <el-input v-model="form.hotelName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="城市" label-width="20%">
            <el-input v-model="form.city" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述" label-width="20%">
            <el-input type="textarea" v-model="form.hotelDescription" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false; submit()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: 'Admin_hotelinfoView',

  data() {
    return {
      params: {
        hotelName: "",
        city: "",
        pageNum: 1,
        pageSize: 5
      },
      tableData: [],
      total: 0,
      dialogFormVisible: false,
      form: {}
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
        console.log(this.params);
      request
        .get("/admin/searchHotelinfo", {
          params: this.params
        })
        .then(res => {
          if (res.code === "0") {
            console.log(res.data);
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
        });
    },
    add() {
      this.form = {};
      this.dialogFormVisible = true;
    },
    edit(obj) {
      this.form = obj;
      this.dialogFormVisible = true;
    },
    submit() {
      request.post("/hotelinfo", this.form).then(res => {
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
    },
    reset() {
      this.params = {
        hotelName: "",
        city: "",
        pageNum: 1,
        pageSize: 5
      };
      this.load();
    },
    del(hotelID) {
      request.delete(`/admin/deleteHotel/${hotelID}`).then(res => {
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
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize;
      this.load();
    },
    handleCurrentChange(pageNum) {
      this.params.pageNum = pageNum;
      this.load();
    }
  }
};
</script>