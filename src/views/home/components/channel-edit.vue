<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell title="我的频道" :border="false" class="title-text">
      <!-- 编辑按钮 -->
      <van-button
        class="edit-btn"
        size="mini"
        round
        type="danger"
        plain
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <!-- grid宫格 -->
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        class="channel-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <!-- 小图标 -->
        <van-icon
          slot="icon"
          name="clear"
          v-show="isEdit && !fiexdChannels.includes(channel.id)"
        ></van-icon>
        <span class="text" :class="{ active: index === active }" slot="text">
          {{ channel.name }}
        </span>
      </van-grid-item>
    </van-grid>
    <!-- 我的频道 -->
    <!-- 频道推荐 -->
    <van-cell title="频道推荐" :border="false" class="title-text"></van-cell>
    <!-- grid宫格 -->
    <van-grid :gutter="10" class="recommend-grid" direction="horizontal">
      <van-grid-item
        class="channel-item"
        v-for="(channel, index) in recommendChannels"
        icon="plus"
        :key="index"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
    <!-- 频道推荐 -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allChannels: [],
      isEdit: false,
      fiexdChannels: [0]
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannels() {
      // 数组的filter方法:遍历数组,吧符合条件的元素储存到新的数组中并返回
      return this.allChannels.filter(channel => {
        // 数组的find方法:遍历数组,把符合条件的第一个元素返回
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
    }
    // recommendChannels() {
    //   const channels = []
    //   this.allChannels.forEach(channel => {
    // find 遍历数组,找到满足条件的元素项
    //     const ret = this.myChannels.find(myChannels => {
    //       return myChannels.id === channel.id
    //     })
    //    //如果我的频道中不包含该频道项,则收集到推荐频道中
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })
    //    把计算的结果返回
    //   return channels
    // }
  },
  watch: {},
  created() {
    this.loadAllChannels()
  },
  mounted() {},
  methods: {
    // 获取频道列表
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        console.log(data)
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('频道列表获取失败!')
      }
    },
    // 添加到我的频道
    async onAddChannel(channel) {
      this.myChannels.push(channel)
      // 数据持久化处理
      if (this.user) {
        try {
          // 已登录,将数据请求接口放到线上
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length
          })
          console.log(1)
        } catch (err) {
          this.$toast('保存失败,请稍后重试!')
        }
      } else {
        // 未登录,将数据储存到本地
        setItem('TOUYIAO_CHANNELS', this.myChannels)
      }
    },
    // 点击我的频道触发事件
    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        if (this.fiexdChannels.includes(channel.id)) {
          return
        }
        // 执行删除事件
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1)
        }
        this.myChannels.splice(index, 1)

        // 处理持久化
        this.deleteChannel(channel)
      } else {
        // 执行切换事件
        this.$emit('update-active', index, false)
      }
    },
    // 删除我的频道
    async deleteChannel(channel) {
      try {
        if (this.user) {
          deleteUserChannel(channel.id)
          // 已登录,将数据更新到线上
        } else {
          // 未登录,将数据更新到本地
          setItem('TOUYIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败,请稍后重试!')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .channel-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      border-radius: 6px;
      .van-grid-item__text,
      .text {
        color: #222;
        font-size: 28px;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/ .my-grid {
    .channel-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .channel-item {
      .van-grid-item__content {
        .van-icon-plus {
          font-size: 28px;
          color: #222;
        }
      }
    }
  }
}
</style>
