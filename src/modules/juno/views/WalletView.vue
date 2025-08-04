<template>
  <form v-motion-pop @submit.prevent="onSearch()">
    <div class="container mt-5">
      <div class="row d-flex align-items-center justify-content-center">
        <div class="col-md-6 d-flex justify-content-between">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="currentColor"
            class="bi bi-wallet2 me-2"
            viewBox="0 0 16 16"
          >
            <path
              d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"
            />
          </svg>
          <input
            v-model="criterion"
            type="text"
            placeholder="Wallet"
            class="form-control me-2"
          />
          <button class="btn btn-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              fill="currentColor"
              class="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path
                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </form>

  <NewPost v-if="checkMyWallet()" v-motion-pop />

  <ListPost />
</template>

<script>
import NewPost from "../components/NewPost.vue";
import ListPost from "@/modules/juno/components/ListPost.vue";

import { ref, onUpdated } from "vue";
import { useJunoStore } from "@/store/juno";
import { useRoute } from "vue-router";

import { useWorkspace } from "@/modules/juno/composables";

export default {
  components: { ListPost, NewPost },
  setup() {
    const criterion = ref("");
    let wallet = "";

    const { isMyWallet } = useWorkspace();

    const route = useRoute();
    const store = useJunoStore();

    const loadPost = async () => {
      wallet = route.params.wallet;
      criterion.value = wallet;
      await store.loadPost({ wallet });
    };

    loadPost();

    onUpdated(() => {
      if (route.params.wallet != wallet) loadPost();
    });

    return {
      criterion,
      onSearch: async () => {
        await store.loadPost({ wallet: criterion.value });
      },
      checkMyWallet() {
        return isMyWallet(criterion.value);
      },
    };
  },
};
</script>