<template>
  <div>
    <!-- Page Heading -->
    <h1 class="h3 mb-2 text-gray-800">Penilaian</h1>
    <p class="mb-4">Selamat Datang {{ loginType }} {{ nameUser }}</p>


    <!-- Table -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Penilaian</h6>
      </div>
      <div class="card-body">
        <div v-if="dataJadwal.length > 0" class="table-responsive">
          <table class="table" id="dataTable" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th>No</th>
                <th>Modul</th>
                <th>User</th>
                <th>Tanggal Mulai</th>
                <th>Waktu Mulai</th>
                <th>Tanggal Selesai</th>
                <th>Waktu Selesai</th>
                <th>Developer</th>
                <th>Prog</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(data, index) in paginated" :key="data.uuid">
                <td>{{ indexNumber(index) }}</td>
                <td>{{ data?.modul?.name_modul }}</td>
                <td>{{ data?.User_create?.name }}</td>
                <td>{{ formatDate(data.start_date) }}</td>
                <td>{{ data.start_time }}</td>
                <td>{{ formatDate(data.end_date) }}</td>
                <td>{{ data.end_time }}</td>
                <!-- <td>{{ getArrayUserDev(data.user_dev) }}</td>
                <td>{{ getArrayProg(data.trn_progs) }}</td> -->
                <td>
                  <div v-for="(data) in data.user_dev" :key="data">
                    <span class="badge badge-pill badge-dark">{{ data }}</span>
                  </div>
                </td>
                <td>
                  <div v-for="(data) in data.trn_progs" :key="data.no_prog">
                    <span class="badge badge-pill badge-dark">{{ data?.no_prog }}</span>
                  </div>
                </td>
                <td>
                  <button type="button" class="mb-3 btn btn-info" data-toggle="modal" data-target="#ratingModal"
                    @click="getModal(data)">
                    <i class="bx bx-chat"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="prevDis">
                <a class="page-link" @click.prevent="prev" href="">Previous</a>
              </li>
              <li class="page-item" v-for="index in pageNumber" :key="index">
                <a class="page-link" @click.prevent="pageCurrent(index)" href="">{{ index }}</a>
              </li>
              <li class="page-item" :class="nextDis">
                <a class="page-link" href="" @click.prevent="next">Next</a>
              </li>
            </ul>
          </nav>
        </div>

        <div v-else-if="dataJadwal.length == 0" class="card-deck">
          <div class="card">
            <div class="card-body text-center">
              <h4 class="card-title">Data Jadwal Penilaian Kosong</h4>
              <img src="..\src\assets\3371471.jpg"
                class="img-fluid ${3|rounded-top,rounded-right,rounded-bottom,rounded-left,rounded-circle,|}"
                width="300px" alt="">
              <p class="card-text">Tambahkan Data Jadwal Penilaian Terlebih Dahulu</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Penilaian modal -->
    <div class="modal fade" id="ratingModal" tabindex="-1" role="dialog" aria-labelledby="ratingModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="ratingModalLabel">Penilaian</h5>
            <button id="exitPenilaian" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div>
              <p>Modul {{ jadwals.modul?.name_modul }}<br>Tanggal mulai {{ formatDate(jadwals.start_date) }} {{
                jadwals.start_time
              }}<br>Tanggal selesai {{ formatDate(jadwals.end_date) }} {{ jadwals.end_time }}</p>
            </div>
            <div class="mb-4" v-for="(data, index) in dataQuestion" :key="data.uuid">
              <div>
                <label>{{ data.question }}</label>
              </div>
              <div class="form-group">
                <div v-if="data.type_question == 1">
                  <star-rating v-model="rating[index]" :star-size="25" animate rounded-corners></star-rating>
                </div>
                <div v-else>
                  <textarea type="text" v-model="answerRating[index]" class="form-control"
                    placeholder="Isi Jawaban"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="closeModal">Reset</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="submitNilai(dataQuestion)" :disabled="btnDisabled">
              <span v-show="loading" class="spinner-border spinner-border-sm mr-1"></span>
              Nilai</button>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>
  
<script>
import axiosinstance from "@/services/axiosInstance";
//import { ValidationProvider, ValidationObserver } from 'vee-validate';
import StarRating from 'vue-star-rating';
import moment from 'moment'

