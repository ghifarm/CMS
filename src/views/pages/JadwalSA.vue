<template>
  <div>
    <!-- Page Heading -->
    <h1 class="h3 mb-2 text-gray-800">Jadwal</h1>
    <div class="row mb-3">
      <div class="col text-left">
        <p>Selamat Datang {{ loginType }} {{ nameUser }}</p>
      </div>
      <div class="col text-right">
        <button type="button" class="btn btn-primary text-center" data-toggle="modal" data-target="#createModal">
          <i class="bx bxs-calendar-plus"></i>
          Buat Jadwal
        </button>
      </div>
    </div>

    <!-- DataTales Example -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Jadwal</h6>
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
                <div v-for="(data) in data.user_dev" :key="data">
                  <span class="badge badge-pill badge-dark" data-toggle="modal" data-target="#userModal" type="button"
                    @click="userInfo(data)">{{ data }}</span>
                </div>
                <td>
                  <div v-for="(data) in data.trn_progs" :key="data.no_prog">
                    <span class="badge badge-pill badge-dark">{{ data?.no_prog }}</span>
                  </div>
                </td>
                <td>
                  <button type="button" class="m-1 btn btn-primary" data-toggle="modal" data-target="#editModal"
                    @click="modalEdits(data)">
                    <i class="bx bxs-edit-alt"></i>
                  </button>
                  <!-- <button type="button" class="m-1 btn btn-danger" @click="modalDeletes(data)">
                                  <i class="bx bxs-trash-alt"></i>
                                </button> -->
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
              <h4 class="card-title">Data Jadwal Kosong</h4>
              <img src="..\src\assets\3371471.jpg"
                class="img-fluid ${3|rounded-top,rounded-right,rounded-bottom,rounded-left,rounded-circle,|}"
                width="300px" alt="">
              <p class="card-text">Isi Jadwal Terlebih Dahulu</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- create modal -->
    <div class="modal fade" id="createModal" tabindex="-1" role="dialog" aria-labelledby="createModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createModalLabel">Buat Jadwal Baru</h5>
            <button id="exitCreate" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <validation-observer v-slot="{ invalid }" ref="observerCreate">
              <form name="createJadwal" @submit.prevent="submitCreate()">
                <div class="form-group">
                  <label for="uuid_modul">Modul</label>
                  <div class="row col">
                    <div class="dropdown mr-3">
                      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownModulCreate"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <a v-if="catModul == null">Pilih Kategori Modul<span
                            class="ml-2 mr-1 spinner-border spinner-border-sm" role="status" aria-hidden="true"
                            v-show="modulCatLoad"></span></a>
                        <a v-else>{{ catModul }}<span class="ml-2 mr-1 spinner-border spinner-border-sm" role="status"
                            aria-hidden="true" v-show="modulCatLoad"></span></a>
                      </button>
                      <div class="dropdown-menu" aria-labelledby="dropdownModulCreate">
                        <a href="" class="dropdown-item"
                          @click.prevent="catModul = '172.16.4.160', chooseCatModul()">172.16.4.160</a>
                        <a href="" class="dropdown-item"
                          @click.prevent="catModul = '172.16.4.161', chooseCatModul()">172.16.4.161</a>
                        <div class="dropdown-divider"></div>
                        <a href="" class="dropdown-item"
                          @click.prevent="catModul = null, createModulCat = false">Reset</a>
                      </div>
                    </div>
                    <div class="dropdown" v-show="createModulCat">
                      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownModulCreate"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <a v-if="modul_name == ''">Pilih Modul</a>
                        <a v-else>{{ modul_name }}</a>
                      </button>
                      <div class="dropdown-menu" aria-labelledby="dropdownModulCreate">
                        <a href="" v-for="(modul) in dataModul" :key="modul.uuid" class="dropdown-item"
                          @click.prevent="chooseModul(modul)">{{ modul.name_modul }}
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="" class="dropdown-item" @click.prevent="modul_name = '', uuid_modul = ''">Reset</a>
                      </div>
                    </div>
                  </div>
                  <div v-if="errors[0]" class="alert alert-danger mt-2" v-show="errors" role="alert">{{
                    errors[0]
                  }}</div>
                </div>
                <div class="row">
                  <div class="form-group col">
                    <validation-provider name="Start Date" rules="required" v-slot="{ errors }">
                      <label for="start_date">Start Date</label>
                      <date-picker v-model="start_date" type="date" valueType="format"
                        placeholder="YYYY-MM-DD"></date-picker>
                      <div class="text-danger input-group">
                        <small>{{ errors[0] }}</small>
                      </div>
                    </validation-provider>
                  </div>
                  <div class="form-group col">
                    <validation-provider name="Start Time" rules="required" v-slot="{ errors }">
                      <label for="start_time">Start Time</label>
                      <date-picker v-model="start_time" type="time" valueType="format"
                        placeholder="HH-MM-SS"></date-picker>
                      <div class="text-danger input-group">
                        <small>{{ errors[0] }}</small>
                      </div>
                    </validation-provider>
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col">
                    <validation-provider name="End Date" rules="required" v-slot="{ errors }">
                      <label for="end_date">End Date</label>
                      <date-picker v-model="end_date" type="date" valueType="format"
                        placeholder="YYYY-MM-DD"></date-picker>
                      <div class="text-danger input-group">
                        <small>{{ errors[0] }}</small>
                      </div>
                    </validation-provider>
                  </div>
                  <div class="form-group col">
                    <validation-provider name="End Time" rules="required" v-slot="{ errors }">
                      <label for="end_time">End Time</label>
                      <date-picker v-model="end_time" type="time" valueType="format" placeholder="HH-MM-SS"></date-picker>
                      <div class="text-danger input-group">
                        <small>{{ errors[0] }}</small>
                      </div>
                    </validation-provider>
                  </div>
                </div>
                <div class="form-group">
                  <label for="npk_dev">Developer</label>
                  <div class="dropdown mb-1">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownDevCreate"
                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <a>Pilih Dev</a>
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownModulCreate">
                      <a href="#" v-for="(dev) in drop_dev" :key="dev?.uuid" class="dropdown-item"
                        @click="chooseDev(dev)">{{
                          dev?.name
                        }}
                      </a>
                      <div class="dropdown-divider"></div>
                      <a href="#" class="dropdown-item" @click="resetDev(user_dev)">Reset</a>
                    </div>
                    <div class="mt-1">
                      <div>
                        <a class="text-muted">Pilihan Developer</a>
                      </div>
                      <div v-if="user_dev.length > 0">
                        <button @click="delDev(dev)" v-for="(dev) in user_dev" :key="dev?.uuid"
                          class="badge-secondary badge-pill m-1">
                          {{ dev?.npk }}<span aria-hidden="true" class="ml-1">&times;</span></button>
                      </div>
                      <div v-else-if="user_dev.length == 0">
                        <p class="text-danger">Isi dev terlebih dahulu</p>
                      </div>
                    </div>
                    <div v-if="errors[0]" class="alert alert-danger mt-2" v-show="errors" role="alert">{{
                      errors[0]
                    }}</div>
                  </div>
                </div>
                <div class="form-group">
                  <label for="drop_prog">Nomor Program</label>
                  <div class="input-group mb-3">
                    <input name="drop_prog" v-model="drop_prog" type="number" class="form-control"
                      placeholder="Nomor Program">
                    <div class="input-group-append">
                      <button class="btn btn-secondary" type="button" @click.prevent="chooseProg()">tambah</button>
                    </div>
                  </div>
                  <div class="mt-1">
                    <div>
                      <a class="text-muted">Pilihan Nomor Program</a>
                    </div>
                    <div v-if="no_prog.length > 0">
                      <button @click="delProg(prog)" v-for="(prog) in no_prog" :key="prog"
                        class="badge-secondary badge-pill m-1">
                        {{ prog }}<span aria-hidden="true" class="ml-1">&times;</span></button>
                      <div>
                        <a name="resetProg" id="resetProg" class="btn btn-secondary mt-2" href="#" role="button"
                          @click.prevent="resetProg()">Reset</a>
                      </div>
                    </div>
                    <div v-else-if="no_prog.length == 0">
                      <p class="text-danger">Isi Prog terlebih dahulu</p>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button class="btn btn-primary" type="submit" v-bind:disabled="invalid">
                    <span v-show="loading" class="spinner-border spinner-border-sm mr-1"></span>
                    <span>Buat Jadwal</span>
                  </button>
                </div>
              </form>
            </validation-observer>
          </div>
        </div>
      </div>
    </div>

    <!-- edit modal -->
    <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Edit Jadwal</h5>
            <button id="exitEdit" type="button" class="close" data-dismiss="modal" aria-label="Close"
              @click="xModalEdits()">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <validation-observer v-slot="{ invalid }" ref="observerEdit">
              <form name="editJadwal" @submit.prevent="submitEdit()">
                <!-- <div class="form-group">
                            <validation-provider rules="required" v-slot="{ dirty, valid, invalid, errors }">
                              <label for="uuid_modul">Modul</label>
                              <div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownModulEdit"
                                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                  v-bind:class="{ 'is-valid': dirty && valid, 'is-invalid': dirty && invalid }">
                                  <a v-if="name_modulEdit == ''">Pilih Modul</a>
                                  <a v-else>{{ name_modulEdit }}</a>
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownModulEdit">
                                  <a v-for="(modul) in dataModul" :key="modul.uuid" class="dropdown-item"
                                    @click.prevent="chooseModulEdit(modul)">{{ modul.name_modul }}
                                  </a>
                                  <div class="dropdown-divider"></div>
                                  <a class="dropdown-item" @click.prevent="name_modulEdit = '', uuid_modulEdit = ''">Reset</a>
                                </div>
                                <div v-if="errors[0]" class="alert alert-danger mt-2" v-show="errors" role="alert">{{
                                    errors[0]
                                }}</div>
                              </div>
                            </validation-provider>
                          </div> -->
                <div class="row">
                  <div class="form-group col">
                    <validation-provider name="Start Date" rules="required" v-slot="{ errors }">
                      <label for="start_dateEdit">Start Date</label>
                      <date-picker v-model="start_dateEdit" type="date" valueType="format"
                        placeholder="YYYY-MM-DD"></date-picker>
                      <div class="text-danger input-group">
                        <small>{{ errors[0] }}</small>
                      </div>
                    </validation-provider>
                  </div>
                  <div class="form-group col">
                    <validation-provider name="Start Time" rules="required" v-slot="{ errors }">
                      <label for="start_timeEdit">Start Time</label>
                      <date-picker v-model="start_timeEdit" type="time" valueType="format"
                        placeholder="HH-MM-SS"></date-picker>
                      <div class="text-danger input-group">
                        <small>{{ errors[0] }}</small>
                      </div>
                    </validation-provider>
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col">
                    <validation-provider name="End Date" rules="required" v-slot="{ errors }">
                      <label for="end_dateEdit">End Date</label>
                      <date-picker v-model="end_dateEdit" type="date" valueType="format"
                        placeholder="YYYY-MM-DD"></date-picker>
                      <div class="text-danger input-group">
                        <small>{{ errors[0] }}</small>
                      </div>
                    </validation-provider>
                  </div>
                  <div class="form-group col">
                    <validation-provider name="End Time" rules="required" v-slot="{ errors }">
                      <label for="end_timeEdit">End Time</label>
                      <date-picker v-model="end_timeEdit" type="time" valueType="format"
                        placeholder="HH-MM-SS"></date-picker>
                      <div class="text-danger input-group">
                        <small>{{ errors[0] }}</small>
                      </div>
                    </validation-provider>
                  </div>
                </div>
                <!-- <div class="form-group">
                            <validation-provider rules="required|min:3" v-slot="{ dirty, valid, invalid, errors }">
                              <label for="npk_dev">Developer</label>
                              <div class="dropdown mb-1">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownDevCreate"
                                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                  v-bind:class="{ 'is-valid': dirty && valid, 'is-invalid': dirty && invalid }">
                                  <a>Pilih Dev</a>
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownModulCreate">
                                  <a v-for="(dev) in drop_devEdit" :key="dev?.uuid" class="dropdown-item"
                                    @click.prevent="chooseDevEdit(dev)">{{
                                        dev?.name
                                    }}
                                  </a>
                                  <div class="dropdown-divider"></div>
                                  <a class="dropdown-item" @click.prevent="resetDevEdit(user_devEdit)">Reset</a>
                                </div>
                                <div class="mt-1">
                                  <div>
                                    <a class="text-muted">Pilihan Developer</a>
                                  </div>
                                  <div v-if="user_devEdit.length > 0">
                                    <button @click.prevent="delDevEdit(dev)" v-for="(dev) in user_devEdit" :key="dev"
                                      class="badge-secondary badge-pill m-1">
                                      {{ dev }}<span aria-hidden="true" class="ml-1">&times;</span></button>
                                  </div>
                                  <div v-else-if="user_devEdit.length = 0">
                                    <p class="text-danger">Isi dev terlebih dahulu</p>
                                  </div>
                                </div>
                                <div v-if="errors[0]" class="alert alert-danger mt-2" v-show="errors" role="alert">{{
                                    errors[0]
                                }}</div>
                              </div>
                            </validation-provider>
                          </div>
                          <div class="form-group">
                            <validation-provider>
                              <label for="drop_progEdit">Prog</label>
                              <div class="input-group mb-3">
                                <input name="drop_progEdit" v-model="drop_progEdit" type="text" class="form-control"
                                  placeholder="Prog">
                                <div class="input-group-append">
                                  <button class="btn btn-secondary" type="button"
                                    @click.prevent="chooseProgEdit()">tambah</button>
                                </div>
                              </div>
                              <div class="mt-1">
                                <div>
                                  <a class="text-muted">Pilihan No Prog</a>
                                </div>
                                <div v-if="no_progEdit.length > 0">
                                  <button @click="delProgEdit(prog)" v-for="(prog) in no_progEdit" :key="prog"
                                    class="badge-secondary badge-pill m-1">
                                    {{ prog }}<span aria-hidden="true" class="ml-1">&times;</span></button>
                                  <div>
                                    <a name="resetProg" id="resetProg" class="btn btn-secondary mt-2" href="#" role="button"
                                      @click.prevent="resetProgEdit()">Reset</a>
                                  </div>
                                </div>
                                <div v-else-if="no_prog.length == 0">
                                  <p class="text-danger">Isi Prog terlebih dahulu</p>
                                </div>
                              </div>
                            </validation-provider>
                          </div> -->
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal"
                    @click="xModalEdits()">Close</button>
                  <button class="btn btn-primary" type="submit" :disabled="invalid">
                    <span v-show="loading" class="spinner-border spinner-border-sm mr-1"></span>
                    <span>Edit Jadwal</span>
                  </button>
                </div>
              </form>
            </validation-observer>
          </div>
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
</template>

