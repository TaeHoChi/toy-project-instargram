<template>
  <div
    class="background"
    style="height: 100%; width: 100%; align-content: center"
  >
    <v-card
      style="height: 90%; width: 70%; margin: auto; background-color: #edecec"
    >
      <!-- 로그인의 헤더 부분 -->
      <v-toolbar
        style="height: 10%; background-color: white; align-items: start"
      >
        <header></header>
        <v-img
          @click="home()"
          class="mt-5"
          height="30px"
          width="30px"
          src="@/image/introduction.png"
        ></v-img>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-icon
          class="mt-5"
          @click="home()"
          >mdi-home</v-icon
        >
        <v-icon class="ml-10 mt-5">mdi-layers</v-icon>
        <v-icon
          v-if="isLoggedIn"
          class="ml-10 mt-5 mr-10"
          @click="logout()"
          >mdi-logout</v-icon
        >
        <v-icon
          v-else
          class="ml-10 mt-5 mr-10"
          @click="login()"
          >mdi-login</v-icon
        >
      </v-toolbar>
      <!-- 로그인 본문 -->
      <v-card
        class="mt-10"
        style="margin: auto; width: 95%; height: 80%; background-color: white"
      >
      </v-card>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      userId: null,
    };
  },

  created() {
    this.checkToken();
  },

  methods: {
    checkToken() {
      const token = localStorage.getItem('jwt');
      console.log(token);
      if (token) {
        this.isLoggedIn = true;
        this.validateToken(token);
      } else {
        this.$router.push('/login');
      }
    },

    decodeToken(token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedData = JSON.parse(window.atob(base64));
      return decodedData.sub; // JWT 구조에 'sub'가 포함되어 있는지 확인
    },

    validateToken(token) {
      this.$axios
        .get('/validateToken', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log(this.decodeToken(token));
          this.isLoggedIn = true;
          this.userId = this.decodeToken(token);
        })
        .catch(() => {
          localStorage.removeItem('jwt');
          this.$router.push('/login');
        });
    },

    logout() {
      localStorage.removeItem('jwt');
      this.isLoggedIn = false;
      this.$router.push('/login');
    },

    home() {
      this.$router.push('/mainPage');
    },
  },
};
</script>
<style>
.background {
  background-image: linear-gradient(
    to bottom right,
    #c582fa 0%,
    #fa8982 49%,
    #fac611 100%
  );
}
</style>
