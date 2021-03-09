<template>
  <div id="app">
    <keep-alive :include="cacheComponents"
      ><!-- 路由出口 -->
      <router-view
    /></keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: mapState(['cacheComponents'])
}
</script>
<style lang="less"></style>
