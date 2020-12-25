<template>
  <view>
    <tui-list-view unlined="all">
      <tui-list-cell
        v-for="item in filelist"
        :key="item.id"
        unlined
        padding="0 0"
      >
        <yun-files-item @current="getPath" v-bind="item"></yun-files-item>
      </tui-list-cell>
    </tui-list-view>
  </view>
</template>

<script>
import { getFiles } from "@/api/api";
export default {
  data() {
    return {
      curPath: "",
      filelist: [],
    };
  },
  methods: {
    getPath(name, path) {
      this.$emit("change", name);
    },
  },
  mounted() {
    getFiles().then((res) => {
      console.log(res.data);
      this.path = res.data.path;
      this.filelist = res.data.filelist;
    });
  },
};
</script>

<style lang="scss" scoped>

</style>