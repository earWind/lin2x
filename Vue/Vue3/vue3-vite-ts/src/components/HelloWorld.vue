<script setup lang="ts">
import {
  ref,
  onMounted,
  watch,
  computed,
  toRef,
  toRefs,
  reactive,
  inject,
} from "vue";
import World from "./World.vue";

defineProps<{ msg: string }>();
const emit = defineEmits(["change"]);

const count = ref<number>(0);
const buttonRef = ref(null);
const list = reactive([1, 2, 3]);
const userLocation = inject("location");
const worldRef = ref(null);
/* ====================================== */
// 生命周期
onMounted(() => {
  console.log("onMounted");
  buttonRef.value.style.color = "green";
  console.log(worldRef.value.a);
});
/* ====================================== */
// 监听 watch computed
watch(count, (newVal) => {
  console.log("watch count", newVal);
});

const computedCount = computed(() => {
  return count.value * 2;
});
/* ====================================== */
// ref 和 refs 区别
interface Book {
  price?: number;
  color?: string;
  name: string;
}
const book = reactive<Book>({
  color: "#FFF",
  price: 18.5,
  name: "real me",
});

book.price = 19;
// console.log(book.price);

const refsBook = toRefs(book);
// refsBook.price.value = 20;
// console.log(refsBook.price.value);

const refPrice = toRef(book, "price");
// refPrice.value = 20;
// console.log(refPrice.value)

onMounted(() => {
  // refsBook.price.value = 20;
  // refPrice.value = 20;
});
/* ====================================== */
</script>

<template>
  <h1>props -- {{ msg }}</h1>
  <h1>computed -- {{ computedCount }}</h1>
  <h1>
    provide inject -- {{ userLocation }}
    <button @click="emit('change')">change location</button>
  </h1>
  <h1>{{ book.price }} {{ refsBook.price.value }} {{ refPrice }}</h1>
  <button type="button" @click="count++" ref="buttonRef">
    count is: {{ count }}
  </button>

  <World ref="worldRef" />

  <ol>
    <li v-for="(item, i) in list">
      {{ item }}
    </li>
  </ol>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
