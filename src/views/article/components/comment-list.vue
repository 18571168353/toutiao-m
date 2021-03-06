<template>
  <div class="comment-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error="error"
      error-text="加载失败,请稍后重试!"
      :immediate-check="false"
      @load="onLoad"
    >
      <comment-item
        v-for="(item, index) in list"
        :key="index"
        :comment="item"
        @reply-click="$emit('reply-click', $event)"
      />
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  components: { CommentItem },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      validator(value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
      error: false
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loading = true
    this.onLoad()
  },
  mounted() {},
  methods: {
    async onLoad() {
      try {
        // 1请求获取数据
        const { data } = await getComments({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        // 2将数据添加到列表
        console.log(data)
        const { results } = data.data
        this.list.push(...results)
        // 将文章评论数总量传递到外部
        this.$emit('onload-success', data.data)
        // 3将loading设置为false
        this.loading = false
        // 4判断是否还有数据 有:更新获取下一列的数据页码
        if (results.length) {
          this.offset = data.data.last_id
        } else {
          // 无: 将finished设置为true
          this.finished = true
        }
      } catch (err) {
        this.error = true
        // 3将loading设置为false
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
