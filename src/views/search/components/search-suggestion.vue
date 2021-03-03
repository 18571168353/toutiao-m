<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(text, index) in suggestion"
      :key="index"
      @click="$emit('search', item)"
    >
      <span slot="title" v-html="highlightText(text)"> </span>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestion: []
    }
  },
  computed: {},
  watch: {
    searchText: {
      handler: debounce(function(value) {
        this.getSearchSuggestion(value)
        // console.log(value)
      }, 1000),
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    async getSearchSuggestion(q) {
      try {
        const { data } = await getSearchSuggestion(q)
        this.suggestion = data.data.options
        // console.log(data)
      } catch (err) {
        this.$toast('获取数据失败,请稍后重试!')
      }
    },
    // 高亮函数
    highlightText(text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
    }
  }
}
</script>

<style lang="less" scoped>
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
