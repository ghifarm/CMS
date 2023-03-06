<template>
  <div>
    <!-- Page Heading -->
    <h1 class="h3 mb-2 text-gray-800">Modul</h1>
    <div class="row mb-3">
      <div class="col text-left">
        <p>Selamat Datang {{ loginType }} {{ nameUser }}</p>
      </div>
      <div class="col text-right">
        <button type="button" class="btn btn-primary text-center" data-toggle="modal" data-target="#createModal">
          <i class="bx bxs-layer-plus"></i>
          Buat Modul
        </button>
      </div>
    </div>
    <!-- <button type="button" class="mb-3 btn btn-info" @click="modalCreate = !modalCreate">Buat Modul</button> -->

    <!-- DataTales Example -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-2 font-weight-bold text-primary">MODUL</h6>
      </div>
      <div class="card-body">
        <div v-if="dataModul.length > 0" class="table-responsive">
          <table class="table" id="dataTable" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Modul</th>
                <th>Path</th>
                <th>Kategori Modul</th>
                <th></th>
              </tr>
            </thead>
            <tr v-for="(modul, index) in dataModul" :key="modul.uuid">
              <td>{{ index + 1 }}</td>
              <td>{{ modul.name_modul }}</td>
              <td>{{ modul.path }}</td>
              <td>{{ modul.kategori_modul }}</td>
              <td class="text-center">
                <button type="button" class="m-1 btn btn-primary" data-toggle="modal" data-target="#editModal"
                  @click="modalEdits(modul)"><i class='bx bxs-edit-alt'></i></button>
                <button type="button" class="m-1 btn btn-danger" data-toggle="modal" data-target="#deleteModal"
                  @click="modalDeletes(modul)">
                  <i class='bx bxs-trash-alt'></i>
                </button>
              </td>
            </tr>
          </table>
          <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="prevDis">
                <a class="page-link" @click.prevent="prev" href="">Prev</a>
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

        <div v-else-if="dataModul.length == 0" class="card-deck">
          <div class="card">
            <div class="card-body text-center">
              <h4 class="card-title">Data Modul Kosong</h4>
              <img src="..\src\assets\3371471.jpg"
                class="img-fluid ${3|rounded-top,rounded-right,rounded-bottom,rounded-left,rounded-circle,|}"
                width="300px" alt="">
              <p class="card-text">Tambahkan Data Modul Terlebih Dahulu</p>
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
            <h5 class="modal-title" id="createModalLabel">Buat Modul</h5>
            <button id="exitCreate" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <validation-observer v-slot="{ invalid }" ref="observerCreate">
              <form name="createModul" @submit.prevent="submitCreate()">
                <div class="form-group">
                  <validation-provider name="Nama Modul" rules="required" v-slot="{ errors }">
                    <label for="modulName">Nama Modul</label>
                    <input name="modulName" v-model="modulName" type="text" class="form-control" placeholder="Nama Modul">
                    <div class="text-danger input-group">
                      <small>{{ errors[0] }}</small>
                    </div>
                  </validation-provider>
                </div>
                <div class="form-group">
                  <validation-provider name="Path" rules="required" v-slot="{ errors }">
                    <label for="path">Path</label>
                    <input name="path" v-model="path" type="text" class="form-control" placeholder="Path">
                    <div class="text-danger input-group">
                      <small>{{ errors[0] }}</small>
                    </div>
                  </validation-provider>
                </div>
                <div class="form-group">
                  <label for="modulCat">Kategori Modul</label>
                  <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownModul"
                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <a v-if="(modulCat == null)">Pilih Kategori Modul</a>
                      <a v-else>{{ modulCat }}</a>
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownModul">
                      <a href="" class="dropdown-item" @click.prevent="modulCat = '172.16.4.160'">172.16.4.160</a>
                      <a href="" class="dropdown-item" @click.prevent="modulCat = '172.16.4.161'">172.16.4.161</a>
                      <div class="dropdown-divider"></div>
                      <a href="" class="dropdown-item" @click.prevent="modulCat = null">Reset</a>
                    </div>
                  </div>
                  <div class="text-danger input-group">
                    <small>{{ errors[0] }}</small>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button class="btn btn-primary" type="submit" v-bind:disabled="invalid">
                    <span v-show="loading" class="spinner-border spinner-border-sm mr-1"></span>
                    <span>Buat Modul</span>
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
            <h5 class="modal-title" id="editModalLabel">Buat Modul</h5>
            <button id="exitEdit" type="button" class="close" data-dismiss="modal" aria-label="Close"
              @click="xModalEdits()">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <validation-observer v-slot="{ invalid }" ref="observerEdit">
              <form name="editModul" @submit.prevent="submitEdit()">
                <div class="form-group">
                  <validation-provider name="Nama Modul" rules="required" v-slot="{ errors }">
                    <label for="modulNameEdit">Nama Modul</label>
                    <input name="modulNameEdit" v-model="modulNameEdit" type="text" class="form-control"
                      placeholder="Nama Modul">
                    <div class="text-danger input-group">
                      <small>{{ errors[0] }}</small>
                    </div>
                  </validation-provider>
                </div>
                <div class="form-group">
                  <validation-provider name="Path" rules="required" v-slot="{ errors }">
                    <label for="pathEdit">Path</label>
                    <input name="pathEdit" v-model="pathEdit" v-validate="'required|min:3'" type="text"
                      class="form-control" placeholder="Path">
                    <div class="text-danger input-group">
                      <small>{{ errors[0] }}</small>
                    </div>
                  </validation-provider>
                </div>
                <div class="form-group">
                  <label for="modulCatEdit">Kategori Modul</label>
                  <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownModulEdit"
                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <a v-if="(modulCatEdit == null)">Pilih Kategori Modul</a>
                      <a v-else>{{ modulCatEdit }}</a>
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownModulEdit">
                      <a href="" class="dropdown-item" @click.prevent="modulCatEdit = '172.16.4.160'">172.16.4.160</a>
                      <a href="" class="dropdown-item" @click.prevent="modulCatEdit = '172.16.4.161'">172.16.4.161</a>
                      <div class="dropdown-divider"></div>
                      <a href="" class="dropdown-item" @click.prevent="modulCatEdit = null">Reset</a>
                    </div>
                  </div>
                  <div class="text-danger input-group">
                    <small>{{ errors[0] }}</small>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal"
                    @click="xModalEdits()">Close</button>
                  <button class="btn btn-primary" type="submit" v-bind:disabled="invalid">
                    <span v-show="loading" class="spinner-border spinner-border-sm mr-1"></span>
                    <span>Edit Modul</span>
                  </button>
                </div>
              </form>
            </validation-observer>
          </div>
        </div>
      </div>
    </div>

    <!-- delete modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Hapus User</h5>
            <button id="exitDelete" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div>
              <h5 class="card-title">Apakah anda yakin untuk menghapus modul ini ?</h5>
              <h6 class="card-text text-danger">{{ modulNameDelete }}</h6>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-danger" @click="modulDeletes()">
              <span v-show="loading" class="spinner-border spinner-border-sm mr-1"></span>
              Hapus</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axiosinstance from '@/services/axiosInstance';
