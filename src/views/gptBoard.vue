<template>
  <div
    class="background"
    style="height: 100%; width: 100%; align-content: center"
  >
    <v-card
      class="mt-5 mb-5"
      style="width: 70%; margin: auto; background-color: #edecec"
    >
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
      <v-card
        class="mt-2 mb-5 pr-5 pl-5"
        style="margin: auto; width: 95%; background-color: white"
      >
        <v-row class="mt-5 justify-start">
          <v-icon
            class="ml-10"
            @click="homeProfile()"
            >mdi-arrow-left</v-icon
          >
          <v-spacer></v-spacer>
          <div class="bold-text mr-10">GPT에게 물어보기</div>
          <v-spacer></v-spacer>
          <!-- GPT 히스토리 보기 -->
          <!-- GPT 히스토리 버튼 -->
          <v-dialog
            persistent
            max-width="65%"
          >
            <template v-slot:activator="{ props: activatorheart }">
              <v-icon
                class="mr-10"
                v-bind="activatorheart"
                @click="getGptHistory"
                >mdi-history</v-icon
              >
            </template>
            <!-- GPT 히스토리 버튼 -->
            <!-- GPT 히스토리 내용 -->
            <template v-slot:default="{ isActive }">
              <v-card
                prepend-icon="mdi-history"
                title="내가 물어본 GPT 답변"
              >
                <v-divider style="width: 95%; margin-left: 2%"></v-divider>
                <!-- 본문 -->
                <div
                  v-for="(getGptContent, index) in displayedHistory"
                  :key="getGptContent.numberid"
                >
                  <v-row
                    class="mt-5 ml-10"
                    style="width: 90%"
                  >
                    <div>{{ formatDate(getGptContent.localDateTime) }}</div>
                    <div style="margin-left: 20%">
                      {{ getGptContent.content }}
                    </div>
                    <v-spacer></v-spacer>
                    <v-icon
                      class="ml-5"
                      @click="deleteBoard(getGptContent.numberId)"
                      >mdi-trash-can-outline</v-icon
                    >
                    <v-icon
                      class="ml-5"
                      @click="showGptResponse(getGptContent)"
                      >mdi-dots-vertical</v-icon
                    >
                  </v-row>
                  <v-divider
                    class="mt-5"
                    style="width: 95%; margin-left: 2%"
                  ></v-divider>
                </div>
                <div
                  v-if="!hasMoreItems"
                  class="text-center red--text mt-5"
                >
                  더 이상 불러올 데이터가 없습니다.
                </div>
                <v-row
                  v-else
                  class="justify-center"
                >
                  <v-btn
                    @click="loadMoreItems"
                    :disabled="loadingMore"
                    elevation="1"
                    variant="outlined"
                    class="mt-10"
                    style="width: 30%"
                  >
                    {{ loadingMore ? 'Loading...' : 'Load More' }}
                  </v-btn>
                </v-row>
                <!-- 본문 -->
                <!-- 닫기 버튼 -->
                <template v-slot:actions>
                  <v-row class="justify-end">
                    <v-btn
                      class="mr-7"
                      text="Close"
                      @click="isActive.value = false"
                    ></v-btn>
                  </v-row>
                </template>
                <!-- 닫기 버튼 -->
              </v-card>
            </template>
          </v-dialog>
          <!-- GPT 히스토리 보기 -->
        </v-row>
        <v-divider class="mt-5"></v-divider>
        <!-- GPT에게 보내기 -->
        <v-col class="ml-10">
          <v-textarea
            class="mt-5"
            label="내용을 입력하세요"
            variant="outlined"
            v-model="content"
            style="width: 95%"
          ></v-textarea>
          <!-- GPT한테 물어보기 -->
          <v-btn
            @click="getGptResponse"
            variant="outlined"
            style="width: 95%"
          >
            GPT에게 보내기
          </v-btn>
          <v-divider
            style="width: 95%"
            class="mt-5"
          ></v-divider>
          <!-- GPT에게 보내기 -->
          <!-- GPT 답변 -->
          <div class="text-center mt-3 mr-15">GPT 답변</div>
          <v-container
            class="mt-2 mr-16 mb-5 outlined-container"
            style="width: 95%; height: 200px"
          >
            <div
              v-if="loading"
              class="text-center"
            >
              <v-progress-circular
                indeterminate
                color="grey-darken-3"
              ></v-progress-circular>
            </div>
            <div
              v-else-if="gptResponse"
              class="response-text"
            >
              {{ gptResponse }}
            </div>
            <div
              v-else
              class="loding-text pb-2 pt-2 ml-2"
            >
              무엇이든 물어보세요!
            </div>
          </v-container>
          <!-- GPT 답변 -->
          <!-- GPT 답변 저장하기 -->
          <v-btn
            @click="saveGptBoard"
            variant="outlined"
            style="width: 95%"
          >
            답변 저장하기
          </v-btn>
          <!-- GPT 답변 저장하기 -->
        </v-col>
      </v-card>
    </v-card>

    <!-- GPT Response Dialog -->
    <v-dialog
      v-model="responseDialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title class="headline">GPT 답변</v-card-title>
        <v-card-text>
          {{ selectedGptResponse }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="responseDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- GPT Response Dialog -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      userName: null,
      content: '',
      gptResponse: '', // Add this line to store GPT response
      loading: false, // Add this line to track loading state
      getGpthistory: [],
      displayedHistory: [],
      numberid: '',
      responseDialog: false,
      selectedGptResponse: '',
      itemsPerLoad: 5,
      loadingMore: false,
      hasMoreItems: true, // Add this line to track if there are more items to load
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

    deleteBoard(numberid) {
      const longNumberId = parseInt(numberid, 10); // Convert numberid to long (integer) type
      if (isNaN(longNumberId)) {
        alert('Invalid number ID');
        return;
      }
      this.$axios.delete('/delete/gptboard/' + longNumberId).then(() => {
        alert('삭제되었습니다.');
        window.location.reload(); // Add this line to reload the page
      });
    },

    showGptResponse(getGptContent) {
      this.selectedGptResponse = getGptContent.gptResponse;
      this.responseDialog = true;
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

    getGptHistory() {
      this.$axios
        .get('/generate/get/' + this.userName)
        .then((response) => {
          this.getGpthistory = response.data;
          // Sort by date in descending order
          this.getGpthistory.sort(
            (a, b) => new Date(b.localDateTime) - new Date(a.localDateTime)
          );
          this.loadMoreItems();
        })
        .catch((error) => {
          console.error('Error fetching profile data:', error);
        });
    },

    saveGptBoard() {
      console.log('이름:   ' + this.userName);
      console.log('사용자가 입력: ' + this.content);
      console.log('GPT 답변: ' + this.gptResponse);
      this.$axios
        .post('/generate/save', {
          username: this.userName,
          content: this.content,
          gptResponse: this.gptResponse,
        })
        .then((response) => {
          window.location.reload(); // Add this line to reload the page
          alert(response.data);
        });
    },

    formatDate(dateTimeString) {
      const date = new Date(dateTimeString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },

    loadMoreItems() {
      if (this.loadingMore || !this.hasMoreItems) return;

      this.loadingMore = true;
      setTimeout(() => {
        const nextItems = this.getGpthistory.slice(
          this.displayedHistory.length,
          this.displayedHistory.length + this.itemsPerLoad
        );

        if (nextItems.length > 0) {
          this.displayedHistory.push(...nextItems);
        } else {
          this.hasMoreItems = false; // No more items to load
        }
        this.loadingMore = false;
      }, 1000);
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
.bold-text {
  font-size: 20px;
  font-weight: 500;
}
.red--text {
  color: red !important;
  font-size: 10px;
}
.card-image {
  width: 100%;
  max-height: 200px;
}
.response-text {
  white-space: pre-wrap;
  word-wrap: break-word;
}
.outlined-container {
  border: 1px solid #d9d9d9;
  padding: 10px;
  border-radius: 4px;
}
.loding-text {
  color: #949393;
}
.text-center {
  text-align: center;
  font-size: 20px;
  font-family: 600;
}
</style>
