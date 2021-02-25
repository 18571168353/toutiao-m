<template>
  <div class="my-container">
    <!-- 已登录 -->
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image
            class="avatar"
            round
            fit="cover"
            :src="userInfo.photo"
          />
          <span class="name">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button size="mini" round>编辑资料</van-button>
        </div>
      </div>
      <div class="data-status">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>

    <!-- 未登录 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>

    <!-- 宫格导航 -->
    <van-grid :column-num="2" class="grid-nav" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- 宫格导航 -->
    <!-- 消息通知 -->
    <van-cell title="消息通知" is-link />
    <van-cell class="mb-9" title="小智同学" is-link />

    <!-- 退出登录 -->
    <van-cell
      v-if="user"
      class="louout-cell"
      @click="onLogout"
      title="退出登录"
      clickable
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'MyIndex',
  components: {},
  props: {},
  data() {
    return {
      userInfo: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created() {
    if (this.user) {
      this.loadUserInfo()
    }
  },
  mounted() {},
  methods: {
    // 退出
    onLogout() {
      this.$dialog
        .confirm({
          title: '确认退出吗?'
        })
        .then(() => {
          // 确认退出,做清除数据的操作
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          //  没有退出
        })
    },
    // 获取用户信息
    async loadUserInfo() {
      try {
        const { data } = await getUserInfo()
        console.log(data)
        this.userInfo = data.data
      } catch (err) {
        this.$toast('获取数据失败,请稍后重试!')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 401px;
    background-image: url(~@/assets/banner.png);
    background-size: cover;
  }
  .not-login {
    display: flex;
    // 左右居中
    justify-content: center;
    // 上下居中
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }

  .user-info {
    .base-info {
      height: 271px;
      // background-color: pink;
      padding: 116px 32px 0 32px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
          margin-right: 22px;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-status {
      // height: 130px;
      // background-color: #ccc;
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
          margin-bottom: 13px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }

  .grid-nav {
    .grid-item {
      height: 141px;
      margin-bottom: 9px;
      i.toutiao {
        font-size: 45px;
        margin-bottom: 16px;
        color: #eb5253;
      }
      i.toutiao-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
        color: #333;
      }
    }
  }
  .van-cell {
    font-size: 30px;
  }
  .mb-9 {
    margin-bottom: 9px;
  }
  .louout-cell {
    text-align: center;
    color: #d86262;
  }
}
</style>