export default {

  name: "Pertanyaan",
  components: {

    StarRating,
    //ValidationProvider,
    //ValidationObserver,
  },

  data() {
    return {
      user: "",
      loginType: "",
      nameUser: "",
      dataJadwal: [],
      dataModul: [],
      dataQuestion: [],
      dataAnswer: [],
      questionId: "",
      jadwalId: "",
      loading: false,
      answerRating: [],
      rating: [],
      jadwals: [],
      btnDisabled: false,

      //pagination
      current: 1,
      pageSize: 10,
      pageMuch: 1,

      //component
      prevDis: "",
      nextDis: "",
    };
  },
  created() {
    axiosinstance
      .get("me/")
      .then((response) => {
        this.user = response.data;
        this.loginType = response.data.msg.role;
        this.nameUser = response.data.msg.name;
      })
  },
  methods: {
    getArrayProg(arr) {
      if (arr.length === 1) return arr[0].no_prog;

      const first = arr.slice(0, arr.length - 1);
      const last = arr[arr.length - 1];

      let arrayFirst = [];
      first.forEach((datas) => {
        arrayFirst.push(datas?.no_prog);
      });

      return arrayFirst.join(", ") + " dan " + last.no_prog;
    },
    getArrayUserDev(arr) {
      if (arr.length === 1) return arr[0];
      const first = arr.slice(0, arr.length - 1);
      const last = arr[arr.length - 1];
      return first.join(", ") + " dan " + last;
    },
    getAllJadwal() {
      axiosinstance.get("projectme/").then((response) => {
        this.dataJadwal = response.data.msg;

        if (!(this.dataJadwal.length < this.indexEnd)) {
          this.nextDis = ""
        } else {
          this.nextDis = "disabled"
        }

        if (!(this.current == 1)) {
          this.prevDis = ""
        } else {
          this.prevDis = "disabled"
        }
      });
    },
    getModulbyId() {
      axiosinstance.get("modul/").then((response) => {
        this.dataModul = response.data.msg;
      });
    },
    getQuestion() {
      axiosinstance.get("question/").then((response) => {
        this.dataQuestion = response.data.msg;
      });
    },
    formatDate(arr) {
      let formattedDate = moment(arr).format('DD MMM YYYY');

      return formattedDate;
    },
    nilaiModal() {
      this.modalInv = !this.modalInv
    },
    getModal(data) {
      this.jadwalId = data.uuid
      this.jadwals = data
      this.dataAnswer.splice(0);
    },
    closeModal() {
      this.answerRating.splice(0);
      this.rating.splice(0);
    },
    submitNilai(data) {
      this.btnDisabled = true
      this.loading = true
      const y = data.length
      for (let i = 0; i < y; i++) {
        if (this.rating[i] == null && this.answerRating[i] == null) {
          this.$toast.error(data[i].question + " Jawaban Kosong", {
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
          this.loading = false
          this.btnDisabled = false
          this.dataAnswer.splice(0);
        } else {
          if (this.rating[i] == null) {
            this.dataAnswer.push({
              "uuid_question": data[i].uuid.toString(),
              "uuid_activity": this.jadwalId,
              "rating": "",
              "answer": this.answerRating[i].toString()
            })
          } else {
            this.dataAnswer.push({
              "uuid_question": data[i].uuid.toString(),
              "uuid_activity": this.jadwalId,
              "rating": this.rating[i].toString(),
              "answer": ""
            })
          }
        }
      }

      if (this.dataAnswer.length > 0) {
        this.postRating();
      }
    },
    postRating() {
      axiosinstance
        .post('rating/', {
          data: this.dataAnswer
        })
        .then((response) => {
          this.getAllJadwal();

          this.$toast.success(response.data.msg, {
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

          document.getElementById("exitPenilaian").click();
          this.answerRating.splice(0);
          this.rating.splice(0);
          this.loading = false
          this.btnDisabled = false
        })
        .catch((error) => {
          this.$toast.error(error.data.msg, {
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
          this.answerRating.splice(0);
          this.rating.splice(0);
          this.loading = false
          this.btnDisabled = false
        });
    },
    prev() {
      if (!(this.current == 1)) {
        this.current--;
      }

      if (!(this.current == 1)) {
        this.prevDis = ""
      } else {
        this.prevDis = "disabled"
      }

      if (!(this.dataJadwal.length < this.indexEnd)) {
        this.nextDis = ""
      } else {
        this.nextDis = "disabled"
      }
    },
    next() {
      if (!(this.dataJadwal.length < this.indexEnd)) {
        this.current++;
      }

      if (!(this.dataJadwal.length < this.indexEnd)) {
        this.nextDis = ""
      } else {
        this.nextDis = "disabled"
      }

      if (!(this.current == 1)) {
        this.prevDis = ""
      } else {
        this.prevDis = "disabled"
      }
    },
    pageCurrent(index) {
      this.current = index;
      this.indexStart;
      this.indexEnd;
      this.paginated;

      if (!(this.dataJadwal.length < this.indexEnd)) {
        this.nextDis = ""
      } else {
        this.nextDis = "disabled"
      }

      if (!(this.current == 1)) {
        this.prevDis = ""
      } else {
        this.prevDis = "disabled"
      }
    },
    indexNumber(index) {
      const x = this.indexStart + index + 1
      return x
    },
  },
  mounted() {
    this.getAllJadwal();
    this.getModulbyId();
    this.getQuestion();
  },
  computed: {
    indexStart() {
      return (this.current - 1) * this.pageSize;
    },
    indexEnd() {
      return this.indexStart + this.pageSize;
    },
    paginated() {
      return this.dataJadwal.slice(this.indexStart, this.indexEnd);
    },
    pageNumber() {
      const y = this.dataJadwal.length
      let x = 0
      for (let i = 0; i < y; i++) {
        if (i % 10 === 0) {
          x++;
        }
      }
      return x
    },
  },
};
</script>

<style>
@import url("https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap");

.button-shadow {
  color: #fff;
  background-color: #17a2b8;
  border-color: #17a2b8;
  border-radius: 5px;
  box-shadow: 0px 4px 16px #17a2b8;
}
</style>