<template>
  <div class="hello">
    <ul>
      <li @click="goto('/app-vue')">vue</li>
      <li @click="goto('/app-react')">react</li>
    </ul>

    <hr />
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  methods: {
    goto(url) {
      history.pushState(null, url, url);
    },
  },
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
  cursor: pointer;
}
a {
  color: #42b983;
}
</style>
