<template>
  <CardPost v-for="post in posts" :key="post.key" :post="post" />
</template>

<script>
import CardPost from "@/modules/juno/components/CardPost.vue";

import { computed } from "vue";
import { useJunoStore } from "@/store/juno";

export default {
  components: { CardPost },

  setup() {
    const store = useJunoStore();

    return {
      posts: computed(() => store.posts),
    };
  },
};
</script>