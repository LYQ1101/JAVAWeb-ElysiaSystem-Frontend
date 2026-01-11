import request from "@/utils/request";

//查询全部部门数据
export const queryAllApi = () =>  request.get('/depts');

//新增
export const addApi = (name) =>  request.post('/depts', null, { 
  params: { name: name } // 后端接收String name时，会读取这个URL参数
});

//根据ID查询
export const queryByIdApi = (id) =>  request.get(`/depts/${id}`);

//修改
export const updateApi = (dept) =>  request.put('/depts', dept);

//删除
export const deleteByIdApi = (id) =>  request.delete(`/depts?id=${id}`);


