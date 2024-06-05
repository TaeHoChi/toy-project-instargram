<template>
  <div
    class="background"
    style="height: 100%; width: 100%; padding: 20px; align-content: center"
  >
    <v-card style="width: 70%; margin: auto; background-color: #edecec">
      <!-- 로그인의 헤더 부분 -->
      <v-toolbar
        class="pb-2"
        style="height: 10%; background-color: white; align-items: start"
      >
        <header></header>
        <v-img
          @click="home()"
          class="mt-5 ml-10"
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

      <!--  본문 -->
      <v-card
        v-if="profile"
        class="mt-5 pb-10"
        style="margin: auto; width: 95%; background-color: white"
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
          <v-col class="ml-5">
            <div
              style="font-size: 20px"
              class="mt-8"
            >
              게시물 개수
            </div>
            <div
              style="font-size: 25px; font-family: bold"
              class="mt-2 ml-10"
              v-if="boardlist"
            >
              {{ boardlist.length }}
            </div>
          </v-col>
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
      <!-- 본문 -->
      <!-- 목록 -->
      <v-card
        class="mt-2 mb-5"
        style="margin: auto; width: 95%; background-color: white"
      >
        <div class="pb-5">
          <v-tabs
            v-model="tab"
            color="deep-purple-accent-4"
            fixed-tabs
          >
            <v-tab
              prepend-icon="mdi-widgets"
              value="one"
            >
            </v-tab>
            <v-tab
              prepend-icon="mdi-format-list-bulleted-square"
              value="two"
            >
            </v-tab>
          </v-tabs>
          <!-- 목록 디자인 -->
          <v-tabs-window v-model="tab">
            <!-- 정사각형 표현 -->
            <v-tabs-window-item value="one">
              <!-- 게시물 수 -->
              <v-row>
                <v-col
                  v-for="board in boardlist"
                  :key="board.numberid"
                  @click="clickBoard(board)"
                  md="3"
                >
                  <v-card
                    class="mt-4 bodycard ml-2 pr-3"
                    variant="outlined"
                    width="300"
                  >
                    <v-col class="justify-center align-item-center">
                      <!-- 이미지 파일을 표현한다. -->
                      <v-img
                        :src="
                          'http://localhost:8081/uploads/' +
                          board.locallocation
                            .replace(/^C:\\upload\\/, '')
                            .replace(/\\/g, '/')
                        "
                        height="200px"
                        width="300px"
                        class="ml-2"
                        cover
                      ></v-img>
                      <!-- 아이콘들 -->
                      <v-row class="mt-5">
                        <v-icon class="ml-5">mdi-crown-outline</v-icon>
                        <v-icon class="ml-5">mdi-heart-outline</v-icon>
                      </v-row>
                      <!-- 아이콘 숫자 -->
                      <v-row class="mt-5 ml-3">
                        <v-div class="icon-text"> +{{ board.favorites }}</v-div>
                        <v-div class="ml-8 icon-text"
                          >+{{ board.satisfaction }}</v-div
                        >
                      </v-row>
                      <!-- 제목 -->
                      <div class="mt-5 ml-3 titletext">{{ board.title }}</div>
                      <!-- 해쉬 태그 -->
                      <v-row class="mt-1 flex-row ml-1">
                        <div
                          v-for="technologie in board.technologies"
                          :key="technologie.content"
                          class="ml-2 mt-2 pb-2 hashtag"
                          label
                        >
                          # {{ technologie.content }}
                        </div>
                      </v-row>
                    </v-col>
                  </v-card>
                </v-col>
              </v-row>
            </v-tabs-window-item>
            <!-- 직사각형 -->
            <v-tabs-window-item value="two">
              <!-- 게시물 수 -->
              <v-row
                v-for="board in boardlist"
                :key="board.numberid"
                @click="clickBoard(board)"
                class="justify-center mt-4"
              >
                <v-card
                  class="mt-4 rectangcard ml-15 pr-3 mb-5"
                  variant="outlined"
                >
                  <v-row class="mt-5 mb-5 ml-2">
                    <!-- 이미지 파일을 표현한다. -->
                    <v-img
                      :src="
                        'http://localhost:8081/uploads/' +
                        board.locallocation
                          .replace(/^C:\\upload\\/, '')
                          .replace(/\\/g, '/')
                      "
                      style="height: 300px"
                      cover
                    ></v-img>
                    <!-- 아이콘들 -->
                    <v-col>
                      <v-row class="mt-5">
                        <v-icon class="ml-5">mdi-crown-outline</v-icon>
                        <v-icon class="ml-5">mdi-heart-outline</v-icon>
                      </v-row>
                      <!-- 아이콘 숫자 -->
                      <v-row class="mt-5 ml-3">
                        <v-div class="icon-text"> +{{ board.favorites }}</v-div>
                        <v-div class="ml-8 icon-text"
                          >+{{ board.satisfaction }}</v-div
                        >
                      </v-row>
                      <!-- 제목 -->
                      <div class="mt-5 ml-3 titletext">{{ board.title }}</div>
                      <div class="mt-2 ml-3 pb-2">{{ board.content }}</div>
                      <!-- 해쉬 태그 -->
                      <v-row class="flex-row ml-1">
                        <div
                          v-for="technologie in board.technologies"
                          :key="technologie.content"
                          class="ml-2 mt-5 pb-2 hashtag"
                          label
                        >
                          # {{ technologie.content }}
                        </div>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </v-row>
            </v-tabs-window-item>
          </v-tabs-window>
        </div>
      </v-card>
      <!-- 목록 -->
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      userId: null,
      profile: null,
      boardlist: null,
      tab: 'one',
    };
  },

  mounted() {
    this.checkToken();
    this.getBoardList();
    this.getProfile();
  },

  methods: {
    clickTech(tech) {
      this.$axios
        .get(`/technology/board/${tech.content}`)
        .then((response) => {
          this.boardlist = response.data; // Update boardlist with the fetched data
          this.boardlist.forEach((board) => {
            console.log('board list: ' + board);
            // Iterate over each board in the array
            console.log('username boardlist: ' + board.username); // Access and log the username of each board
            console.log('schoolname  boardlist: ' + board.schoolname); // Access and log the schoolname of each board
            console.log('locallocation boardlist: ' + board.locallocation); // Access and log the locallocation of each board
            console.log(board.content);
          });
        })
        .catch((error) => {
          console.error('Error fetching board data:', error);
        });
      console.log(tech);
    },

    clickBoard(board) {
      console.log(board.numberid);
      this.$router.push('/board/' + board.numberid);
    },

    checkToken() {
      const token = localStorage.getItem('jwt');
      console.log(token);
      if (token) {
        this.isLoggedIn = true;
        this.validateToken(token).catch((error) => {
          console.error('Error validating token:', error);
          localStorage.removeItem('jwt');
          this.$router.push('/login');
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

    getProfile() {
      this.$axios
        .get('/profile/' + this.$route.params.id)
        .then((response) => {
          this.profile = response.data;
          console.log(this.profile);
          if (!this.profile) {
            this.$router.push('/profile/create');
          }
        })
        .catch((error) => {
          console.error('Error fetching profile data:', error);
          this.$router.push('/profile/create'); // Redirect if there's an error fetching profile
        });
    },

    getBoardList() {
      this.$axios
        .get('/board/list/' + this.$route.params.id)
        .then((response) => {
          this.boardlist = response.data;
          if (this.boardlist.length === 0) {
            alert('게시물이 없습니다');
          } else {
            this.boardlist.forEach((board) => {
              console.log('board list: ' + board);
              // Iterate over each board in the array
              console.log('username boardlist: ' + board.username); // Access and log the username of each board
              console.log('schoolname  boardlist: ' + board.schoolname); // Access and log the schoolname of each board
              console.log('locallocation boardlist: ' + board.locallocation); // Access and log the locallocation of each board
              console.log(board.content);
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching board list:', error);
        });
    },

    home() {
      this.$router.push('/mainPage');
    },

    homeProfile() {
      this.$router.push('/profile/' + this.userId);
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
  /* background: #999; */
}
.text_username {
  font-size: 20px;
  font-weight: bold;
}
.avatarbackground {
  border: 3px solid transparent;
  border-radius: 50%;
  background-image: linear-gradient(#fff, #fff),
    linear-gradient(to bottom right, #c582fa 0%, #fa8982 49%, #fac611 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
}
.text_tech {
  color: #38638c;
  font-size: 20px;
}
.bodycard {
  width: 95%;
  background-color: white;
}
.rectangcard {
  width: 70%;
  background-color: white;
}
.avatarname {
  font-size: 15px;
  font-weight: bold;
}
.titletext {
  font-size: 15px;
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
