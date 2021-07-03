import request from "@/utils/request";

export function login(data) {
  return request({
    //POST /admin/acl/index/login
    url: "/admin/acl/index/login",
    method: "POST",
    data
  });
}

export function getInfo(token) {
  // GET /admin/acl/index/info?token=eeeeaaabbc123
  // 此处的params其实是用来接收query传参用的,会自动将对象的属性名作为key,属性值作为value
  return request({
    url: "/admin/acl/index/info",
    method: "GET",
    params: { token }
  });
}

export function logout() {
  // POST /admin/acl/index/logout
  return request({
    url: "/admin/acl/index/logout",
    method: "POST"
  });
}
