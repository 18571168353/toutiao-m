<template>
  <div class="search-container">
    <!-- 搜索栏》事件监听 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        class="search-form"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        background="#3296FA"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 搜索结果 -->
    <search-result
      v-if="isResultShow"
      :search-text="searchText"
    ></search-result>
    <!-- 搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
    ></search-suggestion>
    <!-- 联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history
      :search-histories="searchHistories"
      @clear-search-histories="searchHistories = []"
      @cancel="onCancel"
      v-else
      @search="onSearch"
    ></search-history>
    <!-- 搜索历史记录 -->
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {},
  data() {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的展示
      searchHistories: getItem('TOUTIAO_HISTORIES') || [] //  搜索的历史记录数据
    }
  },
  computed: {},
  watch: {
    searchHistories(value) {
      console.log(1)
      setItem('TOUTIAO_HISTORIES', value)
    }
  },
  created() {},
  mounted() {},
  methods: {
    onSearch(val) {
      // this.$toast(val)
      // 更新文本框内容
      this.searchText = val
      // 储存搜索历史记录
      // 不能有重复
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel() {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }
}
</style>
