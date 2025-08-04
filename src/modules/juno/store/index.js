import { defineStore } from 'pinia'
import { useWorkspace } from '@/modules/juno/composables'
import { Post } from '@/modules/juno/models'
import { web3 } from '@coral-xyz/anchor'
import uploadFile from '@/helpers/uploadFile'
import { memcmphHashtag, memcmpAuthor, memcmphDay } from "@/helpers/filterMemcm";

const walletCollector = 'G2nA5iYCfG2Diw3goaHi31PUUgCbadJVGrcH2XtksaUa';
const tipNewPost = 0.001 * web3.LAMPORTS_PER_SOL

export const useJunoStore = defineStore('juno', {
  state: () => ({
    posts: []
  }),

  actions: {
    async loadPost({ wallet, hashtag, vecDay } = {}) {
      let filters = []
      if (wallet)
        filters = [memcmpAuthor(wallet)];
      if (hashtag)
        filters = [memcmphHashtag(hashtag)];
      if (vecDay)
        filters = [memcmphDay(vecDay)];

      const { program, connection } = useWorkspace()

      const postClient = program.value.account.post
      const postAccountName = postClient._idlAccount.name

      const postDiscriminatorFilter = {
        memcmp: postClient.coder.accounts.memcmp(postAccountName)
      }

      const allPosts = await connection.getProgramAccounts(program.value.programId, {
        filters: [postDiscriminatorFilter, ...filters],
        dataSlice: { offset: 41, length: 6 },
      })

      const allPostsWithTimestamps = allPosts.map(({ account, pubkey }) => ({
        pubkey,
        date: Date.UTC(...account.data),
      }))

      const slicePublicKeys = []
      allPostsWithTimestamps
        .sort((a, b) => {
          if (Math.abs(a.date) < Math.abs(b.date)) {
            return -1;
          }
          return 1;
        })
        .map(({ pubkey }) => {
          slicePublicKeys.push(pubkey)
          return pubkey
        })

      const postsPublicKeys = await postClient.fetchMultiple(slicePublicKeys)

      const posts = postsPublicKeys.reduce((all, post, index) => {
        const publicKey = slicePublicKeys[index]
        all.push(new Post(publicKey, post))
        return all
      }, [])

      this.posts = posts
    },

    async sendPost(post) {
      const { hashtag = '#', content, data } = post

      let img = '';
      if (data) {
        let url = await uploadFile(data.base64);
        if (url == null) return;
        img = `${data.typeFile} ${url}`
      }

      let date = new Date();
      let year = date.getUTCFullYear() - 2000;
      let month = date.getUTCMonth();
      let day = date.getUTCDate();
      let hour = date.getUTCHours();
      let minutes = date.getUTCMinutes();
      let seconds = date.getUTCSeconds();

      let time_zone = date.getTimezoneOffset() / -60;

      const { wallet, program } = useWorkspace()
      const postWeb3 = web3.Keypair.generate()

      await program.value.rpc.sendPost(hashtag, content, img, `${tipNewPost}`, time_zone, year, month, day, hour, minutes, seconds, {
        accounts: {
          post: postWeb3.publicKey,
          author: wallet.value.publicKey,
          systemProgram: web3.SystemProgram.programId,
          walletCollector: walletCollector,
        },
        signers: [postWeb3]
      })
      const postAccount = await program.value.account.post.fetch(postWeb3.publicKey)
      const newPost = new Post(postWeb3.publicKey, postAccount)

      this.posts.unshift(newPost)
    }
  }
})