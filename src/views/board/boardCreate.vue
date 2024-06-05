<template>
  <div
    class="background"
    style="height: 100%; width: 100%; margin: auto; align-content: center"
  >
    <v-card
      class="mt-5 mb-5"
      style="
        width: 70%;
        margin: auto;
        background-color: #edecec;
        min-height: 90%;
      "
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

      <!-- 로그인 본문 -->
      <v-card
        class="mt-5 mb-5"
        style="
          width: 95%;
          margin: auto;
          min-height: 80%;
          background-color: white;
        "
      >
        <v-row class="mt-5 justify-start">
          <v-icon
            class="ml-10"
            @click="homeProfile()"
            >mdi-arrow-left</v-icon
          >
          <v-spacer></v-spacer>
          <div class="bold-text mr-10">새 게시물</div>
          <v-spacer></v-spacer>
        </v-row>
        <v-divider class="mt-5"></v-divider>

        <v-container style="width: 70%">
          <v-col>
            <v-img
              class="mt-5"
              v-if="imageUrl === ''"
              max-height="200"
              max-width="100%"
              src="@/image/imagebox.png"
            ></v-img>
            <v-img
              v-else
              :src="imageUrl"
              max-height="200"
              class="my-4"
            ></v-img>
            <!-- 타이틀 제목 -->
            <v-col>
              <v-dialog max-width="340">
                <template v-slot:activator="{ props: activatorheart }">
                  <v-row
                    class="justify-center mt-1 mb-1 mr-8"
                    v-bind="activatorheart"
                  >
                    <div class="text-title">게시물의 제목을 입력하세요...</div>
                  </v-row>
                </template>

                <!-- 안에 내용 -->
                <template v-slot:default="{ isActive }">
                  <v-card
                    prepend-icon="mdi-content-paste"
                    title="게시물 제목입력"
                  >
                    <v-textarea
                      v-model="title"
                      class="pa-3"
                      bg-color="grey-lighten-4"
                      label="내용"
                      variant="solo"
                      counter
                      elevation="0"
                    ></v-textarea>
                    <template v-slot:actions>
                      <v-btn
                        class="ml-auto"
                        text="제출"
                        @click="
                          submittitle();
                          isActive.value = false;
                        "
                      >
                      </v-btn>
                    </template>
                  </v-card>
                </template>
              </v-dialog>
            </v-col>
            <!-- 파일을 업로드 -->
            <v-file-input
              class="ml-9"
              label="파일 업로드"
              prepend-icon="mdi-camera"
              accept="image/*"
              v-model="file"
              @change="previewImage"
              outlined
            ></v-file-input>
            <v-divider></v-divider>

            <!-- 프로젝트 만족도 표시 -->
            <v-col>
              <v-dialog max-width="340">
                <template v-slot:activator="{ props: activatorProps }">
                  <v-row
                    class="mt-1 mb-1 ml-6"
                    v-bind="activatorProps"
                  >
                    <v-icon class="mr-3">mdi-crown</v-icon>
                    <div class="bold-text-15">
                      해당 프로젝트에 대한 나의 만족도 표시하세요
                    </div>
                  </v-row>
                </template>
                <!-- 카드 -->
                <template v-slot:default="{ isActive }">
                  <v-card
                    prepend-icon="mdi-crown"
                    text="해당 프로젝트를 하면서 내가 느낀 만족도를 표현하세요."
                    title="프로젝트 만족도"
                  >
                    <v-rating
                      class="justify-center"
                      v-model="crownrating"
                      empty-icon="mdi-crown-outline"
                      full-icon="mdi-crown"
                      increments
                      hover
                    ></v-rating>
                    <template v-slot:actions>
                      <!-- 버튼 -->
                      <v-row class="justify-end">
                        <v-btn
                          class="mr-10"
                          text="Sumit"
                          @click="
                            crownsubmitRating();
                            isActive.value = false;
                          "
                        >
                        </v-btn
                        ><v-btn
                          class="mr-7"
                          text="Close"
                          @click="isActive.value = false"
                        ></v-btn>
                      </v-row>
                    </template>
                  </v-card>
                </template>
              </v-dialog>
            </v-col>
            <v-divider></v-divider>

            <!-- 프로젝트 기여도 표시 -->
            <v-col>
              <v-dialog max-width="340">
                <template v-slot:activator="{ props: activatorheart }">
                  <v-row
                    class="mt-1 mb-1 ml-6"
                    v-bind="activatorheart"
                  >
                    <v-icon class="mr-3">mdi-heart</v-icon>
                    <div class="bold-text-15">
                      해당 프로젝트에 대한 나의 기여도를 표시하세요
                    </div>
                  </v-row>
                </template>

                <template v-slot:default="{ isActive }">
                  <v-card
                    prepend-icon="mdi-heart"
                    text="해당 프로젝트를 하면서 내가 느낀 기여도를 표현하세요."
                    title="프로젝트 기여도"
                  >
                    <v-rating
                      class="justify-center"
                      v-model="heartrating"
                      empty-icon="mdi-heart-outline"
                      full-icon="mdi-heart"
                      increments
                      hover
                    ></v-rating>
                    <template v-slot:actions>
                      <v-row class="justify-end">
                        <v-btn
                          class="mr-10"
                          text="Sumit"
                          @click="
                            submitRating();
                            isActive.value = false;
                          "
                        >
                        </v-btn
                        ><v-btn
                          class="mr-7"
                          text="Close"
                          @click="isActive.value = false"
                        ></v-btn>
                      </v-row>
                    </template>
                  </v-card>
                </template>
              </v-dialog>
            </v-col>

            <v-divider></v-divider>

            <!-- 기술 스택 기여도 표시 -->
            <v-col>
              <v-dialog max-width="340">
                <template v-slot:activator="{ props: activatorheart }">
                  <v-row
                    class="mt-1 mb-1 ml-6"
                    v-bind="activatorheart"
                  >
                    <v-icon class="mr-3">mdi-hammer-wrench</v-icon>
                    <div class="bold-text-15">
                      해당 프로젝트에 대한 나의 기술스택을 표시하세요
                    </div>
                  </v-row>
                </template>

                <template
                  v-if="technology"
                  v-slot:default="{ isActive }"
                >
                  <v-card
                    prepend-icon="mdi-hammer-wrench"
                    text="해당 프로젝트에 대한 나의 기술스택을 표시하세요."
                    title="프로젝트 기술 스택"
                  >
                    <!-- 기술 스택 정하기 -->
                    <v-container>
                      <v-row>
                        <v-col
                          v-for="(selection, i) in selected"
                          :key="selection.content"
                          class="py-1 pe-0"
                          cols="auto"
                        >
                          <v-chip
                            :disabled="loading"
                            closable
                            @click:close="selected.splice(i, 1)"
                          >
                            <v-icon
                              :icon="selection.icon"
                              left
                            ></v-icon>
                            {{ selection.content }}
                          </v-chip>
                        </v-col>
                        <v-col
                          v-if="!allSelected"
                          cols="12"
                        >
                        </v-col>
                      </v-row>
                    </v-container>

                    <v-divider v-if="technology"></v-divider>
                    <v-list>
                      <template v-for="item in technology">
                        <v-list-item
                          v-if="!selected.includes(item)"
                          :key="item.content"
                          :disabled="loading"
                          @click="selected.push(item)"
                        >
                          <template v-slot:prepend>
                            <v-icon :disabled="loading"></v-icon>
                          </template>

                          <v-list-item-title
                            v-text="item.content"
                          ></v-list-item-title>
                        </v-list-item>
                      </template>
                    </v-list>

                    <template v-slot:actions>
                      <v-btn
                        class="ml-auto"
                        text="제출"
                        @click="
                          submitProjectStack();
                          isActive.value = false;
                        "
                      >
                      </v-btn>
                    </template>
                  </v-card>
                </template>
              </v-dialog>
            </v-col>

            <v-divider></v-divider>
            <v-row class="mt-10 ml-10 md-5 mb-5">
              <v-icon class="mr-3">mdi-note-plus</v-icon>
              <div class="bold-text-15">게시물 추가</div>
            </v-row>
            <v-textarea
              v-model="content"
              class="pl-10 pr-10"
              bg-color="grey-lighten-4"
              label="내용"
              variant="solo"
              counter
              elevation="0"
            ></v-textarea>

            <v-btn
              style="width: 90%"
              class="bold-text mb-10 ml-10 mr-10"
              elevation="0"
              color="blue"
              @click="submitboard()"
              >공유</v-btn
            >
          </v-col>
        </v-container>
      </v-card>
    </v-card>
  </div>
