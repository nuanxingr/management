<template>
  <div>
    <el-button style="margin-top: 20px" type="primary" icon="el-icon-plus"
      @click="dialogFormVisible = true">添加</el-button
    >
    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column label="序号" type="index" width="80" align="center">
      </el-table-column>
      <el-table-column label="品牌名称" prop="tmName"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="{row}">
          <img :src="row.logoUrl" style="width: 100px; height: 80px" alt="" />
        </template>
      </el-table-column>
      <el-table-column label="操作"> 
          <template slot-scope="{row}">
             <el-button  type="warning" size="mini" icon="el-icon-edit" @click="showDiaing(row)"
                >编辑</el-button </el-table-column>
            <el-button @click="deleteAttr(row)" type="danger" size="mini" icon="el-icon-delete"
                >删除</el-button </el-table-column>
          </template>
      </el-table-column>
    </el-table>
    <!-- 
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-sizes="[2, 3, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, -> , sizes, total"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 
      标签属性:
      :visible.sync="dialogFormVisible"->用于控制当前dialog组件的显示隐藏
      :model="form" -> 将用来收集表单内部数据的对象交给form表单
      label-width="100px" ->用于控制表单的label的宽度(注意:必须带上px单位)

      组件用处:
        el-dialog->用于显示遮罩层,同时显示对话框
        el-form->主要功能,用于收集用户输入的表单数据
        el-form-item->每一个form-item代表form表单中的一行

      注意:尽量把tmForm的内部结构处理成接口所需要的结构
     -->
        <el-dialog :title="tmForm.id?`编辑品牌`:`添加品牌`" :visible.sync="dialogFormVisible">
            <el-form :model="tmForm" :rules="rules" ref="addForm">
              <el-form-item label="品牌名称" label-width="100px" prop="tmName">
              <el-input v-model="tmForm.tmName"  style="80px" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                <el-upload
                  class="avatar-uploader"
                  action="/dev-api/admin/product/fileUpload"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
                 
              </el-form-item>

            </el-form>

             <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                 <el-button type="primary" @click="save">确 定</el-button>
              </div>
            
        </el-dialog>

  </div>
        
</el-dialog
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 15,
      trademarkList: [],
      dialogFormVisible: false,
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      imageUrl: "", //不管用不用,先复制过来
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        logoUrl: [
          { required: true, message: "请输入品牌LOG", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    this.getTradeMarkList();
  },
  methods: {
    async getTradeMarkList() {
      const {
        data: { total, records },
      } = await this.$API.trademark.getTradeMarkList(this.page, this.limit);
      this.total = total;
      // if (page){
      //   this.page=page
      // }
      this.trademarkList = records;
    },
    handleCurrentChange(value) {
      // 通过当前事件,可以知道用户点击了哪个页数
      this.page = value;
      //发送请求,获取对应页面的数据
      this.getTradeMarkList();
    },
    handleSizeChange(value) {
      this.limit = value;

      this.getTradeMarkList();
    },

    handleAvatarSuccess(res, file) {
      //回调参数
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const types = ["image/jpeg", "image/jpg", "image/png"];
      // const isJPG = file.type === "image/jpeg";
      //用来判断图片的类型；
      const isJPG = types.includes(file.type);
      //判断图片的大小
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //编辑
    showDiaing(row) {
      this.dialogFormVisible = true;
      if (row.id) {
        this.tmForm = {
          ...row,
        };
      }
    },
    // 删除
    deleteAttr(row) {
      this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.$API.trademark.deleteTradeMark(row.id);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getTradeMarkList(
            this.trademarkList.length > 1 ? this.page : this.page
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async save() {
     
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          try {
             //发送请求
            await this.$API.trademark.addOrUpdate(this.tmForm);
            // 请求最新的品牌列表,由于添加功能,无法知道当前有几页,所以统一请求第一页
            this.getTradeMarkList();

            this.$message({
              message: "恭喜你，添加数据成功",
              type: "success",
            });
            this.dialogFormVisible = false;

            //添加成功后清空数据
            this.tmForm = {
              tmName: "",
              logoUrl: "",
            };
          } catch (error) {
            this.$message("数据添加失败");
          }
        } else {
          this.$message("数据添加失败");
          return false;
        }
      });
      // console.log(this.$refs.addForm);
    },
    cancel() {
      (this.dialogFormVisible = false),
        (this.tmForm = {
          tmName: "",
          logoUrl: "",
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>