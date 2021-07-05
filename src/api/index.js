//将所有的API统一暴露
export { default as user } from "./user";
export { default as trademark } from "@/api/product/trademark";
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
