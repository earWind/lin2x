<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>
        <el-button type="primary">主要按钮</el-button>
        <span class="green">Main</span>

        <img :src="gougou1" class="img" />
        <div class="img img2" />

        <ul class="list">
          <li v-for="item in list" :key="item.name">
            名字：<span class="red">{{ item.name }}</span> - 颜色：{{
              item.color
            }}
          </li>
        </ul>

        <News />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { animals } from "@/utils/common";
import { toNumber } from "@/utils/number";
import gougou1 from "@/img/gougou1.jpeg";
import News from "./components/News";

export default {
  name: "HelloWorld",
  components: {
    News,
  },
  data() {
    this.gougou1 = gougou1;
    return {
      msg: "测试",
      list: [],
    };
  },
  created() {
    this.list = animals();
    console.log(toNumber("123"));
  },
};
</script>

<style lang="less" scoped>
@import "@/styles/base.css";
.list {
  .red {
    font-size: 30px;
  }
}
.img {
  width: 150px;
  height: 100px;
}

.img2 {
  display: inline-block;
  background-image: url("../img/gougou2.jpeg");
  background-size: contain;
}
</style>
