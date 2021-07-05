import request from "@/utils/request";

export default {
  // DELETE /admin/product/baseTrademark/remove/{id}
  // 根据品牌id删除对应品牌
  deleteTradeMark(id) {
    return request.delete(`/admin/product/baseTrademark/remove/${id}`);
  },
  // POST /admin/product/baseTrademark/save
  // 新增品牌
  // {
  //     "logoUrl": "string",
  //     "tmName": "string"
  //  }
  // PUT /admin/product/baseTrademark/update
  // 修改品牌
  // {
  //     "id": 0,                 品牌ID(id属性是后端生成的,也就是说添加品牌不需要传入id,修改才需要)
  //     "logoUrl": "string",     品牌LOGO链接
  //     "tmName": "string"       品牌名称
  // }

  addOrUpdate(trademark) {
    if (trademark.id) {
      //修改
      return request.put(`/admin/product/baseTrademark/update`, trademark);
    } else {
      // 添加
      return request.post(`/admin/product/baseTrademark/save`, trademark);
    }
  },

  // GET /admin/product/baseTrademark/{page}/{limit}
  // 根据当前页数page和当前页面显示条数limit,获取对应的品牌列表
  getTradeMarkList(page, limit) {
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`);
  }
};
