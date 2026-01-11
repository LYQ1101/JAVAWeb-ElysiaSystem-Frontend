<script setup>
import { ref, onMounted } from 'vue';
import { queryAllApi, addApi, queryByIdApi, updateApi, deleteByIdApi } from '@/api/dept';
import { ElMessage, ElMessageBox } from 'element-plus';

//钩子函数
onMounted(() => {
  search();
})

//查询
const deptList = ref([])
const search = async () => {
  const result = await queryAllApi();
  if(result.code){
    deptList.value = result.data;
  }
}

//Dialog对话框
const dialogFormVisible = ref(false);
const formTitle = ref('');
const dept = ref({name: ''});

//新增部门
const addDept = () => {
  dialogFormVisible.value = true;
  formTitle.value = '新增部门';
  dept.value = {name: ''};

  //重置表单的校验规则-提示信息
  if (deptFormRef.value){
    deptFormRef.value.resetFields();
  }
  
}


// 保存部门（只修改新增分支的addApi调用，其余代码完全不变）
const save = async () => {
  //表单校验
  if(!deptFormRef.value) return;
  deptFormRef.value.validate(async (valid) => { 
    if(valid){ //通过
      let result ;
      if(dept.value.id){ //修改（保持不变）
        result = await updateApi(dept.value);
      }else{ //新增（仅修改这一行！）
        // 核心修改：只传递dept.name字符串，而非整个对象
        result = await addApi(dept.value.name); 
      }

      if(result.code){ //成功
        ElMessage.success('操作成功');
        dialogFormVisible.value = false;
        search();
      }else{ //失败
        ElMessage.error(result.msg);
      }
    }else { //不通过
      ElMessage.error('表单校验不通过');
    }
  })
}


//表单校验
const rules = ref({
  name: [
    { required: true, message: '部门名称是必填项', trigger: 'blur' },
    { min: 2, max: 10, message: '部门名称的长度应该在2-10位', trigger: 'blur' }
  ]
})
const deptFormRef = ref();

//编辑
const edit = async (id) => {
  formTitle.value = '修改部门';
  //重置表单的校验规则-提示信息
  if (deptFormRef.value){
    deptFormRef.value.resetFields();
  }

  const result = await queryByIdApi(id);
  if(result.code){
    dialogFormVisible.value = true;
    dept.value = result.data;
  }
}

//删除
const delById = async (id) => {
  //弹出确认框
  ElMessageBox.confirm('您确认删除该部门吗?','提示',
    { confirmButtonText: '确认',cancelButtonText: '取消',type: 'warning'}
  ).then(async () => { //确认
    const result = await deleteByIdApi(id);
    if(result.code){
      ElMessage.success('删除成功');
      search();
    }else{
      ElMessage.error(result.msg);
    }
  }).catch(() => { //取消
    ElMessage.info('您已取消删除');
  })
}

</script>

<template>
  <h1>部门管理</h1>
  <div class="container">
    <el-button type="primary" @click="addDept"> + 新增部门</el-button>
  </div>

  <!-- 表格 -->
  <div class="container">
    <el-table :data="deptList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100" align="center"/>
      <el-table-column prop="name" label="部门名称" width="300" align="center"/>
      <el-table-column prop="updateTime" label="最后操作时间" width="350" align="center"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="edit(scope.row.id)"><el-icon><EditPen /></el-icon> 编辑</el-button>
          <el-button type="danger" size="small" @click="delById(scope.row.id)"><el-icon><Delete /></el-icon> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- Dialog对话框 -->
  <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
    <el-form :model="dept" :rules="rules" ref="deptFormRef">
      <el-form-item label="部门名称" label-width="80px" prop="name">
        <el-input v-model="dept.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<style scoped>
.container {
  margin: 15px 0px;
}
</style>
