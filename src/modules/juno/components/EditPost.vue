<template>
  <div class="container mt-3">
    <div class="col-md-12">
      <div class="card">
        <div class="d-flex justify-content-between p-1 px-3">
          <textarea
            v-model="post.content"
            spellcheck="true"
            type="text"
            class="textarea"
            @input="onResize()"
            ref="textAreaReizable"
          />
        </div>
      </div>
      <div class="p-2">
        <p id="content-link" class="text-justify"></p>

        <div class="d-flex justify-content-between align-items-center">
          <button class="btn btn-secondary" @click="$emit('closeEditing')">
            Cancel
          </button>
          <div class="d-flex flex-row muted-color">
            <input
              v-model="post.hashtag"
              type="text"
              class="form-control hashtag"
            />
            <button class="btn btn-success" @click="onEditPost">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

import { useFunctions, useEditPost } from "@/modules/juno/composables";

import { Post } from "../models";

export default {
  props: {
    postEdit: { required: true, type: Post },
  },
  emits: ["closeEditing"],
  setup(props, { emit }) {
    const post = ref({ ...props.postEdit });

    const { textAreaReizable, onResize } = useFunctions();
    const { onEditPost } = useEditPost(post, emit);

    onMounted(() => {
      onResize();
    });

    return {
      post,

      textAreaReizable,
      onResize,

      onEditPost,
    };
  },
};
</script>

<style scoped>
.hashtag {
  margin-right: 5px;
}

.textarea {
  border: none;
  overflow: auto;
  background-color: #ffffff;
  color: black;
  outline: none;
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  min-height: 60px;
}
</style>