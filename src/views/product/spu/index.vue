<template>
  <div>
    <el-card>
      <CategorySelector @changeCategory="changeCategory"></CategorySelector>
    </el-card>
    <el-card>
      <el-button icon="el-icon-plus" type="primary">添加</el-button>
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
            ></HintButton>
            <HintButton
              type="primary"
              size="mini"
              icon="el-icon-edit"
              title="修改SPU"
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
    </el-card>
  </div>
</template>

<script>
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
  },
};
</script>

<style>
</style>