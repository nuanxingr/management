import request from "@/utils/request";

export default {
  //GET /admin/product/getCategory1
  // 获取一级分类列表
  getCategory1() {
    return request.get(`/admin/product/getCategory1`);
  },
  //GET /admin/product/getCategory2
  // 获取二级分类列表,需要传入一级分类id
  getCategory2(category1Id) {
    return request.get(`/admin/product/getCategory2/${category1Id}`);
  },

  getCategory3(category2Id) {
    return request.get(`/admin/product/getCategory3/${category2Id}`);
  }
};
