<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from "./components/HelloWorld.vue";
import { provide, ref, onMounted } from "vue";
const location = ref("北极");
provide("location", location); //  South
onMounted(() => {});
const changeLocation = () => {
  const loc: string[] = ["南", "北", "东", "西"];
  const ran: number = Math.random() * 4;
  location.value = loc[parseInt(ran + "")] + "极";
};
</script>

<template>
  <HelloWorld msg="msg" @change="changeLocation" />
</template>

<style>
body {
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
