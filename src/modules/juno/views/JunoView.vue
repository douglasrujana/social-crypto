<template>
  <NewPost />
  <ListPost />
</template>

<script>
import NewPost from "../components/NewPost.vue";
import ListPost from "@/modules/juno/components/ListPost.vue";

import { onBeforeUpdate } from "vue";
import { useJunoStore } from "@/store/juno";

export default {
  components: { ListPost, NewPost },
  setup() {
    const store = useJunoStore();

    const loadPost = async () => {
      await store.loadPost({});
    };

    loadPost();

    onBeforeUpdate(() => {
      store.loadPost({});
    });
  },
};
</script>