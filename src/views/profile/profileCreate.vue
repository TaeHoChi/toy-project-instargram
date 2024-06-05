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
          class="mt-5 mb-5"
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
        <v-row class="mt-5">
          <v-icon
            class="ml-10"
            @click="homeProfile()"
            >mdi-arrow-left</v-icon
          >
          <v-spacer></v-spacer>
          <div class="bold-text mr-15">프로필 편집</div>
          <v-spacer></v-spacer>
        </v-row>
        <v-divider class="mt-5"></v-divider>

        <v-container style="width: 70%">
          <v-col>
            <!-- 프로필 이미지 -->
            <v-avatar
              class="mt-3"
              style="margin-left: 35%"
              size="200"
            >
              <v-img :src="imageUrl ? imageUrl : getDefaultImageUrl()"></v-img>
            </v-avatar>
            <!-- 파일을 업로드 -->
            <v-file-input
              class="ml-9 mt-5"
              label="파일 업로드"
              prepend-icon="mdi-camera"
              accept="image/*"
              v-model="file"
              @change="previewImage"
              outlined
            ></v-file-input>
            <v-divider></v-divider>
            <!-- 이름 -->
            <v-row class="mt-5 mb-5">
              <div class="mt-5 ml-8 mr-3">이름</div>
              <v-text-field
                class="mr-7"
                v-model="name"
                variant="underlined"
              ></v-text-field>
            </v-row>

            <!-- 대학교 -->
            <v-row class="mt-5 mb-5">
              <div class="mt-5 ml-6 mr-3">대학교</div>
              <v-text-field
                v-model="schoolname"
                class="mr-7"
                variant="underlined"
              ></v-text-field>
            </v-row>

            <!-- 기술 스택 -->
            <v-row class="mt-5">
              <div class="mt-5 ml-1 mr-3">기술 스택</div>
              <v-text-field
                label="기술 스택"
                variant="underlined"
                v-model="technology"
                hide-details
                @keyup.enter="addChip"
              ></v-text-field>
            </v-row>

            <!-- 기술 스택을 넣으면 칩이 추가된다. -->
            <v-row class="ml-15">
              <v-chip
                v-for="(chip, index) in chips"
                :key="index"
                class="mr-3 mt-4"
                closable
                @click:close="removeChip(index)"
              >
                {{ chip }}
              </v-chip>
            </v-row>

            <!-- 성별 -->
            <v-row class="mt-5 mb-5">
              <div class="mt-5 ml-8 mr-3">성별</div>
              <v-combobox
                label="성별"
                :items="['남성', '여성']"
                variant="underlined"
                v-model="gender"
                class="mr-7"
              ></v-combobox>
            </v-row>

            <!-- 한 줄 설명 -->
            <v-row class="mt-5 mb-5">
              <div class="mt-5 ml-2 mr-3">자기 소개</div>
              <v-text-field
                v-model="content"
                class="mr-7"
                variant="underlined"
              ></v-text-field>
            </v-row>

            <v-btn
              style="width: 90%"
              class="bold-text mb-10 ml-10 mr-10"
              elevation="0"
              color="blue"
              @click="submitboard()"
              >편집</v-btn
            >
          </v-col>
        </v-container>
      </v-card>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 기술 스택 목록을 넣는다.
      imageUrl: '',
      name: '',
      schoolname: '',
      chips: [], // Array to store the chips
      technology: '',
      gender: '',
      content: '',
    };
  },

  created() {
    this.checkToken();
  },

  methods: {
    // 기술 스택을 칩 형태로 추가한다.
    addChip() {
      if (this.technology.trim() !== '') {
        this.chips.push(this.technology.trim());
        this.technology = ''; // Clear the text field
      }
    },
    // 기술 스택 칩을 제거한다.
    removeChip(index) {
      this.chips.splice(index, 1);
    },

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

    getDefaultImageUrl() {
      if (!this.locallocation) {
        return 'http://localhost:8081/uploads/default.png'; // or any default image
      }
      return (
        'http://localhost:8081/uploads/' +
        this.locallocation.replace(/^C:\\upload\\/, '').replace(/\\/g, '/')
      );
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
      formData.append('file', this.file); // 파일이 올바르게 추가되었는지 확인
      formData.append('name', this.name);
      formData.append('schoolname', this.schoolname);
      formData.append(
        'technologies',
        JSON.stringify(this.chips.map((chip) => ({ content: chip })))
      );
      formData.append('gender', this.gender);
      formData.append('content', this.content); // Make sure to stringify if it's an object or an array

      // 보낼 정보를 출력한다.
      console.log('모든 정보 출력 : ', formData);
      console.log('username : ', decodedToken);
      console.log('name : ', this.username);
      console.log('gender : ', this.gender);
      console.log('file : ', this.file); // 파일이 올바르게 로그에 찍히는지 확인
      console.log('schoolname : ', this.schoolname);

      // 데이터를 담아서 보낸다.
      this.$axios
        .post('/profile/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          alert(response.data);
          this.$router.push('/mainPage');
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            alert(
              'There was a problem with your submission: ' + error.response.data
            );
          } else {
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
