<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 左侧tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        :label-position="'top'"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <!-- 商品分类级联选择区域 -->
            <el-form-item label="商品分类" prop="goods_cate">
              <el-cascader
                v-model="addForm.goods_cate"
                expand-trigger="hover"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" />
            <el-button type="primary" class="btnAdd" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片弹框区域 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img class="previewClass" :src="previewPath" alt="" />
    </el-dialog>
  </div>
</template>

<script>
var _ = require("lodash");
export default {
  data() {
    return {
      activeIndex: "0",
      // 添加表单对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品列表
        goods_cate: [],
        // 图片的数组
        pics: [],
        // 文本编辑的内容
        goods_introduce: "",
        attrs: []
      },
      // 添加表单验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cate: [
          { required: true, message: "请输入商品分类", trigger: "blur" }
        ]
      },
      // 获取商品分类列表
      catelist: [],
      // 级联选择器的配置对象
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 获取动态参数列表
      manyTableData: [],
      // 获取静态数据
      onlyTableData: [],
      // 图片上传地址
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      // 图片上传时要用header请求头对象，携带token
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      // 图片预览的绝对地址
      previewPath: "",
      // 是否显示图片预览的弹框
      previewVisible: false
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      this.catelist = res.data;
      console.log(res.data);
    },
    // 级联选择器选中变化时，会触发这个函数
    handleChange() {
      console.log(this.addForm.goods_cate);
      if (this.addForm.goods_cate.length !== 3) {
        this.addForm.goods_cate = [];
      }
    },
    // 选择商品分类后才能切换tab栏
    beforeTabLeave(activeName, oldActiveName) {
      // activeName-->即将进入的索引的名字
      // oldActiveName-->即将离开的索引的名字
      if (oldActiveName === "0" && this.addForm.goods_cate.length !== 3) {
        this.$message.error("请选择商品分类！");
        return false;
      }
    },
    // 点击tab栏时切换数据
    async tabClicked() {
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态数据失败！");
        }
        console.log(res.data);
        res.data.forEach(item => {
          // item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
          item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取静态属性失败！");
        }
        console.log(res.data);
        this.onlyTableData = res.data;
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // 找到文件的路径
      const filePath = file.response.data.tmp_path;
      // 从pics数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath);
      //调用数组的splice方法，把图从数组中移除
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },
    //监听图片是否上传成功
    handleSuccess(response) {
      console.log(response);
      // 拼接得到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path
      };
      // 2.将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo);
      console.log(this.addForm);
    },
    // 添加商品
    add() {
      // 添加之前判断表单的预验证
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项！");
        }
        // 执行添加的业务逻辑
        // lodash
        const form = _.cloneDeep(this.addForm);
        form.goods_cate = form.goods_cate.join(',');
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            // attr_value: item.attr_vals.join(" ")
            attr_value: item.attr_vals === [] ? "":item.attr_vals.join(' ')
          };
          this.addForm.attrs.push(newInfo);
        });
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals };
          this.addForm.attrs.push(newInfo);
        });
        form.attrs = this.addForm.attrs;
        console.log(form);
        // 发起请求添加商品
       const {data:res} = await this.$http.post('goods',form)
       if(res.meta.status !== 201) {
       return this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      });
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cate.length === 3) {
        return this.addForm.goods_cate[2];
      }
      return null;
    }
  }
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0, 10px, 0, 0 !important;
}
.previewClass {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
