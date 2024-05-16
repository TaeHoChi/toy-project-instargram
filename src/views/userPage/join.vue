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
        <v-icon class="ml-10 mt-5 mr-10">mdi-login</v-icon>
      </v-toolbar>
      <!-- 로그인 본문 -->
      <v-card
        class="mt-10"
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
            v-model="user.username"
            label="이름"
            type="user.username"
            variant="outlined"
          ></v-text-field>
          <!-- 비밀번호 입력 필드 -->
          <v-text-field
            v-model="user.schoolname"
            class="mt-2"
            label="학교이름"
            variant="outlined"
            type="password"
          ></v-text-field
          ><v-text-field
            v-model="user.userid"
            class="mt-2"
            label="아이디"
            variant="outlined"
            type="password"
          ></v-text-field
          ><v-text-field
            v-model="user.password"
            class="mt-2"
            label="비밀번호"
            variant="outlined"
            type="password"
          ></v-text-field
          ><v-text-field
            v-model="user.passwordcheck"
            class="mt-2"
            label="비밀번호 확인"
            variant="outlined"
            type="password"
          ></v-text-field>

          <!-- 로그인 버튼 -->
          <v-btn
            class="pt-7 pb-7 mt-2 bold-text"
            elevation="0"
            color="blue"
            block
            large
            text="bold"
            @click="submit()"
            >가입</v-btn
          >
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
        username: '',
        schoolname: '',
        userid: '',
        password: '',
        passwordcheck: '',
      },
    };
  },
  methods: {
    submit() {
      //   this.$axios.get('/greet').then((response) => {
      //     alert(response.data);
      //   });
      console.log(this.user);
      console.log(this.user.password);
      console.log(this.user.passwordcheck);
      if (this.user.password == this.user.passwordcheck) {
        this.$axios
          .post('/join', {
            username: this.user.username,
            schoolname: this.user.schoolname,
            userid: this.user.userid,
            password: this.user.password,
          })
          .then((response) => {
            alert(response.data);
            this.$router.push('/login');
          });
      } else {
        alert('비밀번호랑 비밀번호 확인이 일치하지 않습니다.');
      }
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
.bold-text {
  font-weight: bold; /* 폰트 두껍게 */
  font-size: 20px; /* 폰트 크기 */
}
</style>
