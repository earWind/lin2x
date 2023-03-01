<template>
  <p>My name is {{ name }}</p>
</template>

<script setup lang="ts">
import { ref } from "vue";
const name = ref("about");
</script>

<style></style>
