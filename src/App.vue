<template>
  <div id="app" class="mt-3">
    <template v-if="isLoggedIn">
      <div v-if="user == 'ADMIN'">
        <SidebarAdmin/>
      </div>
      <div v-if="user == 'SA'">
        <SidebarSA/>
      </div>
      <div v-if="user == 'DEV'">
        <SidebarDev/>
      </div>
    </template>
    <main class="container-fluid">
      <router-view @loggedIn="setUser" ></router-view>
    </main>
  </div>

</template>

<script>
import SidebarAdmin from "./views/components/Sidebar.vue"
import SidebarSA from "./views/components/SidebarSA.vue"
import SidebarDev from "./views/components/SidebarDev.vue"

export default {
  components: { 
    SidebarAdmin,
    SidebarSA,
    SidebarDev
  },
  data() {
    return {
      user: null,
      isLoggedIn: false,
    }
  },
  mounted() {
    this.setUser()
  },
  methods: {
    setUser() {
      this.isLoggedIn = window.localStorage.getItem('token') != null
      this.user = window.localStorage.getItem('loginType')
    },
    loginTypes() {

    }

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#bolds {
  font-weight: bold;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>