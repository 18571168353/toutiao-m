<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <van-tabs v-model="active" animated swipeable class="channel-tabs">
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
        ><article-list :channel="channel"
      /></van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isEditChannelShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道列表 -->
    <!-- 频道编辑 -->
    <van-popup
      class="edit-channel-popup"
      v-model="isEditChannelShow"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      close-icon-position="top-left"
    >
      <channel-edit
        :my-channels="channels"
        :active="active"
        @update-active="onUpdateActive"
      />
    </van-popup>
    <!-- /频道编辑 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data() {
    return {
      active: 0,
      channels: [],
      isEditChannelShow: true // 这里我们先设置为 true 就能看到弹窗的页面了
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created() {
    this.loadChannels()
  },
  mounted() {},
  methods: {
    // 获取频道列表数据
    async loadChannels() {
      try {
        // const { data } = await getUserChannels()
        // this.channels = data.data.channels
        // console.log(data)
        let channels = []
        if (this.user) {
          // 已登录
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录
          const localChannels = setItem('YOUYIAO_CHANNELS')
          if (localChannels) {
            channels = localChannels
          } else {
            // 如果没有
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (err) {
        this.$toast('获取频道列表数据失败!')
      }
    },
    onUpdateActive(index, isChannelEditShow = true) {
      this.active = index
      this.isEditChannelShow = isChannelEditShow
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 176px;
  padding-bottom: 98px;
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  .edit-channel-popup {
    padding-top: 100px;
    box-sizing: border-box;
  }
}
/deep/ .channel-tabs {
  .van-tabs__wrap {
    height: 82px;
    position: fixed;
    top: 92px;
    z-index: 1;
    right: 0;
    left: 0;
  }
  .van-tab {
    min-width: 200px;
    border-right: 1px solid #edeff3;
    font-size: 30px;
    color: #777;
  }
  .van-tab--active {
    color: #333;
  }
  .van-tabs__line {
    width: 31px !important;
    height: 6px;
    border-radius: 3px;
    background-color: #3296fa;
    bottom: 8px;
  }
  .van-tabs__nav {
    padding-bottom: 0;
  }
  .placeholder {
    width: 66px;
    height: 82px;
    flex-shrink: 0;
  }
  .hamburger-btn {
    position: fixed;
    right: 0;
    width: 66px;
    height: 82px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    opacity: 0.902;
    .toutiao {
      font-size: 33px;
      color: #333333;
    }
    &:before {
      content: '';
      width: 10px;
      height: 100%;
      position: absolute;
      left: 0;
      background-size: contain;
      width: 1px;
      background-image: url('~@/assets/gradient-gray-line.png');
    }
  }
}
</style>
