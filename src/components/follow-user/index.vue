<template>
  <van-button
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    v-if="!isFollowed"
    size="small"
    icon="plus"
    :loading="isFollowLoading"
    @click="follow"
    >关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    round
    :loading="isFollowLoading"
    size="small"
    @click="follow"
    >已关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'follow-user',
  data() {
    return {
      isFollowLoading: false
    }
  },
  model: {
    prop: 'isFollowed', // 默认是value
    event: 'update-is_followed' // 默认是input
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    user_id: {
      type: [Number, String, Object],
      required: true
    }
  },

  created() {},

  methods: {
    // 关注用户
    async follow() {
      this.isFollowLoading = true
      try {
        // 如果已关注，则取消关注
        const authorId = this.user_id
        if (this.isFollowed) {
          await deleteFollow(authorId)
        } else {
          // 否则添加关注
          await addFollow(authorId)
        }

        // 更新视图
        this.$emit('update-is_followed', !this.isFollowed)
        // this.$emit('input', !this.value)

        // this.$emit('update-follow', !this.value)
      } catch (err) {
        console.dir(err)
        if (err.response && err.response.status === 400) {
          return this.$toast.fail('不能关注自己')
        }
        this.$toast.fail('操作失败')
      }

      // 关闭按钮的 loading 状态
      this.isFollowLoading = false
    }
  }
}
</script>

<style scoped lang="less"></style>
