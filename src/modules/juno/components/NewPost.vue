<template>
  <div class="container mt-3 mb-5" v-motion-pop>
    <div class="row d-flex align-items-center justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <input
            type="file"
            @change="onSelectedFile"
            ref="fileSelector"
            v-show="false"
            accept="image/*, video/*"
          />

          <div class="d-flex justify-content-between p-1 px-3">
            <textarea
              v-model="post.content"
              spellcheck="true"
              type="text"
              class="textarea"
              placeholder="What's on your mind?"
              @input="onResize()"
              ref="textAreaReizable"
            />
          </div>
        </div>

        <div class="p-2">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex flex-row icons d-flex align-items-center">
              <button class="btn btn-success" @click="onSelectFile()">
                <i class="fa fa-upload"></i>
              </button>
            </div>

            <div v-if="connected" class="d-flex flex-row muted-color">
              <input
                v-model="post.hashtag"
                type="text"
                placeholder="# hashtag"
                class="form-control hashtag"
              />

              <button class="btn btn-success" @click="onSendPost()">
                Post
              </button>
            </div>
            <WalletMultiButton v-else />
          </div>
        </div>
        <div class="card" v-if="typeFile != FILE_TYPE.NONE">
          <img
            v-if="typeFile == FILE_TYPE.IMAGE && localFile"
            :src="localFile"
            alt="entry-picture"
            class="img-fluid"
          />

          <video
            v-if="typeFile == FILE_TYPE.VIDEO && localFile"
            :src="localFile"
            alt="entry-picture"
            class="img-fluid"
            controls
          />
        </div>

        <hr />
      </div>
    </div>
  </div>
</template>

<script>
import { WalletMultiButton, useWallet } from "solana-wallets-vue";

import { useFunctions, useSenPost } from "@/modules/juno/composables";

import { FILE_TYPE } from "@/helpers/glob";

export default {
  components: { WalletMultiButton },
  setup() {
    const { connected } = useWallet();

    const { textAreaReizable, onResize } = useFunctions();
    const {
      post,
      localFile,
      fileSelector,
      typeFile,
      onSendPost,
      onSelectFile,
      onSelectedFile,
    } = useSenPost(textAreaReizable);

    return {
      connected,

      textAreaReizable,
      onResize,

      post,
      fileSelector,
      typeFile,
      localFile,
      onSendPost,
      onSelectFile,
      onSelectedFile,

      FILE_TYPE,
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