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
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="150">
          </el-table-column>

          <el-table-column align="center" label="操作">
            <template>
              <HintButton
                type="success"
                size="mini"
                icon="el-icon-plus"
                title="添加SKU"
                @click="showSkuForm"
              ></HintButton>
              <HintButton
                type="primary"
                size="mini"
                icon="el-icon-edit"
                title="修改SPU"
                @click="showSpuForm"
              ></HintButton>
              <HintButton
                type="info"
                size="mini"
                icon="el-icon-info"
                title="查看SKU列表"
              ></HintButton>
              <HintButton
                type="danger"
                size="mini"
                icon="el-icon-delete"
                title="删除SPU"
              ></HintButton>
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
      </div>
      <SpuForm v-show="isShowSpuForm"></SpuForm>
      <SkuForm v-show="isShowSkuForm"></SkuForm>
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
      spuList: [],
      page: 1,
      limit: 5,
      total: 20,
      isShowSpuForm: false,
      isShowSkuForm: false,
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
    showSpuForm() {
      this.isShowSpuForm = true;
    },
    showSkuForm() {
      this.isShowSkuForm = true;
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