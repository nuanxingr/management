<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelector @changeCategory="changeCategory" />
    </el-card>
    <el-card style="margin: 20px 0">
      <div v-show="isShowList">
        <el-button icon="el-icon-plus" type="primary" @click="showAttrForm"
          >添加属性1</el-button
        >
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
            <template slot-scope="{ row }">
              <HintButton
                type="info"
                icon="el-icon-edit"
                title="编辑"
                @click="showAttrForm(row)"
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
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrFrom.attrName"
          @click="addAttrValue"
          >添加属性</el-button
        >
        <el-button>取消</el-button>

        <el-table border style="width: 100%" :data="attrFrom.attrValueList">
          <el-table-column
            type="index"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column label="属性值">
            <template slot-scope="{ row }">
              <el-input
                v-if="row.isEdit"
                v-model="row.valueName"
                placeholder="请输入属性值"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <HintButton
              size="mini"
              type="danger"
              icon="el-icon-delete"
              title="删除"
            ></HintButton>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowList: true,
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
        //发送请求
        this.getAttrList();
      }
    },
    //发送请求
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
    //封装HintButton的测试事件
    text() {
      console.log(11);
    },
    // 用于监视用户点击添加属性值按钮
    addAttrValue() {
      console.log(11);
      this.attrFrom.attrValueList.push({
        attrId: this.attrFrom.id, //其实在添加功能中不需要这行,这行代码是为了兼容修改功能
        valueName: "",
        isEdit: true, // 给每个新增的属性值对象添加一个标识isEdit,用于控制编辑模式/展示模式的切换
      });
    },
    showAttrForm(row) {
      this.isShowList = false;
      if (row.id) {
        // 此处由于row内部结构过于复杂,不能使用...对其进行浅拷贝,否则会出现问题
        // 需要对row对象进行深拷贝处理
        // this.attrForm={...row};
        this.attrFrom = cloneDeep(row);
        console.log(this.attrFrom);
        this.attrFrom.attrValueList.forEach((item) => {
          this.$set(item, "isEdit", false);
        });
      }
    },
    //当用户点击取消按钮,切换回属性列表,隐藏添加属性模块
    cancel() {
      //清空数据
      this.attrFrom.attrValueList = [];
      this.isShowList = true;
    },
  },
};
</script>

<style>
</style>