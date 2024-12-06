<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <a class="navbar-brand" href="/">Resume Management</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/resumes">Резюме</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/jobs">Вакансии</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <button class="btn" @click="handleLogout">Выйти</button>
            </li>
            <li class="nav-item" style="display: flex; flex-direction: row;" v-else>
                <router-link class="nav-link" to="/login">Войти</router-link>
              <router-link class="nav-link" to="/register">Зарегистрироваться</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import { logout } from '@/utils/auth';
  
  export default {
    name: 'HeaderComponent',
    data() {
      return {
        isAuthenticated: false,
      };
    },
    methods: {
      handleLogout() {
        logout();
        this.checkAuth();
        this.$router.push('/');
      },
      checkAuth() {
        this.isAuthenticated = !!localStorage.getItem('token');
      },
    },
    mounted() {
      this.checkAuth();
    },
    watch: {
      $route() {
        this.checkAuth();
      },
    },
  };
  </script>
  
  <style scoped>
  
  </style>
  