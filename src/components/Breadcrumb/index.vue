<template>
  <div class="companyName">
    <ul>
      <li
        class="bgcLi"
        @click="companyChoice(index)"
        v-for="(item, index) in myArr"
        :key="index"
        :class="{ action: index == selectedindex }"
      >
        {{ item }}
      </li>
      <li class="bgcLi" @click="onLoadList">
        <i class="el-icon-refresh-right"></i>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "breadcrumb",
  data() {
    return {
      selectedindex: "",
      levelList: null,
      myArr: ["OA系统", "控制中心", "OI"],
      radio1: ""
    };
  },
  watch: {},
  created() {},
  methods: {
    companyChoice(params) {
      this.selectedindex = params;
    },
    // 刷新数据
    onLoadList() {
      window.location.replace(window.location.href);
    }
  }
};
</script>

<style lang="scss" scoped>
.companyName {
  position: relative;
  width: 75%;
  height: 100%;
}
.bgcUl {
  width: 100%;
  height: 100%;
}
.bgcLi {
  float: left;
  height: 50px;
  line-height: 50px;
  margin-right: 10px;
  padding: 0 10px;
  cursor: pointer;
}
.action {
  background-color: #e6e6e6;
}
ul .bgcLi:hover {
  background: #e6e6e6;
}
</style>
