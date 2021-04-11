<template>
  <div id="app">
    <router-view> </router-view>
    <home />
  </div>
</template>

<script>
import home from "@/views/Home";
export default {
  name: "App",
  components: {
    home,
  },
};
</script>

<style>
/* @import '@/styles/base.css'; */
</style>
