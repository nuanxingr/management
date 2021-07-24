<template>
  <div>
    <el-card>
      <CategorySelector @changeCategory="changeCategory"></CategorySelector>
    </el-card>

    <el-card>
      <div v-show="isShowList">
        <el-button
          :disabled="!category3Id"
          icon="el-icon-plus"
          type="primary"
          @click="showSpuForm"
          >添加</el-button
        >
        <el-table :data="spuList" border style="width: 100%">
           <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
          <el-table-column prop="description" label="SPU描述">
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <HintButton
                type="success"
                size="mini"
                icon="el-icon-plus"
                title="添加SKU"
                @click="showSkuForm(row)"
              ></HintButton>
              <HintButton
                type="primary"
                size="mini"
                icon="el-icon-edit"
                title="修改SPU"
                @click="showSpuForm(row)"
              ></HintButton>
              <HintButton
                type="info"
                size="mini"
                icon="el-icon-info"
                title="查看SKU列表"
                @click="showSkuList(row)"
              ></HintButton>
              
                <el-popconfirm
                  :title="`确定删除${row.spuName}吗？`"
                  @onConfirm="delSpuName(row.id)"
                  >
                   <HintButton
                   slot="reference"
                   type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   title="删除SPU"
               ></HintButton>
                </el-popconfirm>
 
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[2, 3, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper, -> , sizes, total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
        <!-- 查看SKU列表结构 -->
        <el-dialog :title="`${sup.spuName}=>sku列表`" :visible.sync="dialogTableVisible">
          <el-table :data="skuList" style="width: 100%" border>
            <el-table-column prop="skuName" label="名称" ></el-table-column>
            <el-table-column prop="price" label="价格(元)" ></el-table-column>
            <el-table-column prop="weight" label="重量(千克)" ></el-table-column>
            <el-table-column label="默认图片">
              <template slot-scope="{row}">
                <img :src="row.skuDefaultImg" style="width:100px; height:100px" alt="">
              </template>
            </el-table-column>

            </el-table-column>
          </el-table>
        </el-dialog>
      </div>
      <SpuForm ref="spuForm" :category3Id="category3Id" :visible.sync="isShowSpuForm" v-show="isShowSpuForm"></SpuForm>
      <SkuForm ref="skuForm" :visible.sync="isShowSkuForm" v-show="isShowSkuForm"></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "./components/SpuForm";
import SkuForm from "./components/SkuForm";

export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // isShowList: true,

      page: 1,
      limit: 5,
      total: 20,
      spuList: [],
      isShowSpuForm: false,
      isShowSkuForm: false,

      dialogTableVisible: false, //用于是否显示查看sku列表的状态
      sup: {}, //存放当前的哪一行
      skuList: [], //存放sku列表的请求数据
    };
  },
  methods: {
    changeCategory({ id, label }) {
      if (label === 1) {
        this.category1Id = id;
        this.category2Id = "";
        this.category3Id = "";
      } else if (label === 2) {
        this.category2Id = id;
        this.category3Id = "";
      } else if (label === 3) {
        this.category3Id = id;
        //发送请求
        this.getSpuList();
      }
    },
    async getSpuList() {
      const {
        data: { total, records },
      } = await this.$API.spu.getSpuList(
        this.page,
        this.limit,
        this.category3Id
      );
      this.total = total;
      this.spuList = records;
      console.log(this.spuList);
    },
    //发送请求,获取对应页面的数据
    handleSizeChange(value) {
      this.limit = value;
      this.getSpuList();
    },
    handleCurrentChange(value) {
      this.page = value;
      this.getSpuList();
    },
    //修改isShowSpuForm: false,切换状态
    showSpuForm(row) {
      this.isShowSpuForm = true;
      // 之后会显示出该组件
      //  间接请求数据(命令spuForm组件请求数据)
      // console.log(this.$refs.spuForm.spuForm)
      if (row.id) {
        // 添加标识来区分是修改SPU还是添加SPU
        this.flag = true;
        this.$refs.spuForm.initUpdateSpuForm(row);
      } else {
        this.$refs.spuForm.initAddSpuForm();
      }
    },
    // 用于显示SkuForm模块
    showSkuForm(row) {
      this.isShowSkuForm = true;

      const { category1Id, category2Id, category3Id } = this;
      this.$refs.skuForm.initAddSkuForm(
        row,
        category1Id,
        category2Id,
        category3Id
      );
    },
    //查看sku列表
    async showSkuList(row) {
      //改变dialogTableVisible状态（显示）
      this.dialogTableVisible = true;
      this.sup = row;
      //请求数据
      const { data } = await this.$API.sku.getSkuList(row.id);

      //存放到skuList中
      this.skuList = data;
    },
    //删除spu属性列表
    async delSpuName(id) {
      try {
        await this.$API.spu.deleteSpu(id);
        this.$message.success("删除成功");
      } catch (error) {
        this.$message.info("删除失败");
      }
    },
  },
  computed: {
    // 只要该计算属性,依赖的数据没有发生变化,该计算属性的结果不会重新计算(计算属性会缓存上一次的结果直接使用)
    // 依赖的数据(此处说的数据,必须是响应式数据)发生变化,计算属性就会重新计算(不一定)
    isShowList() {
      const { isShowSpuForm, isShowSkuForm } = this;
      return !isShowSpuForm && !isShowSkuForm;
    },
  },
  components: {
    SpuForm,
    SkuForm,
  },
};
</script>

<style>
</style>