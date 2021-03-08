<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->
    <input type="file" hidden ref="file" @change="onFileChange" />

    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      @click="isUpdateNameShow = true"
      :value="user.name"
      is-link
    />
    <van-cell
      title="性别"
      :value="user.gender ? '女' : '男'"
      is-link
      @click="isUpdateGnederShow = true"
    />
    <van-cell
      title="生日"
      @click="isUpdateBirthdayShow = true"
      :value="user.birthday"
      is-link
    />
    <!-- 个人信息 -->
    <!-- 编辑昵称弹层 -->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%"
      position="bottom"
    >
      <update-name
        @close="isUpdateNameShow = false"
        v-if="isUpdateNameShow"
        v-model="user.name"
      />
    </van-popup>
    <!-- 编辑昵称弹层 -->
    <!-- 编辑性别 -->
    <van-popup v-model="isUpdateGnederShow" position="bottom">
      <update-gender
        @close="isUpdateGnederShow = false"
        v-if="isUpdateGnederShow"
        v-model="user.gender"
      />
    </van-popup>
    <!-- 编辑性别 -->
    <!-- 编辑生日 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <update-birthday
        v-model="user.birthday"
        @close="isUpdateBirthdayShow = false"
        v-if="isUpdateBirthdayShow"
      />
    </van-popup>
    <!-- 编辑生日 -->
    <!-- 编辑头像 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      position="bottom"
      style="height:100%"
    >
      <update-photo
        v-if="isUpdatePhotoShow"
        :img="img"
        @close="isUpdatePhotoShow = false"
        @updata-photo="user.photo = $event"
      />
    </van-popup>
    <!-- 编辑头像 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user.js'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  props: {},
  data() {
    return {
      user: {},
      isUpdateNameShow: false,
      isUpdateGnederShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadProfile()
  },
  mounted() {},
  methods: {
    async loadProfile() {
      try {
        const res = await getUserProfile()
        this.user = res.data.data
      } catch (err) {
        this.$toast('获取数据失败')
      }
    },
    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文件对象获取blob数据
      this.img = window.URL.createObjectURL(file)
      this.isUpdatePhotoShow = true
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
}
.van-popup {
  background: #f5f7f9;
}
</style>
