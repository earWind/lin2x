<script setup lang="ts">
import { ref } from "vue";
const a = ref("World");
const b = 2;

// 向外暴露出去的属性
defineExpose({
  a,
});
</script>

<template>
  <h1>{{ a }}</h1>
</template>

<style></style>
