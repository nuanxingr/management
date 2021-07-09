//将所有的API统一暴露
export { default as user } from "./user";
export { default as trademark } from "@/api/product/trademark";
export { default as category } from "@/api/product/category";
export { default as attr } from "@/api/product/attr";
export { default as sku } from "./product/sku";
export { default as spu } from "./product/spu";
/* 最终index.js暴露出去的内容
{
    trademark:{
        getTradeMarkList(){},
        addOrUpdate(){},
        deleteTradeMark(){}
    },
    user:{
        login(){},
        logout(){},
        getInfo(){}
    }
} */
