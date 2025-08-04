<template>
  <CardPost v-if="post" :post="post" />

  <div v-else class="container mt-5 mb-5">
    <div class="row d-flex align-items-center justify-content-center">
      <div class="spinner-grow text-success m-2" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-grow text-success m-2" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="spinner-grow text-success m-2" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import CardPost from "@/modules/juno/components/CardPost.vue";

import { ref } from "vue";
import { useRoute } from "vue-router";

import { useWorkspace } from "@/modules/juno/composables";
import { Post } from "@/modules/juno/models";
import { PublicKey } from "@solana/web3.js";

export default {
  components: { CardPost },

  setup() {
    const post = ref(null);

    const route = useRoute();
    const { program } = useWorkspace();

    const loadPost = async () => {
      const key = route.params.key;
      const publicKey = new PublicKey(key);
      const postAccount = await program.value.account.post.fetch(publicKey);
      post.value = new Post(publicKey, postAccount);
    };

    loadPost();

    return { post };
  },
};
</script>