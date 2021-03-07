<template>
  <div class="update-photo">
    <img :src="img" alt="" />
    <div class="toobar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm">完成</div>
    </div>
  </div>
</template>

<script>
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
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
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
    .cancel, .confirm{
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
  width: 100%;
}
</style>
