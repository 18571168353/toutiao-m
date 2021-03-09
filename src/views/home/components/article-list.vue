<template>
  <div class="article-list" ref="articleListRef">
    <!-- 文章列表 -->
    <van-pull-refresh
      v-model="isRefreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1500"
    >
      <!-- 列表 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
      <!-- 文章列表 -->
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: { ArticleItem },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [], // 文章列表数据
      loading: false, // 上拉加载更多的 loading 状态
      finished: false, // 是否加载结束
      error: false, // 是否加载失败
      timestamp: null, // 请求下一页数据的时间戳
      isRefreshLoading: false, // 控制下拉刷新的loading状态
      refreshSuccessText: '刷新成功', // 更新下拉刷新成功的提示的文本
      scrollTop: 0
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    const articleList = this.$refs.articleListRef
    articleList.onscroll = () => {
      this.scrollTop = articleList.scrollTop
    }
  },
  activated() {
    // 从缓存中被激活
    this.$refs.articleListRef.scrollTop = this.scrollTop
  },
  deactivated() {
    // 从缓存中失去活动
  },

  methods: {
    // 当触发上拉加载更多的时候调用该函数
    async onLoad() {
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道 id
          timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })

        // 模拟报错
        // if (Math.random() > 0.2) {
        //   JSON.parse('dfnsdjfhjsdkj')
        // }

        // 2. 把数据添加到 list 数组中
        const { results } = data.data

        this.list.push(...results)
        // 3. 设置本次加载中 loading 状态结束
        this.loading = false

        // 4. 判断数据是否加载结束
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，设置加载状态结束，不再触发上拉加载更多了
          this.finished = true
        }
        // console.log(data)
      } catch (err) {
        console.log(err)
        this.loading = false // 关闭 loading 效果
        this.error = true // 开启错误提示
      }
    },
    async onRefresh() {
      try {
        // 1.请求数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道 id
          timestamp: Date.now(),
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // 模拟报错
        // if (Math.random() > 0.2) {
        //   JSON.parse('dfnsdjfhjsdkj')
        // }
        // 2.将数据追加到列表顶部
        const { results } = data.data
        this.list.unshift(...results)

        // 3.关闭下拉刷新的loading状态
        this.isRefreshLoading = false

        // 更新下拉刷新成功的提示的文本
        this.refreshSuccessText = `刷新成功,更新了${results.length}条数据`
      } catch (err) {
        this.isRefreshLoading = false
        this.refreshSuccessText = '刷新失败,请稍后在试!'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
