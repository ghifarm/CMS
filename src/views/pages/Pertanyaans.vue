<template>
  <div>
    <!-- Page Heading -->
    <h1 class="h3 mb-2 text-gray-800">Pertanyaan Untuk Penilaian</h1>
    <div class="row mb-3">
      <div class="col text-left">
        <p>Selamat Datang {{ loginType }} {{ nameUser }}</p>
      </div>
      <div class="col text-right">
        <button type="button" class="btn btn-primary text-center" data-toggle="modal" data-target="#createModal">
          <i class="bx bx-list-plus"></i>
          Buat Pertanyaan
        </button>
      </div>
    </div>
    <!-- <button type="button" class="mb-3 btn btn-info" @click="modalCreate = !modalCreate">Buat Modul</button> -->

    <!-- DataTales Example -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-2 font-weight-bold text-primary">Pertanyaan</h6>
      </div>
      <div class="card-body">
        <div v-if="dataQuestion.length > 0" class="table-responsive">
          <table class="table" id="dataTable" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th>No</th>
                <th>Pertanyaan</th>
                <th>Tipe Pertanyaan</th>
                <th></th>
              </tr>
            </thead>
            <tr v-for="(question, index) in dataQuestion" :key="question.uuid">
              <td>{{ index + 1 }}</td>
              <td>{{ question.question }}</td>
              <td>{{ typeQuestion(question.type_question) }}</td>
              <td class="text-center">
                <button type="button" class="m-1 btn btn-primary" data-toggle="modal" data-target="#editModal"
                  @click="modalEdits(question)"><i class='bx bxs-edit-alt'></i></button>
                <button type="button" class="m-1 btn btn-danger" data-toggle="modal" data-target="#deleteModal"
                  @click="modalDeletes(question)">
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

        <div v-else-if="dataQuestion.length == 0" class="card-deck">
          <div class="card">
            <div class="card-body text-center">
              <h4 class="card-title">Data Pertanyaan Kosong</h4>
              <img src="..\src\assets\3371471.jpg"
                class="img-fluid ${3|rounded-top,rounded-right,rounded-bottom,rounded-left,rounded-circle,|}"
                width="300px" alt="">
              <p class="card-text">Tambahkan Data Pertanyaan Terlebih Dahulu</p>
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
            <h5 class="modal-title" id="createModalLabel">Buat Pertanyaan</h5>
            <button id="exitCreate" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <validation-observer v-slot="{ invalid }" ref="observerCreate">
              <form name="createModul" @submit.prevent="submitCreate()">
                <div class="form-group">
                  <validation-provider name="Pertanyaan" rules="required" v-slot="{ errors }">
                    <label for="questions">Pertanyaan</label>
                    <div class="input-group mb-3">
                      <input name="questions" v-model="questions" type="text" class="form-control"
                        placeholder="Pertanyaan">
                      <div class="input-group-append">
                        <span class="input-group-text">?</span>
                      </div>
                      <div class="text-danger input-group">
                        <small>{{ errors[0] }}</small>
                      </div>
                    </div>
                  </validation-provider>
                </div>
                <div class="form-group">
                  <label for="type_question">Tipe Pertanyaan</label>
                  <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownTipePertanyaan"
                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <a v-if="(type_question == null)">Pilih Tipe Pertanyaan</a>
                      <a v-else>{{ typeQuestion(type_question) }}</a>
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownTipePertanyaan">
                      <a href="" class="dropdown-item" @click.prevent="type_question = '0'">Isian</a>
                      <a href="" class="dropdown-item" @click.prevent="type_question = '1'">Rating</a>
                      <div class="dropdown-divider"></div>
                      <a href="" class="dropdown-item" @click.prevent="type_question = null">Reset</a>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button class="btn btn-primary" type="submit" :disabled="invalid">
                    <span v-show="loading" class="spinner-border spinner-border-sm mr-1"></span>
                    <span>Buat Pertanyaan</span>
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
                  <validation-provider name="Pertanyaan" rules="required" v-slot="{ errors }">
                    <label for="questionsEdit">Pertanyaan</label>
                    <div class="input-group mb-3">
                      <input name="questionsEdit" v-model="questionsEdit" type="text" class="form-control"
                        placeholder="Pertanyaan">
                      <div class="input-group-append">
                        <span class="input-group-text">?</span>
                      </div>
                      <div class="text-danger input-group">
                        <small>{{ errors[0] }}</small>
                      </div>
                    </div>
                  </validation-provider>
                </div>
                <div class="form-group">
                  <label for="type_questionEdit">Tipe Pertanyaan</label>
                  <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownTipePertanyaanEdit"
                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <a v-if="(type_questionEdit == null)">Pilih Tipe Pertanyaan</a>
                      <a v-else>{{ typeQuestion(type_questionEdit) }}</a>
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownTipePertanyaanEdit">
                      <a type="button" class="dropdown-item" @click.prevent="type_questionEdit = '1'">Rating</a>
                      <a type="button" class="dropdown-item" @click.prevent="type_questionEdit = '0'">Isian</a>
                      <div class="dropdown-divider"></div>
                      <a type="button" class="dropdown-item" @click.prevent="type_questionEdit = null">Reset</a>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal"
                    @click="xModalEdits()">Close</button>
                  <button class="btn btn-primary" type="submit" v-bind:disabled="invalid">
                    <span v-show="loading" class="spinner-border spinner-border-sm mr-1"></span>
                    <span>Edit Pertanyaan</span>
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
            <h5 class="modal-title" id="deleteModalLabel">Hapus Pertanyaan</h5>
            <button id="exitDelete" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div>
              <h5 class="card-title">Apakah anda yakin untuk menghapus pertanyaan ini ?</h5>
              <h6 class="card-text text-danger">{{ questionsDelete }}</h6>
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
// import $ from 'jquery';

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
      questions: "",
      type_question: null,

      //Modal Edit
      questionUuid: "",
      questionsEdit: "",
      type_questionEdit: null,

      //Modal Edit
      questionsDelete: "",
      indexQuestion: [],

      user: '',
      loginType: '',
      nameUser: '',
      dataQuestion: [],
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
    getAllQuestion() {
      axiosinstance.get('question/')
        .then(response => {
          this.dataQuestion = response.data.msg;

          if (!(this.dataQuestion.length < this.indexEnd)) {
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
    typeQuestion(type_question) {
      if (type_question == '1') {
        type_question = "Rating"
      } else {
        type_question = "Isian"
      }
      return type_question;
    },

    //VeeValidate
    //Create Modal
    async submitCreate() {
      const isValid = await this.$refs.observerCreate.validate();
      console.log("Form is valid", isValid);
      if (isValid) {
        this.createForm()
      }
    },
    //Edit Modal
    async submitEdit() {
      const isValid = await this.$refs.observerEdit.validate();
      console.log("Form is valid", isValid);
      if (isValid) {
        this.EditForm()
      }
    },

    //Create Modul
    createForm() {
      this.loading = true;
      axiosinstance.post('question/', {
        question: this.questions + " ?",
        type_question: this.type_question,
      })
        .then(response => {
          this.loading = false;
          this.getAllQuestion();

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
          this.questions = null
          this.type_question = null
          this.$refs.observerCreate.reset();
        })
        .catch(error => {
          this.loading = false;

          this.$toast.error(error.response.data.msg[0].msg, {
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
    },

    //Edit Modul
    modalEdits(questions) {
      this.questionUuid = questions.uuid
      const str = questions.question
      const str2 = str.charAt(0).toUpperCase() + str.slice(1, str.length - 2, str.length - 1);
      this.questionsEdit = str2
      this.type_questionEdit = questions.type_question
    },
    xModalEdits() {
      this.questionUuid = null
      this.questionsEdit = null
      this.type_questionEdit = null
      this.$refs.observerEdit.reset();
    },

    EditForm() {
      this.loading = true;
      axiosinstance.patch('question/' + this.questionUuid, {
        question: this.questionsEdit + " ?",
        type_question: this.type_questionEdit,
      })
        .then(response => {
          this.loading = false;
          this.getAllQuestion();

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
          this.loading = false;

          this.$toast.error(error.response.data.msg[0].msg, {
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
    },

    //Delete Modul
    modalDeletes(questions) {
      this.questionUuid = questions.uuid
      this.questionsDelete = questions.question
      this.indexQuestion = questions
    },

    modulDeletes() {
      this.loading = true
      axiosinstance.delete('question/' + this.questionUuid)
        .then(response => {
          this.loading = false;

          const idx = this.dataQuestion.indexOf(this.indexQuestion);
          this.dataQuestion.splice(idx, 1);

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

      if (!(this.dataQuestion.length < this.indexEnd)) {
        this.nextDis = ""
      } else {
        this.nextDis = "disabled"
      }
    },
    next() {
      if (!(this.dataQuestion.length < this.indexEnd)) {
        this.current++;
      }

      if (!(this.dataQuestion.length < this.indexEnd)) {
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

      if (!(this.dataQuestion.length < this.indexEnd)) {
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
    this.getAllQuestion();
  },
  computed: {
    indexStart() {
      return (this.current - 1) * this.pageSize;
    },
    indexEnd() {
      return this.indexStart + this.pageSize;
    },
    paginated() {
      return this.dataQuestion.slice(this.indexStart, this.indexEnd);
    },
    pageNumber() {
      const y = this.dataQuestion.length
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

<style>@import url('https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css');</style>