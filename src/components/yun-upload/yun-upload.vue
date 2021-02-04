<template>
  <u-upload
    :before-upload="onBeforeUpload"
    :form-data="formdata"
    :action="filepath"
    :file-list="filelist"
    :custom-btn="true"
    @on-success="onUploadSuccess"
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
import { UPLOAD_FILE_PATH } from "@/api/api";
import { getToken } from "@/store/storage";
export default {
  data() {
    return {
      token: "",
      filepath: UPLOAD_FILE_PATH,
      filelist: [],
    };
  },
  methods: {
    onBeforeUpload() {},
    onUploadSuccess() {
      uni.$emit("refreshFileList", {});
    },
  },
  computed: {
    formdata: function () {
      return this.$parent._data.params;
    },
  },
  mounted() {
    // this.$nextTick((res) => {});
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