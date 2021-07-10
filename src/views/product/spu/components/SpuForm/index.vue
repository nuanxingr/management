<template>
  <div>
    <el-form :model="spuForm" label-width="80px">
      <el-form-item label="SUP名称">
        <el-input
          v-model="spuForm.spuName"
          placeholder="请输入SUP名称"
        ></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <el-option
            v-for="tm in trademarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          v-model="spuForm.description"
          placeholder="请输入品牌"
          rows="4"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select v-model="spuForm.tmId" placeholder="请选择">
          <el-option label="属性一" value="1"></el-option>
        </el-select>
        <el-button icon="el-icon-plus" type="primary">添加销售属性</el-button>
      </el-form-item>
      <el-form-item>
        <el-table :data="spuForm.spuSaleAttrList" border style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width="150"
          ></el-table-column>
          <el-table-column label="属性名列表">
            <template slot-scope="{ row }">
              <el-tag
                v-for="saleAttrValue in row.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                closable
              >
                <!-- :disable-transitions="false"
                @close="handleClose(tag)" -->
                {{ saleAttrValue.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small"
                >+ 添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template>
              <HintButton
                type="danger"
                size="mini"
                icon="el-icon-delete"
                title="删除"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button type="primary">取消</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      spuForm: {
        category3Id: 0, //代表当前spu属于哪个分类,新增和修改都需要
        description: "", //spu的描述文本
        spuName: "", //spu的名称
        tmId: "", //该属性代表spu的品牌ID,新增和修改都需要
        // id: 0,                 //该属性代表的是spu的id,新增不需要,修改需要
        spuImageList: [
          //该属性对应图片列表功能,新增和修改都需要
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [], //销售属性列表
      },
      dialogImageUrl: "",
      dialogVisible: false,
      spuSaleAttrStr: "",
      spuImageList: [], //图片数据
      spuSaleAttrList: [],
      trademarkList: [], //品牌数据
      inputVisible: false,
      inputValue: "",

      inputVisible: false,
      inputValue: "",
    };
  },
  //      {
  //   "category3Id": 0,
  //   "description": "string",
  //   "id": 0,
  //   "spuImageList": [
  //     {
  //       "id": 0,
  //       "imgName": "string",
  //       "imgUrl": "string",
  //       "spuId": 0
  //     }
  //   ],
  //   "spuName": "string",
  //   "spuSaleAttrList": [
  //     {
  //       "baseSaleAttrId": 0,
  //       "id": 0,
  //       "saleAttrName": "string",
  //       "spuId": 0,
  //       "spuSaleAttrValueList": [
  //         {
  //           "baseSaleAttrId": 0,
  //           "id": 0,
  //           "isChecked": "string",
  //           "saleAttrName": "string",
  //           "saleAttrValueName": "string",
  //           "spuId": 0
  //         }
  //       ]
  //     }
  //   ],
  //   "tmId": 0
  // }
  //     }
  //   }
  methods: {
    //删除图片
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.spuForm.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //如果是sup修改就执行该函数
    initUpdateSpuForm(row) {
      this.getSpuInfo(row.id);
      this.getSpuImageList(row.id);
      this.getBaseSaleAttrList();
      this.getTradeMarks();
    },
    //请求图片
    async getSpuImageList(id) {
      const { data } = await this.$API.sku.getSpuImageList(id);
      console.log("图片", data);

      data.forEach((imgObj) => {
        imgObj.name = imgObj.name;
        imgObj.url = imgObj.imgUrl;
      });
      this.spuImageList = data;
    },
    async getSpuInfo(id) {
      const res = await this.$API.spu.getSpuInfo(id);
      console.log("覆盖spuForm的初始化数据", res);
      //覆盖spuForm的初始化数据
      this.spuForm = res.data;
    },
    //请求销售属性列表
    async getBaseSaleAttrList() {
      const res = await this.$API.spu.getBaseSaleAttrList();
      console.log("销售属性列表", res);
    },
    // 根据当前页数page和当前页面显示条数limit,获取对应的品牌列表
    async getTradeMarks() {
      const res = await this.$API.trademark.getTradeMarks();
      console.log("根据当前页数", res);
      this.trademarkList = res.data;
    },
    // 用于监视图片上传是否成功,成功会执行该回调函数
    handleSuccess(response, file, fileList) {
      // response是当前上传接口返回的相应数据
      //file是当前图片对应的本地文件对象
      //fileList是当前照片墙展示的数组
      console.log(response, file, fileList);
      this.spuForm.spuImageList = fileList;
    },
    addSaleAttr() {
      // 收集数据
      const { spuSaleAttrStr } = this;
      const [saleAttrName, baseSaleAttrId] = spuSaleAttrStr.split(":");

      //整理数据结构
      // 我们手头只有ID,没有属性的属性名
      // {
      //   baseSaleAttrId: 0,
      //   saleAttrName: "",
      //   spuSaleAttrValueList: [
      //   ],
      // },
      this.spuForm.spuSaleAttrList.push({
        saleAttrName,
        baseSaleAttrId,
        spuSaleAttrValueList: [],
      });

      // 记得清空spuSaleAttrStr的数据,防止显示错误
      this.spuSaleAttrStr = "";
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>