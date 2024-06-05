<template>
  <div class="background">
    <v-card
      class="mt-10 mb-3"
      style="width: 70%; margin: auto; background-color: #edecec"
    >
      <!-- 로그인의 헤더 부분 -->
      <v-toolbar
        class="pb-2"
        style="height: 10%; background-color: white; align-items: start"
      >
        <header></header>
        <v-img
          @click="home()"
          class="mt-5"
          height="30px"
          width="30px"
          style="margin-right: 900px"
          src="@/image/introduction.png"
        ></v-img>
        <v-icon
          class="mt-5"
          @click="home()"
          >mdi-home</v-icon
        >
        <v-icon
          class="ml-10 mt-5"
          @click="homeProfile()"
          >mdi-layers</v-icon
        >
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

      <!-- 본문 -->
      <v-card
        class="mt-5 bodycard ml-7 mb-3"
        v-if="boardlist"
      >
        <v-toolbar
          style="background-color: white"
          class="justify-center"
        >
          <!-- 프로필 사진 -->
          <v-row class="justify-end mr-8 ml-10">
            <v-avatar
              v-if="profile"
              @click="homeProfile()"
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
            <!-- 프로필 이름과 학교 -->
            <v-col class="ml-2">
              <div class="avatarname">{{ boardlist.username }}</div>
              <div class="avatarshoolname">{{ boardlist.schoolname }}</div>
            </v-col>
            <v-icon
              class="mr-5 mt-5"
              @click="editBoard(boardlist.numberid)"
              >mdi-square-edit-outline</v-icon
            >
            <v-icon
              class="mr-5 mt-5"
              @click="deleteBoard(boardlist.numberid)"
              >mdi-trash-can-outline</v-icon
            >
            <v-icon
              v-if="boardlist.enjoy"
              class="mt-5"
              @click="toggleEnjoy(boardlist.numberid, false)"
              >mdi-bookmark</v-icon
            >
            <v-icon
              v-else
              class="mt-5"
              @click="toggleEnjoy(boardlist.numberid, true)"
              >mdi-bookmark-outline</v-icon
            >
          </v-row>
        </v-toolbar>
        <v-divider></v-divider>
        <v-col class="justify-center align-item-center">
          <!-- 슬라이드 -->
          <v-carousel
            :show-arrows="false"
            :cycle="true"
            height="400"
            class="custom-carousel"
          >
            <!-- 이미지 파일을 표현한다. -->
            <!-- 경로 변환:board.locallocation.replace(/^C:\\upload\\/, '')는 서버를 가정하여 초기 로컬 경로 부분(C:\upload\)을 제거합니다. 
            이 경로를 /upload/에 매핑합니다.
            백슬래시-> 슬래시로: .replace(/\\/g, '/')는 모든 백슬래시를 슬래시로 변환합니다. -->
            <v-carousel-item
              :src="
                'http://localhost:8081/uploads/' +
                boardlist.locallocation
                  .replace(/^C:\\upload\\/, '')
                  .replace(/\\/g, '/')
              "
              style="width: 70%; height: 70%"
            ></v-carousel-item>
          </v-carousel>
          <!-- 아이콘들 -->
          <v-row class="mt-5 ml-10">
            <v-icon class="ml-5">mdi-crown-outline</v-icon>
            <v-icon class="ml-5">mdi-heart-outline</v-icon>
          </v-row>
          <!-- 아이콘 숫자 -->
          <v-row class="mt-5 ml-15">
            <v-div class="icon-text"> +{{ boardlist.favorites }}</v-div>
            <v-div class="ml-8 icon-text">+{{ boardlist.satisfaction }}</v-div>
          </v-row>
          <!-- 제목 -->
          <div class="mt-10 ml-15 titletext">{{ boardlist.title }}</div>
          <div class="mt-2 ml-15">{{ boardlist.content }}</div>
          <!-- 해시태그 -->
          <v-row class="ml-15 mt-2 mb-3">
            <div
              class="hashtag mr-5"
              v-for="item in boardlist.technologies"
              :key="item.content"
              rows="auto"
            >
              # {{ item.content }}
            </div>
          </v-row>
        </v-col>
        <!-- 카드 추가 -->
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
      boardlist: null, // Use null instead of an empty string for objects
      profile: null, // Use null instead of an empty string for objects
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
        this.validateToken(token).then(() => {
          this.getProfile();
          this.getBoardList();
        });
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
            .map((c) => {
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
          this.userId = this.decodeToken(token);
        })
        .catch(() => {
          localStorage.removeItem('jwt');
          this.$router.push('/login');
        });
    },

    getProfile() {
      this.$axios
        .get('/profile/' + this.userId)
        .then((response) => {
          this.profile = response.data;
          console.log(this.profile);
        })
        .catch((error) => {
          console.error('Error fetching profile data:', error);
        });
    },

    getBoardList() {
      this.$axios
        .get('/board/' + this.$route.params.id)
        .then((response) => {
          this.boardlist = response.data;
          console.log(this.boardlist);
        })
        .catch((error) => {
          console.error('Error fetching board list:', error);
        });
    },

    editBoard(numberid) {
      this.$router.push('/board/modify/' + numberid);
    },

    deleteBoard(numberid) {
      this.$axios.delete('/delete/' + numberid).then(() => {
        alert('삭제되었습니다.');
        this.$router.push('/profile/' + this.userId);
      });
    },

    home() {
      this.$router.push('/mainPage');
    },

    homeProfile() {
      this.$router.push('/profile/' + this.userId);
    },

    toggleEnjoy(numberid, enjoy) {
      this.$axios
        .patch('/enjoy/' + numberid, { enjoy: enjoy })
        .then(() => {
          this.boardlist.enjoy = enjoy;
        })
        .catch((error) => {
          console.error('Failed to toggle enjoy:', error);
        });
    },

    logout() {
      localStorage.removeItem('jwt');
      this.isLoggedIn = false;
      this.$router.push('/login');
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
  height: 100%;
  width: 100%;
  margin: auto;
  align-content: center;
}
.avatarbackground {
  border: 3px solid transparent;
  border-radius: 50%;
  background-image: linear-gradient(#fff, #fff),
    linear-gradient(to bottom right, #c582fa 0%, #fa8982 49%, #fac611 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
}
.bodycard {
  width: 95%;
  height: 85%;
  background-color: white;
}
.avatarname {
  font-size: 15px;
  font-weight: bold;
}
.titletext {
  font-size: 20px;
  font-weight: bold;
}
.contenttext {
  font-size: 15px;
}
.hashtag {
  font-size: 15px;
  color: #38638c;
}
.avatarshoolname {
  font-size: 12px;
}
.custom-carousel ::v-deep .v-carousel__controls {
  bottom: -10px; /* Increase the negative value if needed */
  width: 100%;
  background-color: white;
}

/* 아무것도 안하고 있을 때 동그라미 색깔 */
.custom-carousel ::v-deep .v-carousel__controls__item {
  color: #83a4fa;
  color: black; /* Default dot color */
  width: 12px; /* Increase size of the dots */
  height: 12px; /* Increase size of the dots */
}

.custom-carousel-atice {
  color: #83a4fa; /* Active dot color */
}
.icon-text {
  font-size: 12px;
}
</style>
