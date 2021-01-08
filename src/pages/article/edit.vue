<template>
  <view class="warp">
    <u-form :model="form" ref="card">
      <u-form-item label="标题"><u-input v-model="form.title" /></u-form-item>
      <u-form-item label="简介"><u-input v-model="form.desc" /></u-form-item>
      <u-form-item label="内容"
        ><u-input v-model="form.text" type="textarea"
      /></u-form-item>
      <u-form-item label="链接"><u-input v-model="form.link" /></u-form-item>
      <u-form-item class="image-wrap" label="图片">
        <image
          v-if="form.image"
          class="pre-image"
          mode="aspectFill"
          :src="form.image"
        ></image>
        <u-button class="image-btn" @click="chooseImage" :hair-line="false"
          >更改</u-button
        >
      </u-form-item>
      <u-form-item>
        <rich-text :nodes="richText"></rich-text>
      </u-form-item>
    </u-form>
    <u-button class="submit" @click="submit" type="primary">提交</u-button>
  </view>
</template>

<script>
import { getCards } from "@/api/api";
export default {
  data() {
    return {
      action: "",
      fileList: [],
      form: {},
      richText:
        '<div style="text-align:center;">asdf<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-uni-app-doc/d8590190-4f28-11eb-b680-7980c8a877b8.png"/></div>',
    };
  },
  methods: {
    choose() {
      this.form.image = "";
    },
    chooseImage() {
      uni.navigateTo({
        url: "/pages/files/image-view?id=",
      });
    },
    beforeUpload() {},
    submit() {},
  },
  onLoad(params) {
    let that = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptCardData", function (res) {
      let card = res["card"];
      that.form = card;
    });
    uni.$on("acceptImageData", (res) => {
      let img = res["image"];
      that.form.image = img.image;
    });
  },
};
</script>

<style lang="scss" scoped>
.warp {
  padding: 20rpx 40rpx;
}
.image-wrap {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.image-btn {
  margin-left: 20rpx;
  width: 140rpx;
  height: 140rpx;
  border-width: 0;
}
.pre-image {
  width: 317rpx;
  height: 140rpx;
  border-radius: 10rpx;
}
.submit {
  margin-top: 80rpx;
}
</style>