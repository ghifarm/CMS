<template>
  <div v-show="page">
    <div class="content">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <img src="images/bgLogin.svg" alt="responsive image" class="img-fluid">
          </div>
          <div class="col-md-6 contents">
            <div class="row justify-content-center">
              <div class="col-md-8">
                <div class="mb-4">
                  <h3 class="font-weight-bold"><img src="logo.png" alt="menu-logo" class="menu-logo icon"> ACC CMS AOL</h3>
                  <p class="mb-4">Silahkan Melakukan Log In Terlebih Dahulu</p>
                </div>
                <form name="form" @submit.prevent="onSubmit" class="needs-validation">
                  <div class="form-group first mb-1">
                    <label for="npk">NPK</label>
                    <input name="npk" v-model="npk" v-validate="'required|numeric|max:10|min:3'" type="text"
                      class="form-control" id="npk" required>
                  </div>
                  <div class="form-group last mb-4">
                    <label for="password">Password</label>
                    <div class="input-group">
                      <input v-model="password" v-validate="'required'" :type="typePass" class="form-control"
                        name="password" id="password" value="Mark" required>
                      <a class="mt-3" href="" @click.prevent="showPassword"><i :class="showIcon"
                          aria-hidden="true"></i></a>
                    </div>
                  </div>

                  <button type="submit" class="btn btn-block btn-primary" :disabled="loading" @click="onSubmit">
                    <span v-show="loading" class="spinner-border spinner-border-sm mr-1"></span>Masuk
                    <i class='bx bx-log-in'></i>
                  </button>

                  <!-- <div class="d-flex mb-5 align-items-center">
                    <label class="control control--checkbox mb-0"><span class="caption">Remember me</span>
                      <input type="checkbox" checked="checked" />
                      <div class="control__indicator"></div>
                    </label>
                    <span class="ml-auto"><a href="#" class="forgot-pass">Forgot Password</a></span>
                  </div>

                  <div class="social-login">
                    <a href="#" class="facebook">
                      <span class="icon-facebook mr-3"></span>
                    </a>
                    <a href="#" class="twitter">
                      <span class="icon-twitter mr-3"></span>
                    </a>
                    <a href="#" class="google">
                      <span class="icon-google mr-3"></span>
                    </a>
                  </div> -->

                </form>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosinstance from '@/services/axiosInstance';

export default {

  data() {
    return {
      npk: '',
      password: '',
      typePass: 'password',
      showIcon: 'bx bx-hide',
      error: null,
      message: '',
      messages: '',
      loading: false,
      page: false,
    }
  },
  mounted() {
    if (localStorage.getItem('token') || localStorage.getItem('loginType')) {
      this.$router.push('home');
    } else {
      if (localStorage.getItem('reloaded')) {
        this.page = true
        localStorage.removeItem('reloaded');
      } else {
        localStorage.setItem('reloaded', '1');
        location.reload();
      }
    }
  },
  methods: {
    showPassword() {
      if (this.typePass === 'password') {
        this.typePass = 'text';
        this.showIcon = 'bx bx-show';
      } else {
        this.typePass = 'password';
        this.showIcon = 'bx bx-hide';
      }
    },
    onSubmit() {
      this.$validator.validate().then(valid => {
        if (!valid) {
          this.loading = false;
        }
        else if (valid) {
          this.loginForm();
        }
      });
    },
    loginForm() {
      this.loading = true;
      axiosinstance.post('login', {
        npk: this.npk,
        password: this.password
      })
        .then(response => {
          this.loading = false;
          localStorage.setItem('token', response.data.msg.key)
          localStorage.setItem('loginType', response.data.msg.role)

          let loginType = response.data.msg.role
          if (loginType === "DEV" || loginType === "ADMIN" || loginType === "SA") {
            this.$router.push('home')
          }

          this.$emit('loggedIn')
          location.reload();


        })
        .catch(error => {
          this.loading = false;

          this.$toast.error(error.response.data.msg, {
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true,
            rtl: false
          })

          // if (error.response.status === 404) {
          //   this.$toast.error("NPK Tidak Ditemukan", {
          //     pauseOnFocusLoss: true,
          //     pauseOnHover: true,
          //     draggable: true,
          //     draggablePercent: 0.6,
          //     showCloseButtonOnHover: false,
          //     hideProgressBar: true,
          //     closeButton: "button",
          //     icon: true,
          //     rtl: false
          //   })
          // }

          // if (error.response.status === 400) {
          //   this.$toast.error("Password Salah", {
          //     pauseOnFocusLoss: true,
          //     pauseOnHover: true,
          //     draggable: true,
          //     draggablePercent: 0.6,
          //     showCloseButtonOnHover: false,
          //     hideProgressBar: true,
          //     closeButton: "button",
          //     icon: true,
          //     rtl: false
          //   })
          // }
        });
    }
  }
}
</script>

