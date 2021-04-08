<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>
        Main
        <span class="red">color123</span>
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

<style lang="less" scoped>
.red {
  color: red;
  font-size: 20px;
}
</style>
