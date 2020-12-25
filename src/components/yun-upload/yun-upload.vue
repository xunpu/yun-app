<template>
  <u-upload
    :before-upload="onBeforeUpload"
    :form-data="upload_formdata"
    :action="upload_filepath"
    :file-list="filelist"
    @on-success="onUploadSuccess"
    :custom-btn="true"
    width="230"
    height="230"
    upload-text="选择图片"
  >
    <view
      slot="addBtn"
      class="slot-btn"
      hover-class="slot-btn__hover"
      hover-stay-time="150"
    >
      <u-icon name="plus" size="60" color="#c0c4cc"></u-icon>
    </view>
  </u-upload>
  </template>

<script>
export default {
  data() {
    return {
      upload_formdata: {},
      upload_filepath: "",
      filelist: [],
    };
  },
  methods: {
    onBeforeUpload() {},
    onUploadSuccess() {},
  },
};
</script>

<style lang="scss" scoped>
.slot-btn {
  width: 228rpx;
  height: 228rpx;
  margin-top: 15rpx;
  margin-left: 15rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(245, 243, 243);
  border-radius: 10rpx;
}
.u-upload/deep/ .u-list-item {
  margin-left: 15rpx;
  margin-right: 0;
}
</style>