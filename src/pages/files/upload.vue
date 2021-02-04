<template>
  <yun-upload></yun-upload>
</template>
  
<script>
export default {
  data() {
    return {
      params: {},
    };
  },
  onShow() {},
  onHide() {},
  onReady() {
    let that = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptUploadData", function (data) {
      that.params = data;
    });
  },
  onLoad() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
</style>


