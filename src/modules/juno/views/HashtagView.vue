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
            class="bi bi-hash me-2"
            viewBox="0 0 16 16"
          >
            <path
              d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z"
            />
          </svg>
          <input
            v-model="criterion"
            type="text"
            placeholder="# hashtag"
            class="form-control hashtag me-2"
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

  <ListPost />
</template>

<script>
import ListPost from "@/modules/juno/components/ListPost.vue";

import { ref, onUpdated } from "vue";
import { useJunoStore } from "@/store/juno";
import { useRoute } from "vue-router";

export default {
  components: { ListPost },
  setup() {
    const criterion = ref("");
    let hashtag = "";
    
    const route = useRoute();
    const store = useJunoStore();

    const loadPost = async () => {
      hashtag = route.params.hashtag;
      criterion.value = hashtag;
      await store.loadPost({ hashtag });
    };

    loadPost();

    onUpdated(() => {
      if (route.params.hashtag != hashtag) loadPost();
    });

    return {
      criterion,
      onSearch: async () => {
        // 22 6 6 21
        // const vecDay = criterion.value.split(" ").map(function (item) {
        //   return parseInt(item);
        // });
        await store.loadPost({
          hashtag: criterion.value,
          // vecDay,
        });
      },
    };
  },
};
</script>