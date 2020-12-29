<template>
  <!-- 总体区域 -->
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧区域  -->
      <el-aside :width="isCollapse? '64px':'200px'">
        <div class="zhedie" @click="zhediebtn">  
          |||
        </div>
        <el-menu
          background-color="#383d41"
          text-color="#fff"
          active-text-color="#0c7d9d"
          :unique-opened="true"
          :collapse= "isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- i 表示图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path"  v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <!-- i 表示图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 中间区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单的数据
      menulist:[],
      iconsObj:{
        '125':'iconfont icon-users',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao',
        '125':'iconfont icon-users',
        
      },
      //是否折叠
      isCollapse:false,
      // 被激活的地址
      activePath:''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    loginout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有的菜单
    async getMenuList() {
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    // 点击按钮，切换菜单的折叠与展开
    zhediebtn() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }

  } 
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #383d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #383d41;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #fff;

}
.iconfont{
  margin-right: 10px;
}
.zhedie{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>