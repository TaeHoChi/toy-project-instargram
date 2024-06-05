<template>
  <div
    class="background"
    style="height: 100%; width: 100%; align-content: center"
  >
    <v-card
      style="height: 80%; width: 70%; margin: auto; background-color: #edecec"
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
        class="mt-5"
        style="margin: auto; width: 95%; height: 80%; background-color: white"
      >
        <v-img
          class="mt-10"
          style="margin: auto; width: 100%"
          height="70px"
          width="142px"
          src="@/image/introduction.png"
        ></v-img>
        <v-form
          class="mt-10"
          style="width: 60%; margin: auto"
        >
          <!-- 사용자 이름 또는 이메일 입력 필드 -->
          <v-text-field
            v-model="user.id"
            label="아이디"
            type="id"
            variant="outlined"
          ></v-text-field>
          <!-- 비밀번호 입력 필드 -->
          <v-text-field
            v-model="user.password"
            class="mt-5"
            label="비밀번호"
            variant="outlined"
            type="password"
          ></v-text-field>
          <div
            style="
              color: #1e4dc6;
              margin-left: 10px;
              text-align: end;
              width: 98%;
            "
            class="value"
          >
            비밀번호를 잊으셨나요?
          </div>
          <!-- 로그인 버튼 -->
          <v-btn
            class="pt-7 pb-7 mt-7 bold-text"
            elevation="0"
            color="blue"
            block
            large
            @click="submit()"
            >로그인</v-btn
          >

          <!-- 추가 텍스트 및 링크 -->
          <div class="text-center caption mt-7">
            <div class="value">계정이 없으신가요?</div>
            <div
              @click="join"
              style="color: #1e4dc6; margin-left: 10px"
              class="value"
            >
              가입하기
            </div>
          </div>
          <v-col class="d-flex align-center justify-space-between">
            <v-divider
              :thickness="2"
              class="mr-10 mt-10"
            ></v-divider>

            <v-img
              class="mt-10"
              height="30px"
              width="30px"
              src="@/image/photoIcon.png"
            ></v-img>

            <v-divider
              :thickness="2"
              class="mt-10 ml-10"
            ></v-divider>
          </v-col>
        </v-form>
      </v-card>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: {
        id: '',
        password: '',
      },
    };
  },
  methods: {
    submit() {
      console.log(this.user);
      this.$axios
        .post('/login', {
          id: this.user.id,
          password: this.user.password,
        })
        .then((response) => {
          console.log('Login successful:', response.data);
          // JWT를 로컬 스토리지에 저장
          localStorage.setItem('jwt', response.data.accessToken);
          // 메인 페이지로 리다이렉트
          this.$router.push('/mainPage');
        })
        .catch((error) => {
          console.error('Login failed:', error);
          alert('로그인 실패: ' + error.response.data.message);
        });
    },
    join() {
      this.$router.push('/join');
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
}
.value {
  display: inline-block;
}
.bold-text {
  font-weight: bold; /* 폰트 두껍게 */
  font-size: 20px; /* 폰트 크기 */
}
</style>
