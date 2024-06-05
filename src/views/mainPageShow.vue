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
        class="pb-2"
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
      <v-card
        v-if="profile"
        class="mt-5 pb-10"
        style="margin: auto; width: 95%; background-color: white"
        @click="Profile"
      >
        <!-- 프로필 및 이름 학교 이름 부분 -->
        <v-row
          style="margin-left: 32%"
          class="mt-10"
        >
          <v-avatar
            size="150"
            class="mt-3 avatarbackground"
          >
            <v-img
              :src="
                'http://localhost:8081/uploads/' +
                profile.locallocation
                  .replace(/^C:\\upload\\/, '')
                  .replace(/\\/g, '/')
              "
            ></v-img>
          </v-avatar>
          <div
            class="mt-5"
            style="margin-left: 100px"
          >
            <v-col>
              <div class="text_username">{{ profile.username }}</div>
              <div>{{ profile.schoolname }}</div>
              <div class="mt-5">{{ profile.content }}</div>
            </v-col>
          </div>
        </v-row>

        <v-row
          style="margin-left: 32%"
          class="mt-10 text_tech"
        >
          <div
            class="ml-5"
            v-for="(tech, index) in profile.technologies"
            :key="index"
            @click="clickTech(tech)"
          >
            # {{ tech.content }}
          </div>
        </v-row>
      </v-card>
      <!-- 프로필 및 이름 학교 이름 부분 -->

      <!-- 즐겨 찾기 카드들 -->
      <v-card
        class="mt-5 mb-5"
        style="margin: auto; width: 95%; background-color: white"
      >
        <v-row class="ml-2 mr-2 mb-2">
          <v-col
            v-for="board in boardlist"
            :key="board.numberid"
            @click="clickBoard(board)"
            cols="12"
            md="4"
          >
            <v-card
              class="mt-4 bodycard"
              variant="outlined"
            >
              <v-img
                :src="
                  'http://localhost:8081/uploads/' +
                  board.locallocation
                    .replace(/^C:\\upload\\/, '')
                    .replace(/\\/g, '/')
                "
                width="300px"
                height="300px"
                class="mt-2 card-image"
                cover
              ></v-img>
              <!-- 아이콘들 -->
              <v-row class="mt-5">
                <v-icon class="ml-5">mdi-crown-outline</v-icon>
                <v-icon class="ml-5">mdi-heart-outline</v-icon>
              </v-row>
              <!-- 아이콘 숫자 -->
              <v-row class="mt-5 ml-3">
                <div class="icon-text">+{{ board.favorites }}</div>
                <div class="ml-8 icon-text">+{{ board.satisfaction }}</div>
              </v-row>
              <!-- 제목 -->
              <div class="mt-5 ml-3 titletext">{{ board.title }}</div>
              <div class="mt-2 ml-3 pb-2">{{ board.content }}</div>
            </v-card>
          </v-col>
          <!-- 즐겨 찾기한 카드 -->
        </v-row>
      </v-card>
      <v-footer class="white rounded-top-corners">
        <v-col>
          <v-row>
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
          </v-row>
          <v-row class="justify-center mt-5 pb-3">
            <div class="mx-10 footerText">MJC</div>
            <div class="mx-10 footerText">TaeHo</div>
            <div class="mx-10 footerText">rhrhrh913@naver.com</div>
            <div class="mx-10 footerText">MJC</div>
          </v-row>
        </v-col>
      </v-footer>
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
      boardlist: [], // Added boardlist to data
      profileMainPage: null,
    };
  },

  mounted() {
    this.checkToken();
    this.getBoardList();
    this.getProfile();
    this.getBoardProfileList();
  },

  methods: {
    clickProfileCard(profileBoard) {
      this.$router.push('/profile/' + profileBoard.username);
    },
    getShowMainPage(profileBoard) {
      this.$router.push('/mainPage/show/' + profileBoard.username);
    },

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

    getProfile() {
      this.$axios
        .get('/profile/' + this.$route.params.id)
        .then((response) => {
          this.profile = response.data;
          console.log(this.profile);
          if (this.profile == null) {
            this.$router.push('/profile/create');
          }
        })
        .catch((error) => {
          console.error('Error fetching profile data:', error);
          this.$router.push('/profile/create'); // Redirect if there's an error fetching profile
        });
    },

    getBoardProfileList() {
      this.$axios.get('/profile/mainPage/userboard').then((response) => {
        this.profileMainPage = response.data;
        console.log(this.profileMainPage);
      });
    },

    getBoardList() {
      this.$axios
        .get('/board/mainPage/enjoy/' + this.$route.params.id)
        .then((response) => {
          this.boardlist = response.data;
          console.log(this.boardlist); // Add this line to debug the response
        })
        .catch((error) => {
          console.error('Error fetching board list:', error);
        });
    },

    logout() {
      localStorage.removeItem('jwt');
      this.isLoggedIn = false;
      this.$router.push('/login');
    },

    clickBoard(board) {
      console.log(board.numberid);
      this.$router.push('/board/' + board.numberid);
    },

    home() {
      this.$router.push('/mainPage');
    },

    homeProfile() {
      this.$router.push('/profile/' + this.userName);
    },

    Profile() {
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
.bodycard {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.mainPageCardText {
  font-family: bold;
}
.rounded-top-corners {
  border-top-left-radius: 20px; /* Adjust the radius value as needed */
  border-top-right-radius: 20px; /* Adjust the radius value as needed */
}
.footerText {
  font-size: 20px;
  font-weight: 400;
}
</style>
