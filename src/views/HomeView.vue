<template>
  <div class="container mt-3">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="p-3">
            <textarea 
              v-model="postContent"
              class="form-control" 
              placeholder="What's on your mind?"
              rows="3"
            ></textarea>
          </div>
        </div>
        <div class="p-2">
          <div class="d-flex justify-content-between">
            <button class="btn btn-success">
              <i class="fa fa-upload"></i>
            </button>
            <div class="d-flex">
              <input 
                v-model="hashtag"
                type="text" 
                placeholder="# hashtag" 
                class="form-control me-2"
                style="width: 120px;"
              />
              <button class="btn btn-success" @click="sendPost" :disabled="loading">
                {{ loading ? 'Posting...' : 'Post' }}
              </button>
            </div>
          </div>
        </div>
        <hr>
        
        <!-- Posts -->
        <div class="card mt-3">
          <div class="d-flex justify-content-between p-2">
            <div class="d-flex align-items-center">
              <span class="text-success">BvFc..asnn</span>
            </div>
            <div>6/17/2022, 11:14:29 AM</div>
          </div>
          
          <img 
            src="https://via.placeholder.com/400x300/87CEEB/000000?text=Juno+Post" 
            class="img-fluid" 
            alt="Post image"
          />
          
          <div class="p-2">
            <div class="d-flex justify-content-between">
              <div></div>
              <div class="text-success">#blockchain</div>
            </div>
            
            <p class="mt-2">This is a sample post on Juno social network! 🚀</p>
            
            <div class="d-flex justify-content-between align-items-center">
              <a href="#" class="text-success">
                <i class="fa fa-share"></i> BvFc...
              </a>
              <button class="btn btn-success btn-sm">
                5 <i class="fa fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import { Connection, PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import idl from '@/modules/juno/idl/juno.json';

export default {
  name: 'HomeView',
  data() {
    return {
      connected: false,
      wallet: null,
      postContent: '',
      hashtag: '',
      loading: false,
      connection: null,
      program: null
    }
  },
  async mounted() {
    this.connection = new Connection('https://api.devnet.solana.com');
    
    try {
      const version = await this.connection.getVersion();
      console.log('✅ Solana connected:', version);
      alert('Solana devnet connected! Version: ' + version['solana-core']);
    } catch (error) {
      console.error('❌ Solana connection failed:', error);
      alert('Solana connection failed');
    }
  },
  methods: {
    
    async sendPost() {
      if (!this.connected || !this.program) {
        alert('Connect wallet first!');
        return;
      }
      
      if (!this.postContent.trim()) {
        alert('Write something!');
        return;
      }
      
      this.loading = true;
      
      try {
        const post = Keypair.generate();
        const walletCollector = new PublicKey('11111111111111111111111111111112');
        
        const now = new Date();
        
        const tx = await this.program.methods
          .sendPost(
            this.hashtag || 'general',
            this.postContent,
            '',
            '0',
            0,
            now.getFullYear() % 100,
            now.getMonth() + 1,
            now.getDate(),
            now.getHours(),
            now.getMinutes(),
            now.getSeconds()
          )
          .accounts({
            post: post.publicKey,
            author: this.wallet,
            walletCollector,
            systemProgram: SystemProgram.programId,
          })
          .signers([post])
          .rpc();
          
        console.log('🚀 Post sent to blockchain:', tx);
        alert('Post sent to Solana blockchain! 🚀\nTx: ' + tx.slice(0, 8) + '...');
        
        this.postContent = '';
        this.hashtag = '';
        
      } catch (error) {
        console.error('❌ Error sending post:', error);
        alert('Error: ' + error.message);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>