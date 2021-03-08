<template>
  <div class="update-photo">
    <img :src="img" alt="" ref="img" />
    <div class="toobar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'
export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data() {
    return {
      cropper: null
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, // 只能在裁剪的图片范围内移动
      dragMode: 'move', // 画布和图片都可以移动
      aspectRatio: 1, // 裁剪区默认正方形
      autoCropArea: 1, // 自动调整裁剪图片
      cropBoxMovable: false, // 禁止裁剪区移动
      cropBoxResizable: false, // 禁止裁剪区缩放
      background: false // 关闭默认背景
    })
  },
  methods: {
    onConfirm() {
      // console.log(this.cropper.getData())
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updateUserPhoto(blob)
      })
    },
    async updateUserPhoto(blob) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        // 创建formData数据
        const formData = new FormData()
        formData.append('photo', blob)
        const { data } = await updateUserPhoto(formData)
        // 更新视图
        this.$emit('updata-photo', data.photo)
        // 关闭弹出层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功!')
      } catch (err) {
        this.$toast.fail('更新失败!')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.update-photo {
  background-color: #000;
  height: 100%;
  .toobar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      color: #fff;
      justify-content: center;
      align-items: center;
    }
  }
}
img {
  max-width: 100%;
  display: block;
}
</style>
