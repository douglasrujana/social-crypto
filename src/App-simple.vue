<template>
  <div id="nav">
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Juno</router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/juno/guest">Profile</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/juno/ht/">Hashtag</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/courses">Courses</router-link>
            </li>
          </ul>
          
          <div class="d-flex">
            <button class="btn btn-primary" data-testid="wallet-button">Connect Wallet</button>
          </div>
        </div>
      </div>
    </nav>
  </div>

  <router-view />
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#nav {
  padding: 10px;
  padding-bottom: 0px;
  padding-left: 40px;
  padding-right: 40px;
  text-align: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

a:link,
a:visited,
a:active {
  text-decoration: none;
}
</style>