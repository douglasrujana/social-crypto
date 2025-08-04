<template>
  <div v-if="post" class="container mt-5 mb-5">
    <div class="row d-flex align-items-center justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <EditPost v-if="edit" :postEdit="post" @closeEditing="edit = false" />

          <div class="d-flex justify-content-between p-2 px-3">
            <div class="d-flex flex-row align-items-center">
              <div class="d-flex">
                <router-link
                  class="text-success"
                  v-if="post.author"
                  :to="`/juno/${post.author}`"
                >
                  {{ onCheckMyPost(post) ? "My Post" : post.author_display }}
                </router-link>
              </div>
            </div>

            <div class="d-flex">
              <div v-if="post.hashtag">
                {{ post.date_publication }}
              </div>
            </div>

            <div v-if="onCheckMyPost(post)" class="dropdown">
              <button
                class="btn"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-three-dots"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
                  />
                </svg>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li @click="edit = !edit" class="delete">
                  <div class="dropdown-item">
                    <i class="fa fa-edit text-muted p-2"></i>
                    Edit
                  </div>
                </li>

                <li @click="onDeletePost" class="delete">
                  <div class="dropdown-item">
                    <i class="fa fa-trash text-muted p-2"></i>
                    Delete
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <img
            class="img-fluid img"
            v-if="post.mind == FILE_TYPE.IMAGE"
            :src="post.url_dominio"
            :alt="post.hashtag"
            @dblclick="onLikePost"
          />

          <video
            class="img-fluid"
            v-if="post.mind == FILE_TYPE.VIDEO"
            :src="post.url_dominio"
            :alt="post.hashtag"
            controls
          />
          <!-- {{ post.time_zone }} -->
          <div class="d-flex justify-content-between p-2">
            <div></div>
            <div class="d-flex flex-row align-items-center">
              <div class="d-flex font">
                <router-link
                  class="text-success"
                  v-if="post.hashtag"
                  :to="`/juno/ht/${post.hashtag}`"
                >
                  #{{ post.hashtag }}
                </router-link>
              </div>
            </div>
          </div>

          <div v-if="!edit" class="p-2">
            <p
              id="content-link"
              class="text-justify"
              v-html="post.content_html"
            ></p>

            <hr v-if="onCheckMyPost(post)" />

            <div class="d-flex justify-content-between align-items-center">
              <router-link
                class="text-success"
                :to="`/juno/p/${post.publicKey.toBase58()}`"
              >
                <i class="fa fa-share text-success"></i>
                {{ post.key_display }}
              </router-link>

              <div v-if="!post.isLike(wallet) && !onCheckMyPost(post)">
                <input
                  v-model="tip"
                  type="range"
                  class="row form-control-range range-success"
                  id="formControlRange"
                  min="1"
                  max="100"
                  step="1"
                />
                <small id="emailHelp" class="row form-text text-muted"
                  >Tip: {{ onCalculateTip() }} SOL
                </small>
              </div>
              <div
                v-if="!post.isLike(wallet)"
                class="d-flex flex-row muted-color"
              >
                <button
                  class="btn btn-success"
                  @click="onLikePost(onCalculateTip())"
                >
                  {{ post.like }} <i class="fa fa-heart"></i>
                </button>
              </div>

              <div v-else class="px-3">
                {{ post.like }} <i class="fa fa-heart text-danger fa-lg"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditPost from "./EditPost.vue";
import { FILE_TYPE } from "@/helpers/glob";
import { ref } from "vue";

import { useWorkspace } from "@/modules/juno/composables";
import { useOptionsPost, useFunctions } from "@/modules/juno/composables";

import { Post } from "../models";

export default {
  components: { EditPost },
  props: {
    post: { required: true, type: Post },
  },
  setup(props) {
    const edit = ref(false);

    const { wallet } = useWorkspace();
    const { tip, tipRef, onCalculateTip, onCheckMyPost } = useFunctions();
    const { onLikePost, onDeletePost } = useOptionsPost(props.post);

    return {
      edit,
      FILE_TYPE,
      wallet,

      tip,
      tipRef,
      onCalculateTip,

      onLikePost,
      onDeletePost,
      onCheckMyPost,
    };
  },
};
</script>

<style scoped>
a:link,
a:visited,
a:active {
  text-decoration: none;
}
.font a:link,
a:visited,
a:active {
  text-decoration: none;
  font-weight: bold;
}

hr {
  height: 1px;
  background-color: #1d6042;
  border: none;
}

.delete {
  cursor: pointer;
}

img {
  min-height: 300px;
  width: auto;

  margin-left: auto;
  margin-right: auto;
}
</style>