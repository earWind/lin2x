<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main class="red">Main</el-main>
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

<style lang="css">
.red {
  color: red;
}
</style>
