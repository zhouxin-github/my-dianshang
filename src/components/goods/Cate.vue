<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCatDialogVisible"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        class="tableTop"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效区域 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" size="mini" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button type="danger" size="mini" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 15, 20]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 点击添加按钮，弹出提示框 -->
    <el-dialog title="添加分类" :visible.sync="addCatDialogVisible" width="50%" @close="addCateDialogClosed"
    >
      <el-form
        :model="addCatForm"
        :rules="addCatFormRules"
        ref="addCatFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称: " prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类: ">
          <!-- options 用来指定数据源的 -->
          <!-- props 用来指定配置对象的一定要有 -->
          <!-- v-model 用来存储数据id 的一定是数组类型 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateHandleChange"
            clearable change-on-selecte
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表， 默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      // 控制弹框是否显示隐藏
      addCatDialogVisible: false,
      // 添加分类表单数据对象
      addCatForm: {
        // 将要添加分类的名称
        cat_name: "",
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认要添加的是一级
        cat_level: 0
      },
      // 添加表单验证规则
      addCatFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      // 获取父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps:{
        expandTrigger:'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
       // 选中的父级分类的id数组
      selectedKeys:[],
    };
  },
  // 项目初始实例化时
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      console.log(res.data);
      // 把数据列表赋值给 catelist
      this.catelist = res.data.result;
      // 为总数据条赋值
      this.total = res.data.total;
    },
    // 分页效果 监听 pagesize的改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagenum的改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },
    // 控制弹框的显示与隐藏
    showAddCatDialogVisible() {
      // 显示弹框时去掉接口获取父级分类的数据列表
      this.getParentCateList();
      this.addCatDialogVisible = true;
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败");
      }
      console.log(res.data);
      this.parentCateList = res.data;
    },
    // 选择发生变化时触发这个函数
    parentCateHandleChange() {
      console.log(this.selectedKeys)
      if(this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCatForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 为当前分类的等级赋值
        this.addCatForm.cat_level = this.selectedKeys.length
        return
      }else {
          this.addCatForm.cat_pid = 0,
          this.addCatForm.cat_level = 0
      }
    },
    // 点击按钮时添加新的分类
    addCate() {
      this.$refs.addCatFormRef.validate(async valid => {
        if(!valid) return
       const {data:res} = await this.$http.post('categories',this.addCatForm)
        if(res.meta.status !== 201) {
        return this.$message.error('添加分类失败！')
      }
      this.$message.success('添加分类成功！')
      this.getCateList()
      this.addCatDialogVisible = false
      })
    },
    addCateDialogClosed() {
      this.$refs.addCatFormRef.resetFields()
      this.selectedKeys = []
      this.addCatForm.cat_level = 0
      this.addCatForm.cat_pid = 0
    }
  }
};
</script>

<style lang="less" scoped>
.tableTop {
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
.el-cascader-menu {
  height: 200px;
}
</style>
