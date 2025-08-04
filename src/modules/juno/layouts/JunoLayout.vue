<template>
  <router-view />
</template>

<script>
export default {
  name: 'JunoLayout'
};
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