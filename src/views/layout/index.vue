<template>
  <div class="layout-container">
    <keep-alive
      ><!-- 子路由出口 -->
      <router-view></router-view
    ></keep-alive>

    <!-- 标签导航栏 -->
    <van-tabbar class="layout-tabbar" route>
      <van-tabbar-item to="/">
        <i slot="icon" class="toutiao toutiao-shouye"></i
        ><span class="text">首页</span></van-tabbar-item
      >
      <van-tabbar-item to="/video"
        ><i slot="icon" class="toutiao toutiao-shipin"></i
        ><span class="text">视频</span></van-tabbar-item
      >
      <van-tabbar-item to="/qa"
        ><i slot="icon" class="toutiao toutiao-wenda"></i
        ><span class="text">问答</span></van-tabbar-item
      >
      <van-tabbar-item to="/my"
        ><i slot="icon" class="toutiao toutiao-wode"></i
        ><span class="text">{{
          $store.state.user ? '我的' : '未登录'
        }}</span></van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // 渲染好之后再次添加缓存
    this.$store.commit('addCacheComponents', 'LayoutIndex')
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.layout-container {
  .layout-tabbar {
    i.toutiao {
      font-size: 40px;
    }
    span.text {
      font-size: 20px;
    }
  }
}
</style>
