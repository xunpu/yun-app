<template>
  <view class="warp">
    <u-form :model="form" ref="cardForm">
      <u-form-item label="名称" prop="name"
        ><u-input v-model="form.name"
      /></u-form-item>
      <u-form-item label="标题" prop="title"
        ><u-input v-model="form.title"
      /></u-form-item>
      <u-form-item label="简介" prop="desc"
        ><u-input v-model="form.desc" type="textarea"
      /></u-form-item>
      <u-form-item label="链接" prop="link"
        ><u-input v-model="form.link"
      /></u-form-item>
      <u-form-item class="image-wrap" prop="img" label="图片">
        <image
          v-if="imgUrl"
          class="pre-image"
          mode="aspectFit"
          :src="imgUrl"
        ></image>
        <u-button class="image-btn" @click="chooseImage" :hair-line="false"
          >更改</u-button
        >
      </u-form-item>
    </u-form>
    <u-button class="submit" @click="submit" type="primary">提交</u-button>
  </view>
</template>

<script>
import { createCard, modifyCard } from "@/api/api";
import { getToken } from "@/store/storage";
export default {
  data() {
    return {
      fileList: [],
      action: "",
      imgUrl: "",
      isModify: false,
      pid: "",
      rules: {
        name: {
          required: true,
          message: "请输入名称",
          trigger: "blur",
        },
        title: {
          required: true,
          message: "请输入标题",
          trigger: "blur",
        },
        desc: {
          required: true,
          message: "请输入简介",
          trigger: "blur",
        },
        link: {
          required: true,
          message: "请输入链接",
          trigger: "blur",
        },
        img: {
          required: true,
          message: "请选择一张图片",
          trigger: "blur",
        },
      },
      form: {
        title: "",
        name: "",
        desc: "",
        link: "",
        img: "",
      },
    };
  },
  methods: {
    choose() {
      // this.form.image = "";
    },
    chooseImage() {
      uni.navigateTo({
        url: "/pages/files/image-view",
      });
    },
    beforeUpload() {},
    submit() {
      this.$refs.cardForm
        .validate((vaild) => {
          if (vaild) {
            return Promise.resolve(true);
          } else {
            return Promise.resolve(false);
          }
        })
        .then((res) => {
          if (res == false) {
            return;
          }
          getToken().then((token) => {
            this.form.pid = this.pid;
            this.form.token = token;
            if (this.isModify) {
              modifyCard(this.form).then((res) => {
                if (res.code == 0) {
                  uni.navigateBack({
                    delta: 1,
                  });
                  uni.$emit("refreshFileList");
                } else {
                  uni.showToast({
                    title: res.msg,
                  });
                }
              });
            } else {
              createCard(this.form).then((res) => {
                if (res.code == 0) {
                  uni.navigateBack({
                    delta: 1,
                  });
                  uni.$emit("refreshFileList");
                } else {
                  uni.showToast({
                    title: res.msg,
                  });
                }
              });
            }
          });
        });
    },
  },
  onReady() {
    this.$refs.cardForm.setRules(this.rules);
  },
  onLoad(params) {
    let that = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptCardData", function (res, modify = false) {
      if (res["card"] == undefined) {
        that.form = {};
      } else {
        that.form = res["card"];
        that.imgUrl = res["card"]["img_url"];
      }
      that.pid = res["pid"];
      that.isModify = modify;
    });
    uni.$on("acceptImageData", (res) => {
      let img = res["img"];
      this.imgUrl = img.url;
      this.form.img = img.uuid;
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
  // margin-left: 20rpx;
  width: 140rpx;
  height: 140rpx;
  border-width: 0;
}
.pre-image {
  width: 200rpx;
  height: 150rpx;
  border-radius: 10rpx;
}
.submit {
  margin-top: 80rpx;
}
</style>