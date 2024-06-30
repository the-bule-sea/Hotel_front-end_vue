<template>
  <div>
    <div>
      <el-input v-model="params.name" placeholder="请输入姓名" style="width: 120px"></el-input>
      <el-input v-model="params.phone" placeholder="请输入电话" style="width: 120px; margin-left : 5px"></el-input>
      <el-button type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>
      <el-button type="warning" style="margin-left: 10px" @click="reset()">清空</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="add()">新增</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="userName" label="姓名" width="80px"></el-table-column>
        <el-table-column prop="points" label="积分" width="80px"></el-table-column>
        <el-table-column prop="userType" label="用户类型" width="80px"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>
        <el-table-column prop="idNumber" label="身份证号"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="del(scope.row.id)">
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
          <el-form-item label="姓名" label-width="15%">
            <el-input v-model="form.userName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" label-width="15%">
            <el-radio v-model="form.sex" label="男">男</el-radio>
            <el-radio v-model="form.sex" label="女">女</el-radio>
          </el-form-item>
          <el-form-item label="年龄" label-width="15%">
            <el-input v-model="form.age" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" label-width="15%">
            <el-input v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  data() {
    return {
      params: {
        name: "",
        phone: "",
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
      request
        .get("/admin/search", {
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
    edit(obj) {
      this.form = { ...obj };
      this.dialogFormVisible = true;
    },
    submit() {
      request.post("/admin", this.form).then(res => {
        if (res.code === "0") {
          this.$message({
            type: "success",
            message: "操作成功"
          });
          this.dialogFormVisible = false;
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
        name: "",
        phone: "",
        pageNum: 1,
        pageSize: 5
      };
      this.load();
    },
    del(id) {
      request.delete(`/admin/deleteUser/${id}`).then(res => {
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

<style>
.el-table {
  border-right: none !important;
}
</style>