<script>
import axiosinstance from "@/services/axiosInstance";
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import moment from 'moment'

export default {
  name: "jadwalSA",
  components: {
    // modal,
    ValidationProvider,
    ValidationObserver,
    DatePicker,
  },
  data() {
    return {

      //Modal Create
      uuid_modul: "",
      modul_name: "",
      start_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
      drop_dev: [],
      user_dev: [],
      drop_prog: null,
      no_prog: [],
      createModulCat: false,
      catModul: null,
      modulCatLoad: false,

      //Modal Edit
      uuid_jadwal: "",
      uuid_modulEdit: "",
      name_modulEdit: "",
      start_dateEdit: "",
      end_dateEdit: "",
      start_timeEdit: "",
      end_timeEdit: "",
      drop_devEdit: [],
      user_devEdit: [],
      drop_progEdit: null,
      no_progEdit: [],

      //others
      user: "",
      loginType: "",
      uuidUser: "",
      nameUser: "",
      dataJadwal: [],
      dataModul: [],
      dataDev: [],
      dataUser: [],
      loading: false,
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
        this.uuidUser = response.data.msg.uuid;
        this.user = response.data;
        this.loginType = response.data.msg.role;
        this.nameUser = response.data.msg.name;

        this.getAllJadwal();
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
      axiosinstance.get("request/" + this.uuidUser)
        .then((response) => {
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
    getDataDev() {
      axiosinstance.get("user-dev/").then((response) => {
        this.dataDev = response.data;
        const y = this.dataDev;

        const d = y.length;
        for (let i = 0; i < d; i++) {
          this.drop_dev.push(y[i])
        }
        for (let i = 0; i < d; i++) {
          this.drop_devEdit.push(y[i])
        }
      });
    },
    formatDate(arr) {
      let formattedDate = moment(arr).format('DD MMM YYYY');

      return formattedDate;
    },

    //VeeValidate
    //Create Modal
    async submitCreate() {
      const isValid = await this.$refs.observerCreate.validate();
      console.log("Form is valid", isValid);
      if (isValid) {
        this.createForm();
      }
    },
    //Edit Modal
    async submitEdit() {
      const isValid = await this.$refs.observerEdit.validate();
      console.log("Form is valid", isValid);
      if (isValid) {
        this.updateJadwal();
      }
    },

    // Create Jadwal
    chooseCatModul() {
      this.modulCatLoad = true;
      this.uuid_modul = '';
      this.modul_name = '';
      this.createModulCat = true;
      axiosinstance.get('modul-kategori/' + this.catModul)
        .then(response => {
          this.modulCatLoad = false;
          this.dataModul = response.data.msg;
        })
        .catch(error => {
          this.modulCatLoad = false;
          error;
        })
    },
    chooseModul(modul) {
      this.uuid_modul = modul.uuid
      this.modul_name = modul.name_modul
    },
    chooseDev(dev) {
      this.user_dev.push(dev);
      const idx = this.drop_dev.indexOf(dev);
      this.drop_dev.splice(idx, 1);
    },
    delDev(dev) {
      this.drop_dev.push(dev);
      const idx = this.user_dev.indexOf(dev);
      this.user_dev.splice(idx, 1);
    },
    resetDev(user_dev) {
      const a = user_dev.length
      for (let i = 0; i < a; i++) {
        this.drop_dev.push(user_dev[i]);
      }
      for (let i = 0; i < a; i++) {
        this.user_dev.splice(0, 1);
      }
    },
    chooseProg() {
      if (this.drop_prog === null || this.drop_prog === "") {
        this.drop_prog = null;
      }
      else {
        this.no_prog.push(this.drop_prog);
        this.drop_prog = null;
      }
    },
    delProg(prog) {
      const idx = this.no_prog.indexOf(prog);
      this.no_prog.splice(idx, 1);
    },
    resetProg() {
      const a = this.no_prog.length
      for (let i = 0; i < a; i++) {
        this.no_prog.splice(0, 1);
      }
    },
    createForm() {
      if (this.start_date < moment().format("YYYY-MM-DD") || this.end_date < moment().format("YYYY-MM-DD")) {
        this.$toast.error("Start Date atau End Date tidak boleh kurang dari Tanggal Sekarang", {
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
      }
      else {
        const a = this.user_dev.length
        const npkUserDev = [];
        for (let i = 0; i < a; i++) {
          npkUserDev.push(this.user_dev[i].npk)
        }

        this.loading = true;
        this.btnDisabled = true;
        axiosinstance.post('request/', {
          uuid_modul: this.uuid_modul,
          start_date: this.start_date,
          end_date: this.end_date,
          start_time: this.start_time,
          end_time: this.end_time,
          user_dev: npkUserDev,
          no_prog: this.no_prog,
        })
          .then(response => {
            this.loading = false;
            this.btnDisabled = false;
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

            this.catModul = null
            this.uuid_modul = null
            this.modul_name = ""
            this.start_date = null
            this.end_date = null
            this.start_time = null
            this.end_time = null

            const a = this.user_dev.length
            for (let i = 0; i < a; i++) {
              this.drop_dev.push(this.user_dev[i]);
            }
            for (let i = 0; i < a; i++) {
              this.user_dev.splice(0, 1);
            }

            const b = this.no_prog.length
            for (let i = 0; i < b; i++) {
              this.no_prog.splice(0, 1);
            }
            this.$refs.observerCreate.reset();

            document.getElementById("exitCreate").click();
          })
          .catch(error => {
            this.loading = false;
            this.btnDisabled = false;

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
          })
      }
    },

    //Edit Modul
    chooseModulEdit(modul) {
      this.uuid_modulEdit = modul.uuid
      this.name_modulEdit = modul.name_modul
    },
    chooseDevEdit(dev) {
      this.user_devEdit.push(dev.npk);
      const idx = this.drop_devEdit.indexOf(dev);
      this.drop_devEdit.splice(idx, 1);
    },
    delDevEdit(dev) {

      const idx = this.user_devEdit.indexOf(dev);
      this.user_devEdit.splice(idx, 1);

      const d = this.dataDev.length;
      for (let i = 0; i < d; i++) {
        if (dev == this.dataDev[i].npk) {
          this.drop_devEdit.push(this.dataDev[i])
        }
      }
    },
    resetDevEdit(user_devEdit) {
      const a = user_devEdit.length
      for (let i = 0; i < a; i++) {
        this.user_devEdit.splice(0, 1);
      }

      const d = this.dataDev.length;
      for (let i = 0; i < d; i++) {
        this.drop_devEdit.splice(0, 1);
      }
      for (let a = 0; a < d; a++) {
        this.drop_devEdit.push(this.dataDev[a]);
      }
    },
    chooseProgEdit() {
      if (this.drop_progEdit === null || this.drop_progEdit === "") {
        this.drop_progEdit = null;
      }
      else {
        this.no_progEdit.push(this.drop_progEdit);
        this.drop_progEdit = null;
      }
    },
    delProgEdit(prog) {
      const idx = this.no_progEdit.indexOf(prog);
      this.no_progEdit.splice(idx, 1);
    },
    resetProgEdit() {
      const a = this.no_progEdit.length
      for (let i = 0; i < a; i++) {
        this.no_progEdit.splice(0, 1);
      }
    },

    modalEdits(data) {
      this.uuid_jadwal = data.uuid

      const x = this.dataModul
      const y = data.user_dev
      const z = data.trn_progs

      this.name_modulEdit = data?.modul?.name_modul

      const a = this.dataModul.length
      for (let i = 0; i < a; i++) {
        if (this.name_modulEdit == x[i].name_modul) {
          this.uuid_modulEdit = x[i].uuid
        }
      }

      this.start_dateEdit = data.start_date
      this.end_dateEdit = data.end_date
      this.start_timeEdit = data.start_time
      this.end_timeEdit = data.end_time

      const d = data.user_dev.length
      for (let i = 0; i < d; i++) {
        this.user_devEdit.push(y[i])
      }

      const b = this.drop_devEdit.length
      for (let f = 0; f < b; f++) {
        const a = this.user_devEdit.length
        for (let i = 0; i < a; i++) {
          if (this.drop_devEdit[f]?.npk == this.user_devEdit[i]) {
            this.drop_devEdit.splice(f, 1);
          }
        }
      }

      const c = data.trn_progs.length
      for (let i = 0; i < c; i++) {
        this.no_progEdit.push(z[i].no_prog)
      }
    },
    xModalEdits() {
      this.uuid_moduEdit = null
      this.name_modulEdit = ""
      this.start_dateEdit = null
      this.end_dateEdit = null
      this.start_timeEdit = null
      this.end_timeEdit = null

      const c = this.drop_devEdit.length
      for (let i = 0; i < c; i++) {
        this.drop_devEdit.splice(0, 1)
      }
      const y = this.dataDev;
      const d = y.length;
      for (let i = 0; i < d; i++) {
        this.drop_devEdit.push(y[i])
      }

      const a = this.user_devEdit.length
      for (let i = 0; i < a; i++) {
        this.user_devEdit.splice(0, 1);
      }

      const b = this.no_progEdit.length
      for (let i = 0; i < b; i++) {
        this.no_progEdit.splice(0, 1);
      }

      this.$refs.observerEdit.reset();
    },

    updateJadwal() {
      if (this.start_dateEdit < moment().format("YYYY-MM-DD") || this.end_dateEdit < moment().format("YYYY-MM-DD")) {
        this.$toast.error("Start Date atau End Date tidak boleh kurang dari Tanggal Sekarang", {
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
      }
      else {
        this.loading = true;
        this.btnDisabled = true;
        axiosinstance.patch('request/' + this.uuid_jadwal, {
          start_date: this.start_dateEdit,
          end_date: this.end_dateEdit,
          start_time: this.start_timeEdit,
          end_time: this.end_timeEdit,
        })
          .then(response => {
            this.loading = false;
            this.btnDisabled = false;
            this.getAllJadwal();

            document.getElementById("exitEdit").click();

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
          })
          .catch(error => {
            this.loading = false;
            this.btnDisabled = false;

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
          })
      }
    },

    // // Delete Modul
    // jadwalDeletes(data) {
    //   this.modalDelete = true
    //   this.modulUuid = modul.uuid
    //   this.modulNameDelete = modul.name_modul
    //   this.indexModul = modul

    // },

    userInfo(data) {
      axiosinstance.get("user-dev/").then((response) => {
        const dataAllUser = response.data;

        const a = dataAllUser.length
        for (let i = 0; i < a; i++) {
          if (dataAllUser[i].npk == data) {
            this.dataUser = dataAllUser[i]
          }
        }


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
  computed: {
    sortedItems() {
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
    this.getDataDev();

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