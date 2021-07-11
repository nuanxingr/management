<template>
  <div>
    <el-card>
      <el-form ref="form" :model="skuForm" label-width="80px">
        <el-form-item label="SPU名称"></el-form-item>
        <el-form-item label="SKU名称">
          <el-input
            v-model="skuForm.skuName"
            placeholder="请输入SKU名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
          <el-input
            type="number"
            v-model="skuForm.price"
            placeholder="请输入SKU价格"
          ></el-input>
        </el-form-item>

        <el-form-item label="重量(千克)">
          <el-input
            type="number"
            v-model="skuForm.weight"
            placeholder="请输入SKU重量"
          ></el-input>
        </el-form-item>

        <el-form-item label="规格描述">
          <el-input
            type="textarea"
            v-model="skuForm.skuDesc"
            placeholder="请输入SKU规格描述"
          ></el-input>
        </el-form-item>

        <el-form-item label="平台属性">
          <el-form :inline="true" label-width="100px">
            <el-form-item
              :label="attr.attrName"
              v-for="attr in attrList"
              :key="attr.id"
            >
              <el-select v-model="attr.attrIdValueId" placeholder="请选择">
                <el-option
                  :label="attrValue.valueName"
                  :value="`${attr.id}:${attrValue.id}`"
                  v-for="attrValue in attr.attrValueList"
                  :key="attrValue.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
          <el-form :inline="true" label-width="100px">
            <el-form-item
              v-for="SpuSaleAttr in SpuSaleAttrList"
              :key="SpuSaleAttr.id"
              :label="SpuSaleAttr.saleAttrName"
            >
              <el-select
                v-model="SpuSaleAttr.attrIdValueId"
                placeholder="请选择"
              >
                <el-option
                  v-for="spuSaleAttrValue in SpuSaleAttr.spuSaleAttrValueList"
                  :key="spuSaleAttrValue.id"
                  :label="spuSaleAttrValue.saleAttrValueName"
                  :value="`${SpuSaleAttr.baseSaleAttrId}:${spuSaleAttrValue.id}`"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>

        <el-form-item label="图片列表">
          <!-- @selection-change="handleSelectionChange" -->
          <el-table :data="SpuImageList" style="width: 100%" border>
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="图片">
              <template slot-scope="{ row }">
                <img
                  :src="row.imgUrl"
                  style="width: 100px; height: 100px"
                  alt=""
                />
              </template>
            </el-table-column>
            <el-table-column prop="imgName" label="名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <el-button type="primary">设为默认</el-button>
                <!-- <el-tag type="success">默认</el-tag> @click="setDefault(row)" -->
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      skuForm: {
        category3Id: 0,
        createTime: "2021-07-10T07:13:45.995Z",
        id: 0,
        //写静态样式通过v-model自动收集好了
        skuName: "",
        price: "",
        weight: "",
        skuDesc: "",
        // 需要手动收集
        skuAttrValueList: [],
        skuDefaultImg: "",
        skuImageList: [],
        skuSaleAttrValueList: [],

        skuAttrValueList: [
          {
            attrId: 0,
            attrName: "string",
            id: 0,
            skuId: 0,
            valueId: 0,
            valueName: "string",
          },
        ],
        skuDefaultImg: "string",
        skuDesc: "string",
        skuImageList: [
          {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            isDefault: "string",
            skuId: 0,
            spuImgId: 0,
          },
        ],
        skuName: "string",
        skuSaleAttrValueList: [
          {
            id: 0,
            saleAttrId: 0,
            saleAttrName: "string",
            saleAttrValueId: 0,
            saleAttrValueName: "string",
            skuId: 0,
            spuId: 0,
          },
        ],

        spuId: 0,
        tmId: 0,
        weight: "string",
      },
      spuForm: {},
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      SpuSaleAttrList: [],
      SpuImageList: [],
    };
  },
  methods: {
    async initAddSkuForm(spu, category1Id, category2Id, category3Id) {
      this.spuForm = spu;
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      //发送请求
      const promise1 = this.$API.attr.getAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      const promise2 = this.$API.sku.getSpuSaleAttrList(spu.id);
      const promise3 = this.$API.sku.getSpuImageList(spu.id);

      const res = await Promise.all([promise1, promise2, promise3]);

      this.attrList = res[0].data; //平台属性
      this.SpuSaleAttrList = res[1].data; //销售属性
      this.SpuImageList = res[2].data; //图片
    },
  },
};
</script>

<style>
</style>