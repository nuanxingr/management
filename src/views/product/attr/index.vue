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
            <template slot-scope="{ row, $index }">
              <HintButton
                type="info"
                icon="el-icon-edit"
                title="编辑"
                @click="showAttrForm(row)"
              />
              <el-popconfirm
                :title="`这是一段内容确定吗?`"
                @onConfirm="attrListValue(row.id)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  title="删除2"
                />
              </el-popconfirm>
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
                ref="editInput"
                v-model="row.valueName"
                placeholder="请输入属性值"
                @blur="toLook(row)"
              ></el-input>
              <div @click="toEdit(row)" v-else>{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`这是一段内容确定 ${row.valueName} 吗?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <HintButton
                  slot="reference"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  title="删除1"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
const resetAttrForm = () => ({
  attrName: "",
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
});

export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowList: true,
      attrFrom: resetAttrForm(),
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
    //删除属性列表
    async attrListValue(id) {
      console.log(id);
      //发送请求
      try {
        await this.$API.attr.deleteAttr(id);
        this.$message.success("删除成功");
        this.getAttrList();
      } catch (error) {
        this.$message.info("删除失败");
      }
    },
    // 用于监视用户点击添加属性值按钮
    addAttrValue() {
      // console.log(11);
      this.attrFrom.attrValueList.push({
        attrId: this.attrFrom.id, //其实在添加功能中不需要这行,这行代码是为了兼容修改功能
        valueName: "11",
        isEdit: false, // 给每个新增的属性值对象添加一个标识isEdit,用于控制编辑模式/展示模式的切换
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
    toLook(row) {
      const { valueName } = row;
      const isRepeat = this.attrFrom.attrValueList.some((item) => {
        if (item !== row) {
          return item.valueName === valueName;
        }
      });
      if (isRepeat) {
        this.$message.info("属性名已有，请重新输入...");
        return false;
      }
      if (valueName) {
        row.isEdit = false;
      } else {
        this.$message.info("属性值不能为空");
      }
    },
    toEdit(row) {
      row.isEdit = true;
      // 注意:
      // 数据更新:同步更新状态数据
      // 视图更新:Vue 在更新 DOM 时是异步执行的
      // 通过$nextTick的回调函数,一定可以得到当前的最新DOM
      // $nextTick的回调函数会在.then中执行
      this.$nextTick(() => {
        this.$refs.editInput.focus(); //点一下就可以获得焦点
      });
    },
    //当用户点击取消按钮,切换回属性列表,隐藏添加属性模块
    cancel() {
      //清空数据
      this.attrFrom.attrValueList = [];
      this.attrFrom.attrName = "";
      this.isShowList = true;
    },
    //删除编辑
    deleteAttrValue($index) {
      this.attrFrom.attrValueList.splice($index, 1);
    },
    //保存数据
    async save() {
      //1.收集数据
      // 获取到三级分类id,以及attrForm
      const { category3Id, attrFrom } = this;

      //2.整理数据结构(满足结构需要)
      // {
      //   "attrName": "string",新增要
      //   "attrValueList": [   新增要
      //     {
      //       "attrId": 0,
      //       "id": 0,
      //       "valueName": "string"新增要
      //     }
      //   ],
      //   "categoryId": 0,     新增要
      //   "categoryLevel": 0,     新增要
      //   "id": 0
      // }
      //2.1 将三级分类id存入attrForm中
      attrFrom.categoryId = category3Id;

      //2.2 如果没有属性名称,也不发送请求
      if (!attrFrom.attrName) {
        this.$message.info("属性名不能为空，保存失败！");
        return;
      }
      //2.3 如果没有属性值,也不发送请求
      if (attrFrom.attrValueList.length === 0) {
        this.$message.info("至少需要一个属性值,保存失败!!!");
        return;
      }
      //2.4 清除属性值对象身上的多余属性isEdit
      attrFrom.attrValueList.forEach((item) => {
        delete item.isEdit;
      });
      //3.发送请求
      try {
        await this.$API.attr.addOrUpdate(attrFrom);
        //4.成功做什么
        this.$message.success("保存成功");
        //4.1 返回列表页
        this.isShowList = true;

        //4.2 请求最新的列表页并展示
        this.getAttrList();
        //4.3 清空添加属性模块的数据,防止再次进入的时候,数据残留
        this.attrFrom = resetAttrForm();
      } catch (error) {
        //5.失败做什么
        this.$message.info("保存失败！！！");
      }
    },
    /*  async save() {
      //1.收集数据
      // 获取到三级分类id,以及attrForm
      const { category3Id, attrForm } = this;

      //2.整理数据结构(满足结构需要)
      // {
      //   "attrName": "string",新增要
      //   "attrValueList": [   新增要
      //     {
      //       "attrId": 0,
      //       "id": 0,
      //       "valueName": "string"新增要
      //     }
      //   ],
      //   "categoryId": 0,     新增要
      //   "categoryLevel": 0,     新增要
      //   "id": 0
      // }
      //2.1 将三级分类id存入attrForm中
      attrForm.categoryId = category3Id;

      //2.2 如果没有属性名称,也不发送请求
      if (!attrForm.attrName) {
        this.$message.info("属性名称不能为空,保存失败!!!");
        return;
      }

      //2.3 如果没有属性值,也不发送请求
      if (attrForm.attrValueList.length === 0) {
        this.$message.info("至少需要一个属性值,保存失败!!!");
        return;
      }

      //2.4 清除属性值对象身上的多余属性isEdit
      attrForm.attrValueList.forEach((item) => {
        delete item.isEdit;
      });

      try {
        //3.发送请求
        await this.$API.attr.addOrUpdate(attrForm);
        //4.成功做什么

        //4.1 返回列表页
        this.isShowList = true;
        this.$message.success("保存成功!!!");

        //4.2 请求最新的列表页并展示
        this.getAttrList();

        //4.3 清空添加属性模块的数据,防止再次进入的时候,数据残留
        this.attrForm = resetAttrForm();
      } catch (error) {
        //5.失败做什么
        this.$message.info("保存失败!!!");
      }
    }, */
  },
};
</script>

<style>
</style>