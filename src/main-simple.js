import { createApp } from 'vue'

const app = createApp({
  template: `
    <div>
      <nav class="navbar navbar-expand-lg bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Juno</a>
          <button class="btn btn-primary" data-testid="wallet-button">Connect Wallet</button>
        </div>
      </nav>
      <h1>Test App</h1>
    </div>
  `
})

app.mount('#app')