<template>
  <div class="hello"></div>
</template>

<script>
import Store from "@ak2021/store";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {};
  },
  mounted() {
    console.log("init ", store);
    const store = new Store();
    store.on("test", (data) => {
      console.warn("test", data);
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
}
a {
  color: #42b983;
}
</style>
