<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      @click-left="onClickLeft"
      title="黑马头条"
    >
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="isLoading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <follow-user
            class="follow-btn"
            :user_id="article.aut_id"
            v-model="article.is_followed"
          >
          </follow-user>
          <!-- <follow-user
            class="follow-btn"
            :is_followed="article.is_followed"
            :user_id="article.aut_id"
            @update-follow="article.is_followed = $event"
          >
          </follow-user> -->
          <!-- <van-button
            class="follow-btn"
            round
            size="small"
            @click="onFollow"
            v-if="article.is_followed"
            :loading="followLoading"
            >已关注</van-button
          >
          <van-button
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            :loading="followLoading"
            @click="onFollow"
            v-else
            >关注</van-button
          > -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>

        <!-- 文章评论列表 -->
        <comment-list
        :source="article.art_id"
        />
        <!-- 文章评论列表 -->

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small"
            >写评论</van-button
          >
          <van-icon name="comment-o" info="123" color="#777" />
          <!-- 收藏 -->
          <collect-article
            class="btn-item"
            v-model="article.is_collected"
            :article-id="article.art_id"
          />
          <!-- 收藏 -->

          <!-- 点赞 -->
          <like-article
            class="btn-item"
            v-model="article.attitude"
            :article-id="article.art_id"
          />
          <!-- 点赞 -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
// import { addFollow, deleteFollow } from '@/api/user'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comments-list'
export default {
  name: 'ArticleIndex',
  components: { FollowUser, CollectArticle, LikeArticle, CommentList },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      article: {},
      // 展示
      isLoading: true,
      errStatus: 0,
      followLoading: false
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle()
  },
  mounted() {},
  methods: {
    // 获取文章详情
    async loadArticle() {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        console.log(data)

        // 模拟失败
        // if (Math.random() > 0.5) {
        //   JSON.parse('hjdsbfsdhfj')
        // }

        this.article = data.data
        // 初始化图片点击预览
        setTimeout(() => {
          this.previewImage()
          // console.log(this.$refs['article-content'])
        }, 0)
      } catch (err) {
        console.log('数据获取失败!请稍后在试!', err)
        // 加载失败 404
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        this.$toast('获取失败')
      }
      // 加载完成
      this.isLoading = false
    },
    // 返回
    onClickLeft() {
      this.$router.back()
    },
    // 得到所有的image节点
    previewImage() {
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      // console.log(imgs)
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            // 预览图片地址数组
            images,
            // 起始位置从0开始
            startPosition: index
          })
        }
      })
    }
    // async onFollow() {
    //   this.followLoading = true
    //   try {
    //     // 已关注
    //     if (this.article.is_followed) {
    //       // 取消关注
    //       await deleteFollow(this.article.aut_id)
    //       this.article.is_followed = false
    //     } else {
    //       // 未关注
    //       // 添加关注
    //       await addFollow(this.article.aut_id)
    //       this.article.is_followed = true
    //     }
    //     // this.article.is_followed = !this.article.is_followed
    //   } catch (err) {
    //     let message = '操作失败,请重试!'
    //     if (err.response && err.response.status === 400) {
    //       message = '你不能自己关注你自己!'
    //     }
    //     this.$toast(message)
    //   }
    //   this.followLoading = false
    // }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    /deep/.van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
