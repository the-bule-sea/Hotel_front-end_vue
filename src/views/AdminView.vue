<template>
  <div>
    <div>
      <el-input v-model="params.name" placeholder="请输入姓名" style="width: 120px; margin-left : 5px"></el-input>
      <el-button type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>
      <el-button type="warning" style="margin-left: 10px" @click="reset()">清空</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="add()">新增</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="adminName" label="姓名" width="80px"></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>
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
            <el-input v-model="form.name" autocomplete="off"></el-input>
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
          <el-button type="primary" @click="dialogFormVisible = false, submit()">确 定</el-button>
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
        name: "",
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
      // request.get("/admin").then(res => {
      //   if (res.code === "0") {
      //     this.tableData = res.data.list;
      //   }
      // });

      //调用findyBySearch
      this.findBySearch();
    },
    findBySearch() {
      console.log("点击成功"); //test//test
      request
        .get("/admin/searchAdmin", {
          params: this.params
        })
        .then(res => {
          if (res.code === "0") {
            this.tableData = res.data.list; //因为后端返回的数据不再是data，而是分页信息，所以要提取其中的list
            this.total = res.data.total;
          }
        });
    },
    add(){
      this.form = {};
      this.dialogFormVisible = true;
    },
    //edit()编辑数据
    edit(obj){
      this.form = obj; 
      this.dialogFormVisible = true;
    },
    //  确定按钮
    submit() {
      request.post("/admin", this.form).then(res => {
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
        name: "",
        phone: "",
        pageNum: 1,
        pageSize: 5
      };
      this.load();
    },
    //删除
    del(id) {
      request.delete("/admin/" + id).then(res => {
        if (res.code === "0") {
          this.$message({
            type: "success",
            message: "删除成功"
          });
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
        }
        this.findBySearch();
      });
    },
    // 方框中的每页显示个数
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
