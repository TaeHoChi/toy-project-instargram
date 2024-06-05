<template>
  <div
    class="background"
    style="height: 100%; width: 100%; align-content: center"
  >
    <v-card
      class="mt-5 mb-5"
      style="width: 70%; margin: auto; background-color: #edecec"
    >
      <!-- 로그인의 헤더 부분 -->
      <v-toolbar
        style="height: 10%; background-color: white; align-items: start"
      >
        <header></header>
        <v-img
          @click="home"
          class="mt-5"
          height="30px"
          width="30px"
          style="margin-right: 900px"
          src="@/image/introduction.png"
        ></v-img>
        <v-icon
          class="mt-5"
          @click="home"
          >mdi-home</v-icon
        >
        <v-icon
          class="ml-10 mt-5"
          @click="homeProfile"
          >mdi-layers</v-icon
        >
        <v-icon
          v-if="isLoggedIn"
          class="ml-10 mt-5 mr-10"
          @click="logout"
          >mdi-logout</v-icon
        >
        <v-icon
          v-else
          class="ml-10 mt-5 mr-10"
          @click="login"
          >mdi-login</v-icon
        >
      </v-toolbar>
      <!-- 로그인 본문 -->
      <!-- 본문 -->
      <v-card style="margin: auto; width: 95%; background-color: white">
      </v-card>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      userName: null,
      profile: null,
    };
  },

  mounted() {
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
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );
        const decodedData = JSON.parse(jsonPayload);
        return decodedData.sub; // JWT structure containing 'sub'
      } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
      }
    },

    validateToken(token) {
      return this.$axios
        .get('/validateToken', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log(this.decodeToken(token));
          this.isLoggedIn = true;
          this.userName = this.decodeToken(token);
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

    homeProfile() {
      this.$router.push('/profile/' + this.userName);
    },
  },
};
</script>

<style scoped>
.background {
  background-image: linear-gradient(
    to bottom right,
    #c582fa 0%,
    #fa8982 49%,
    #fac611 100%
  );
}
.card-image {
  width: 100%;
  max-height: 200px;
}
</style>