import { ValidationProvider, ValidationObserver } from 'vee-validate';

export default {
  name: "home",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      //Modul ID
      modulUuid: "",

      //Modal Create
      modulName: "",
      path: "",
      modulCat: null,

      //Modal Edit
      modulNameEdit: "",
      pathEdit: "",
      modulCatEdit: null,

      //Modal Edit
      modulNameDelete: "",
      indexModul: [],

      user: '',
      loginType: '',
      nameUser: '',
      dataModul: [],
      loading: false,
      message: "",

      //pagination
      current: 1,
      pageSize: 10,
      pageMuch: 1,

      //component
      prevDis: "",
      nextDis: "",
    }
  },
  created() {
    axiosinstance.get('me/')
      .then(response => {
        this.user = response.data
        this.loginType = response.data.msg.role
        this.nameUser = response.data.msg.name
      })
  },
  methods: {
    getAllModul() {
      axiosinstance.get('modul/')
        .then(response => {
          this.dataModul = response.data.msg;

          if (!(this.dataModul.length < this.indexEnd)) {
            this.nextDis = ""
          } else {
            this.nextDis = "disabled"
          }

          if (!(this.current == 1)) {
            this.prevDis = ""
          } else {
            this.prevDis = "disabled"
          }
        })
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
        this.updateModul();
      }
    },

    //Create Modul
    createForm() {
      this.loading = true;
      axiosinstance.post('modul/', {
        name_modul: this.modulName,
        path: this.path,
        kategori: this.modulCat,
      })
        .then(response => {
          this.loading = false;
          this.getAllModul();

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

          document.getElementById("exitCreate").click();
          this.modulUuid = null
          this.modulName = null
          this.path = null
          this.modulCat = null
          this.$refs.observerCreate.reset();
        })
        .catch(error => {
          this.loading = false;
          this.messages = error.messages;

          if (error.response.status === 402) {
            this.$toast.error("nama modul atau path sudah ada", {
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
        })
    },

    //Edit Modul
    modalEdits(modul) {
      this.modulUuid = modul.uuid
      this.modulNameEdit = modul.name_modul
      this.pathEdit = modul.path
      this.modulCatEdit = modul.kategori_modul
    },
    xModalEdits() {
      this.modulUuid = null
      this.modulNameEdit = null
      this.pathEdit = null
      this.modulCatEdit = null
      this.$refs.observerEdit.reset();
    },

    updateModul() {
      this.loading = true;
      axiosinstance.patch('modul/' + this.modulUuid, {
        name_modul: this.modulNameEdit,
        path: this.pathEdit,
        kategori: this.modulCatEdit,
      })
        .then(response => {
          this.loading = false;
          this.getAllModul();

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

          document.getElementById("exitEdit").click();
        })
        .catch(error => {
          console.log(error)
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
          console.clear();
        })
    },

    //Delete Modul
    modalDeletes(modul) {
      this.modulUuid = modul.uuid
      this.modulNameDelete = modul.name_modul
      this.indexModul = modul

    },

    modulDeletes() {
      this.loading = true
      axiosinstance.delete('modul/', {
        params: { 'id': this.modulUuid }
      })
        .then(response => {
          this.loading = false;

          const idx = this.dataModul.indexOf(this.indexModul);
          this.dataModul.splice(idx, 1);

          this.$toast.error(response.data.msg, {
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

          document.getElementById("exitDelete").click();
        })
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

      if (!(this.dataModul.length < this.indexEnd)) {
        this.nextDis = ""
      } else {
        this.nextDis = "disabled"
      }
    },
    next() {
      if (!(this.dataModul.length < this.indexEnd)) {
        this.current++;
      }

      if (!(this.dataModul.length < this.indexEnd)) {
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

      if (!(this.dataModul.length < this.indexEnd)) {
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
    this.getAllModul();
  },
  computed: {
    indexStart() {
      return (this.current - 1) * this.pageSize;
    },
    indexEnd() {
      return this.indexStart + this.pageSize;
    },
    paginated() {
      return this.dataModul.slice(this.indexStart, this.indexEnd);
    },
    pageNumber() {
      const y = this.dataModul.length
      let x = 0
      for (let i = 0; i < y; i++) {
        if (i % 10 === 0) {
          x++;
        }
      }
      return x
    },
  },
}
</script>

<style>
@import url('https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css');
</style>