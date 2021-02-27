<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
          <template slot-scope="scope">
            {{ scope.row.is_send }}
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showBox"
          ></el-button>
          <el-button
            size="mini"
            type="success"
            icon="el-icon-location"
            @click="showBox1"
          ></el-button>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改编辑城市对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="closeDialog"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 查询物流对话框 -->
    <el-dialog title="提示" :visible.sync="findDialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata.js";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 订单数据条数
      total: 0,
      // 订单数据列表
      orderlist: [],
      // 对话框的显示与隐藏
      addressVisible: false,
      // 用于存储选择区域的数据
      addressForm: {
        address1: [],
        address2: ""
      },
      //表单的验证规则
      addressFormRules: {
        address1: [
          { required: true, message: "请输入省市区/县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      // 城市名称
      cityData,
      // 物流对话框的显示与隐藏
      findDialogVisible: false,
      // 获取物流的数据
      progressInfo: []
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单列表失败！");
      }
      console.log(res);
      this.total = res.data.total;
      this.orderlist = res.data.goods;
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getOrderList();
    },
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum;
      this.getOrderList();
    },
    // 显示修改对话框
    showBox() {
      this.addressVisible = true;
    },
    // 关闭弹框清除原来的选项
    closeDialog() {
      //  :before-close="handleClose"
      this.$refs.addressFormRef.resetFields();
    },
    // 显示物流对话框
    async showBox1() {
      // 下面是掉接口的数据，后台的api不在提供了
      // const { data: res } = await this.$http.get("/kuaidi/804909574412544580");
      // if (res.meta.status !== 200) {
      //   return this.$message.error("获取物流信息失败！");
      // }
      // this.progressInfo = res.data;
      this.findDialogVisible = true;
      console.log(this.progressInfo);
    }
  }
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
