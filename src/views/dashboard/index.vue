<template>
  <div class="dashboard-box">
    <!--头部-->
    <base-info ref="baseInfo" />
  </div>
</template>

<script>
// import baseInfo from "./components/baseInfo";
import baseInfo from "./components/base";

export default {
  name: "index",
  components: {
    baseInfo
  },
  data() {
    return {
    
    };
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="less">
.dashboard-box{
  // padding:32px;
}

</style>