</template>
<script>
export default {
  computed: {
    filteredCategories() {
      return this.technology.filter((c) => !this.selected.includes(c));
    },
  },

  data() {
    return {
      title: '',
      content: '',
      isLoggedIn: false,
      userId: null,
      file: null,
      imageUrl: '',
      dialog: false,
      heartrating: 0,
      crownrating: 0,
      // 기술 스택 목록을 넣는다.
      selected: [],
      loading: false,
      allSelected: false,
      technology: [],
    };
  },

  mounted() {
    this.$axios
      .get('/technology/' + this.$route.params.id)
      .then((response) => {
        this.technology = response.data;
        console.log(this.technology);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  },

  created() {
    this.checkToken();
  },

  methods: {
    previewImage(event) {
      const files = event.target.files;
      if (files.length > 5) {
        alert('최대 5개의 파일만 업로드할 수 있습니다.');
        this.imageUrl = ''; // 선택된 파일이 이미지가 아니면 imageUrl을 비웁니다.
      } else if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image')) {
          this.imageUrl = URL.createObjectURL(file);
        } else {
          this.imageUrl = ''; // 선택된 파일이 이미지가 아니면 imageUrl을 비웁니다.
        }
      } else {
        this.imageUrl = ''; // 파일 선택을 취소했거나 파일이 선택되지 않았다면 imageUrl을 비웁니다.
      }
    },

    submitRating() {
      console.log('Submitted Rating:', this.heartrating);
    },
    submitProjectStack() {
      console.log('Submitted Rating:', this.selected);
    },
    submittitle() {
      console.log('Submitted Rating:', this.title);
    },
    crownsubmitRating() {
      console.log('Submitted Rating:', this.crownrating);
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
    submitboard() {
      // jwt를 추출한다.
      const token = localStorage.getItem('jwt');
      // 토큰을 디코딩한다.
      const decodedToken = this.decodeToken(token);
      if (!decodedToken) {
        alert('Invalid or missing token, please login again.');
        return;
      }
      const formData = new FormData();
      // 디코딩한 토큰의 아이디를 집어넣는다.
      formData.append('username', decodedToken);
      formData.append('file', this.file);
      formData.append('title', this.title);
      formData.append('content', this.content);
      formData.append('heartrating', this.heartrating);
      formData.append('crownrating', this.crownrating);
      formData.append('technologies', JSON.stringify(this.selected)); // Make sure to stringify if it's an object or an array
      // 보낼 정보를 출력한다.
      console.log('모든 정보 출력 : ', formData);

      this.$axios
        .post('/board/create', formData)
        .then((response) => {
          alert(response.data);
          this.$router.push('/profile/' + this.userId);
        })
        .catch((error) => {
          // 아무런 데이터도 넣지 않고 보낼 시 BadRequet를 반환하는데 해당 오류를 알린다.
          if (error.response && error.response.status === 400) {
            // Specific alert for BadRequest
            alert(
              'There was a problem with your submission: ' + error.response.data
            );
            // 나머지 에러를 알린다.
          } else {
            // General alert for other types of errors
            alert('An error occurred: ' + error.message);
          }
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
  overflow-y: auto;
}
.my-4 {
  margin-top: 16px;
  margin-bottom: 16px;
}
.overflow-card {
  overflow: hidden;
}
.scrollable-content {
  overflow-y: auto;
}
.bold-text {
  font-weight: bold; /* 폰트 두껍게 */
  font-size: 20px; /* 폰트 크기 */
}
.bold-text-15 {
  font-weight: bold; /* 폰트 두껍게 */
  font-size: 15px; /* 폰트 크기 */
}
.text-title {
  font-size: 15px; /* 폰트 크기 */
  color: #d9d9d9;
}
</style>
