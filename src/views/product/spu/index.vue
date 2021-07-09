<template>
  <div>
    <el-card>
      <CategorySelector @changeCategory="changeCategory"></CategorySelector>
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
    getAttrList(){
      
    }
  },
};
</script>

<style>
</style>