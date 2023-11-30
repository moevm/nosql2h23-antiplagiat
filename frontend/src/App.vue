<template>
  <div id="app">
    <Navbar class="navbar" />
    <Sidebar class="sidebar" />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Navbar from '@/components/pages/Navbar.vue'
import Sidebar from '@/components/pages/Sidebar.vue'

@Component({
  components: {
    Navbar, Sidebar
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import './scss/app.scss';

#app {
  height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #FFFFFF;
  display: grid;
  grid-template-areas:
    "navbar navbar navbar"
    "sidebar content content"
    "sidebar content content";
  grid-template-columns: 250px 1fr;
  grid-template-rows: 65px 1fr;
}
.navbar {
  grid-area: navbar;
}
.sidebar {
  grid-area: sidebar;
}
.content {
  grid-area: content;
  padding: 15px 30px;
}
</style>
