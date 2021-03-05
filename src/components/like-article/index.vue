<template>
  <van-icon
    color="#e5645f"
    :name="value === 1 ? 'good-job' : 'good-job-o'"
    @click="onCollect"
    :loading="loading"
  />
</template>

<script>
import { deleteLike, addLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onCollect() {
      this.loading = true
      try {
        let status = -1
        if (this.value === 1) {
          // 已收藏取消收藏
          await deleteLike(this.articleId)
        } else {
          // 未收藏,添加收藏
          await addLike(this.articleId)
          status = 1
        }
        // 更新视图
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast.fail('操作失败,请重试!')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped></style>
