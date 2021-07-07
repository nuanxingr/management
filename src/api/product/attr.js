import request from "@/utils/request";

//     GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
//      根据当前三级分类的id获取对应的属性列表
export default {
  getAttrList(category1Id, category2Id, category3Id) {
    return request.get(
      `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    );
  },

  // DELETE /admin/product/deleteAttr/{attrId}
  // deleteAttr
  deleteAttr(attrId) {
    return request.delete(`/admin/product/deleteAttr/${attrId}`);
  },
  // POST /admin/product/saveAttrInfo
  // saveAttrInfo
  addOrUpdate(attrInfo) {
    return request.post(`/admin/product/saveAttrInfo`, attrInfo);
  }
};
