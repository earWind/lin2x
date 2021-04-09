<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main class="red">
        <el-button type="primary">主要按钮</el-button>
        <span class="red">Main</span>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "测试",
    };
  },
};
</script>

<style>
.red {
  color: red;
}
</style>
