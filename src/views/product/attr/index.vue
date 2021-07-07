<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelector @changeCategory="changeCategory" />
    </el-card>
    <el-card style="margin: 20px 0">
      <el-button icon="el-icon-plus" type="primary">添加属性</el-button>
      <el-table :data="attrList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="180">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template slot-scope="{ row }">
            <el-tag
              type="success"
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template>
            <HintButton
              @click="text"
              type="info"
              icon="el-icon-edit"
              title="编辑"
            />
            <HintButton
              @click="text"
              type="danger"
              icon="el-icon-delete"
              title="删除"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
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
        this.getAttrList();
      }
    },

    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      const { data } = await this.$API.attr.getAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      console.log(data);
      this.attrList = data;
    },
    text() {
      console.log(11);
    },
  },
};
</script>

<style>
</style>