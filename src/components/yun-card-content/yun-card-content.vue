<template>
  <view>
    <tui-list-view unlined="all">
      <tui-list-cell
        v-for="item in cardlist"
        :key="item.id"
        unlined
        padding="0 0"
        backgroundColor="transparent"
      >
        <yun-card-item @current="getPath" v-bind="item"></yun-card-item>
      </tui-list-cell>
    </tui-list-view>
  </view>
</template>

<script>
import { getCards } from "@/api/api";
export default {
  data() {
    return {
      curPath: "",
      cardlist: [],
    };
  },
  methods: {
    getPath(name, path) {
      this.$emit("change", name);
    },
  },
  mounted() {
    getCards().then((res) => {
      console.log(res.data);
      this.path = res.data.path;
      this.cardlist = res.data.cardlist;
    });
  },
};
</script>

<style lang="scss" scoped>
uni-page-body {
  background-color: #EEE;
}
</style>