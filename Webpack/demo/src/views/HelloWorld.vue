<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main class="red">
        <el-button type="primary">主要按钮</el-button>
        <span class="_red" style="color: green">Main</span>

        <ul>
          <li v-for="item in list" :key="item.name">
            名字：{{ item.name }} - 颜色：{{ item.color }}
          </li>
        </ul>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { animals } from "../utils/common";

export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "测试",
      list: [],
    };
  },
  created() {
    this.list = animals();
  },
};
</script>
<style>
._red {
  font-size: 100px;
}
</style>