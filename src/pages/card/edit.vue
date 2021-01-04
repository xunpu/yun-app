<template>
  <view class="warp">
    <u-form :model="form" ref="card">
      <u-form-item label="标题"><u-input v-model="form.title" /></u-form-item>
      <u-form-item label="简介"><u-input v-model="form.desc" /></u-form-item>
      <u-form-item label="内容"><u-input v-model="form.text" /></u-form-item>
      <u-form-item label="链接"
        ><u-input v-model="form.hyperlink"
      /></u-form-item>
      <u-form-item label="图片">
        <image class="pre-image" :src="myUrl" mode="aspectFill"></image>
        <u-upload
          ref="upload"
          :before-upload="beforeUpload"
          :show-upload-list="false"
          :action="action"
          :file-list="fileList"
          max-count="1"
        ></u-upload
      ></u-form-item>
    </u-form>
  </view>
</template>

<script>
export default {
  data() {
    return {
      preImage: "http://pics.sc.chinaz.com/files/pic/pic9/201912/hpic1886.jpg",
      action: "",
      fileList: [],
      form: {},
    };
  },
  methods: {
      beforeUpload(a,b,c) {
          console.log(a,b,c)
      }
  },
  computed: {
    myUrl() {
      return "http://pics.sc.chinaz.com/files/pic/pic9/201912/hpic1886.jpg";
    },
  },
  onReady() {
    this.lists = this.$refs.upload.lists;
  },
};
</script>

<style lang="scss" scoped>
.warp {
  padding: 20rpx 40rpx;
}
.pre-image {
  width: 196rpx;
  height: 196rpx;
  border-radius: 10rpx;
}
</style>