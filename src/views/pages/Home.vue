<template>
  <div>
    <!-- Page Heading -->
    <h1 class="h3 mb-2 text-gray-800">Dashboard</h1>
    <p class="mb-4">Selamat Datang {{ loginType }} {{ nameUser }}</p>

    <!-- DataTales Example -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Dashboard</h6>
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
              </tr>
            </thead>
            <tbody>
              <tr v-for="(data, index) in sortedItems" :key="data.uuid">
                <td>{{ index + 1 }}</td>
                <td>{{ data?.modul?.name_modul }}</td>
                <td>{{ data?.User_create?.name }}</td>
                <td>{{ formatDate(data.start_date) }}</td>
                <td>{{ data.start_time }}</td>
                <td>{{ formatDate(data.end_date) }}</td>
                <td>{{ data.end_time }}</td>
                <!-- <td>{{ getArrayUserDev(data.user_dev) }}</td> -->
                <!-- <td>{{ getArrayProg(data.trn_progs) }}</td> -->
                <td>
                  <div v-for="(data) in data.user_dev" :key="data">
                    <span class="badge badge-pill badge-dark" data-toggle="modal" data-target="#userModal" type="button"
                      @click="userInfo(data)">{{ data }}</span>
                  </div>
                </td>
                <td>
                  <div v-for="(data) in data.trn_progs" :key="data.no_prog">
                    <span class="badge badge-pill badge-dark">{{ data?.no_prog }}</span>
                  </div>
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
              <h4 class="card-title">Data Dashboard Kosong</h4>
              <img src="..\src\assets\3371471.jpg"
                class="img-fluid ${3|rounded-top,rounded-right,rounded-bottom,rounded-left,rounded-circle,|}"
                width="300px" alt="">
              <p class="card-text">Isi Jadwal Terlebih Dahulu</p>
            </div>
          </div>
        </div>

        <!-- Users Modal -->
        <div class="modal fade" id="userModal" tabindex="-1" role="dialog" aria-labelledby="userModalLabel"
          aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="userModalLabel">Keterangan Developer<i class="fa fa-user-circle"
                    aria-hidden="true"></i></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                  <span class="card-title badge text-wrap badge-dark" style="font-size:1rem;">{{ dataUser.npk }}</span>
                  <h5 class="card-subtitle mb-1">Nama : {{ dataUser.name }}</h5>
                  <h5 class="card-subtitle">No. Telp : {{ dataUser.phone }}</h5>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script>
import axiosinstance from "@/services/axiosInstance";
import moment from 'moment'

export default {
  name: "home",
  data() {
    return {
      user: "",
      loginType: "",
      nameUser: "",
      dataJadwal: [],
      dataAllUser: [],
      dataUser: [],

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
      axiosinstance.get("request/").then((response) => {
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
    getUser() {
      axiosinstance.get("user-dev/").then((response) => {
        this.dataAllUser = response.data;
      });
    },
    formatDate(arr) {
      let formattedDate = moment(arr).format('DD MMM YYYY');

      return formattedDate;
    },
    userInfo(data) {
      const a = this.dataAllUser.length
      for (let i = 0; i < a; i++) {
        if (this.dataAllUser[i].npk == data) {
          this.dataUser = this.dataAllUser[i]
        }
      }
    },

    //Pagination
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
  computed: {
    sortedItems: function () {
      return this.dataJadwal.slice().sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
    },
    indexStart() {
      return (this.current - 1) * this.pageSize;
    },
    indexEnd() {
      return this.indexStart + this.pageSize;
    },
    paginated() {
      return this.sortedItems.slice(this.indexStart, this.indexEnd);
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
  mounted() {
    this.getAllJadwal();
    this.getUser();
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
