<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelector @changeCategory="changeCategory" />
    </el-card>
    <el-card style="margin: 20px 0">
      <div v-show="isShowList">
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
      </div>

      <div v-show="!isShowList">
        <el-form style="width: 30%" :model="attrFrom" label-width="60px">
          <el-form-item label="属性名">
            <el-input
              v-model="attrFrom.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
        <el-button>取消</el-button>

        <el-table border style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column label="属性值"></el-table-column>
          <el-table-column label="操作" width="160"> </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </div>
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
      isShowList: false,
      attrFrom: {
        attrName: "", //收集的数据
        attrValueList: [
          // {
          //   attrId: 0, 这是属性的唯一表示,如果是添加肯定没有,修改肯定有
          //   id: 0, 这是属性值的唯一标识,如果是添加肯定没有,修改可能有
          //   valueName: "string",
          // },
        ],
        categoryId: 0, //声明当前属性属于哪个分类id
        categoryLevel: 3, //声明categoryId是几级分类的
        // id: 0, 新增属性不可能有id,只有修改的时候才会有
      },
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