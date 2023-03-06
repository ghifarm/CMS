<template>
    <div>
        <!-- Page Heading -->
        <h1 class="h3 mb-2 text-gray-800">User</h1>
        <div class="row mb-3">
            <div class="col text-left">
                <p>Selamat Datang {{ loginType }} {{ nameUser }}</p>
            </div>
            <div class="col text-right">
                <button type="button" class="btn btn-primary text-center" data-toggle="modal" data-target="#createModal">
                    <i class="bx bxs-user-plus"></i>
                    Register User
                </button>
            </div>
        </div>

        <!-- DataTales Example -->
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-2 font-weight-bold text-primary">USER</h6>
            </div>
            <div class="card-body">
                <div v-if="dataUsers.length > 0" class="table-responsive">
                    <table class="table" id="dataTable" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>NPK</th>
                                <th>Nama</th>
                                <th>Role</th>
                                <th>Employee</th>
                                <th>Status</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tr v-for="(user, index) in paginated" :key="user.uuid">
                            <td>{{ indexNumber(index) }}</td>
                            <td>{{ user.npk }}</td>
                            <td>{{ user.name }}</td>
                            <td>{{ user.role }}</td>
                            <td>{{ user.employee }}</td>
                            <td>{{ user.emp_status }}</td>
                            <td>{{ user.email }}</td>
                            <td>{{ user.phone }}</td>
                            <td class="text-center">
                                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editModal"
                                    @click="userEdits(user)">
                                    <i class='bx bxs-edit-alt'></i>
                                </button>
                                <button type="button" class="m-1 btn btn-danger" data-toggle="modal"
                                    data-target="#deleteModal" @click="userDeletes(user)">
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

                <div v-else-if="dataUsers.length == 0" class="card-deck">
                    <div class="card">
                        <div class="card-body text-center">
                            <h4 class="card-title">Data User Kosong</h4>
                            <img src="..\src\assets\3371471.jpg"
                                class="img-fluid ${3|rounded-top,rounded-right,rounded-bottom,rounded-left,rounded-circle,|}"
                                width="300px" alt="">
                            <p class="card-text">Daftarkan User Terlebih Dahulu</p>
                        </div>
                    </div>
                </div>

                <div v-else class="card-deck">
                    <div class="card">
                        <div class="card-body text-center">
                            <h4 class="card-title">Data User Loading</h4>
                            <p class="card-text">Daftarkan User Terlebih Dahulu</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Modal -->
        <div class="modal fade" id="createModal" tabindex="-1" role="dialog" aria-labelledby="createLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="createLabel">Register User Baru</h5>
                        <button id="exitCreate" type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <validation-observer v-slot="{ invalid }" ref="observerCreate">
                            <form name="createUser" @submit.prevent="submitCreate">
                                <div class="container">
                                    <div class="row">
                                        <div class="form-group col">
                                            <validation-provider name="NPK" rules="required" v-slot="{ errors }">
                                                <label for="npk">NPK</label>
                                                <input name="npk" v-model="npk" type="number" class="form-control"
                                                    placeholder="NPK">
                                                <div class="text-danger input-group">
                                                    <small>{{ errors[0] }}</small>
                                                </div>
                                            </validation-provider>
                                        </div>
                                        <div class="form-group col">
                                            <label for="role">Role</label>
                                            <div class="dropdown">
                                                <button class="btn btn-secondary dropdown-toggle" type="button"
                                                    id="dropdownRole" data-toggle="dropdown" aria-haspopup="true"
                                                    aria-expanded="false">
                                                    <a v-if="role == null">Pilih Role</a>
                                                    <a v-else>{{ role }}</a>
                                                </button>
                                                <div class="dropdown-menu" aria-labelledby="dropdownRole">
                                                    <a type="button" class="dropdown-item" @click="role = 'SA'">SA</a>
                                                    <a type="button" class="dropdown-item" @click="role = 'ADMIN'">ADMIN</a>
                                                    <a type="button" class="dropdown-item"
                                                        @click="role = 'DEV'">DEVELOPER</a>
                                                    <div class="dropdown-divider"></div>
                                                    <a type="button" class="dropdown-item" @click="role = null">Reset</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group col">
                                    <validation-provider name="Nama Karyawan" rules="required" v-slot="{ errors }">
                                        <label for="empName">Nama Karyawan</label>
                                        <input name="empName" v-model="empName" type="text" class="form-control"
                                            placeholder="Nama Karyawan">
                                        <div class="text-danger input-group">
                                            <small>{{ errors[0] }}</small>
                                        </div>
                                    </validation-provider>
                                </div>
                                <div class="container">
                                    <div class="row">
                                        <div class="form-group col">
                                            <validation-provider name="Karyawan Dari" rules="required" v-slot="{ errors }">
                                                <label for="employee">Karyawan Dari</label>
                                                <input name="employee" v-model="employee" type="text" class="form-control"
                                                    placeholder="Asal Karyawan">
                                                <div class="text-danger input-group">
                                                    <small>{{ errors[0] }}</small>
                                                </div>
                                            </validation-provider>
                                        </div>
                                        <div class="form-group col">
                                            <validation-provider name="Status Karyawan" rules="required"
                                                v-slot="{ errors }">
                                                <label for="empStatus">Status Karyawan</label>
                                                <input name="empStatus" v-model="empStatus" type="text" class="form-control"
                                                    placeholder="Status Karyawan">
                                                <div class="text-danger input-group">
                                                    <small>{{ errors[0] }}</small>
                                                </div>
                                            </validation-provider>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group col">
                                    <validation-provider name="No Telefon" rules="required" v-slot="{ errors }">
                                        <label for="phone">No Telefon</label>
                                        <div class="input-group mb-3">
                                            <input name="phone" v-model="phone" type="text" class="form-control"
                                                placeholder="No Telefon" :disabled="vTelefonCreate">
                                            <div class="input-group-append">
                                                <button class="btn btn-secondary" type="button"
                                                    @click.prevent="createVerifikasi">Verifikasi</button>
                                            </div>
                                            <div class="text-danger input-group">
                                                <small>{{ errors[0] }}</small>
                                            </div>
                                            <div class="text-danger input-group">
                                                <small>*Pastikan No Telefon Telah Diverifikasi</small>
                                            </div>
                                        </div>
                                    </validation-provider>
                                </div>
                                <div class="form-group col">
                                    <validation-provider name="Email" rules="required|email" v-slot="{ errors }">
                                        <label for="email">Email</label>
                                        <input name="email" v-model="email" type="email" class="form-control"
                                            placeholder="Email">
                                        <div class="text-danger input-group">
                                            <small>{{ errors[0] }}</small>
                                        </div>
                                    </validation-provider>
                                </div>
                                <div class="container">
                                    <div class="row">
                                        <div class="form-group col">
                                            <validation-provider name="Password" rules="required" v-slot="{ errors }">
                                                <label for="password">Password</label>
                                                <input name="password" v-model="password" type="password"
                                                    class="form-control" placeholder="Password">
                                                <div class="text-danger input-group">
                                                    <small>{{ errors[0] }}</small>
                                                </div>
                                            </validation-provider>
                                        </div>
                                        <div class="form-group col">
                                            <validation-provider name="Confirm Password" rules="required"
                                                v-slot="{ errors }">
                                                <label for="cfrmPassword">Confirm Password</label>
                                                <input name="cfrmPassword" v-model="cfrmPassword" type="password"
                                                    class="form-control" placeholder="Confirm Password">
                                                <div class="text-danger input-group">
                                                    <small>{{ errors[0] }}</small>
                                                </div>
                                            </validation-provider>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="submit" class="btn btn-primary" v-bind:disabled="invalid">
                                        <span v-show="loading" class="spinner-border spinner-border-sm mr-1"></span>
                                        <span>Daftar</span>
                                    </button>
                                </div>
                            </form>
                        </validation-observer>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Modal -->
        <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editLabel">Edit User</h5>
                        <button id="exitEdit" type="button" class="close" data-dismiss="modal" aria-label="Close"
                            @click="xUserEdits()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <validation-observer v-slot="{ invalid }" ref="observerEdit">
                            <form name="createUser" @submit.prevent="submitEdit">
                                <div class="container">
                                    <div class="row">
                                        <div class="form-group col">
                                            <validation-provider name="NPK" rules="required" v-slot="{ errors }">
                                                <label for="npkEdit">NPK</label>
                                                <input name="npkEdit" v-model="npkEdit" type="number" class="form-control"
                                                    placeholder="NPK">
                                                <div class="text-danger input-group">
                                                    <small>{{ errors[0] }}</small>
                                                </div>
                                            </validation-provider>
                                        </div>
                                        <div class="form-group col">
                                            <label for="roleEdit">Role</label>
                                            <div class="dropdown">
                                                <button class="btn btn-secondary dropdown-toggle" type="button"
                                                    id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                                                    aria-expanded="false">
                                                    <a v-if="roleEdit == null">Pilih Role</a>
                                                    <a v-else>{{ roleEdit }}</a>
                                                </button>
                                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                    <a type="button" class="dropdown-item" @click="roleEdit = 'SA'">SA</a>
                                                    <a type="button" class="dropdown-item"
                                                        @click="roleEdit = 'ADMIN'">ADMIN</a>
                                                    <a type="button" class="dropdown-item"
                                                        @click="roleEdit = 'DEV'">DEVELOPER</a>
                                                    <div class="dropdown-divider"></div>
                                                    <a type="button" class="dropdown-item"
                                                        @click="roleEdit = null">Reset</a>
                                                </div>
                                                <div class="text-danger input-group">
                                                    <small>{{ errors[0] }}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group col">
                                    <validation-provider name="Nama Karyawan" rules="required" v-slot="{ errors }">
                                        <label for="empNameEdit">Nama Karyawan</label>
                                        <input name="empNameEdit" v-model="empNameEdit" type="text" class="form-control"
                                            placeholder="Nama Karyawan">
                                        <div class="text-danger input-group">
                                            <small>{{ errors[0] }}</small>
                                        </div>
                                    </validation-provider>
                                </div>
                                <div class="container">
                                    <div class="row">
                                        <div class="form-group col">
                                            <validation-provider name="Karyawan dari" rules="required" v-slot="{ errors }">
                                                <label for="employeeEdit">Karyawan Dari</label>
                                                <input name="employeeEdit" v-model="employeeEdit" type="text"
                                                    class="form-control" placeholder="Asal Karyawan">
                                                <div class="text-danger input-group">
                                                    <small>{{ errors[0] }}</small>
                                                </div>
                                            </validation-provider>
                                        </div>
                                        <div class="form-group col">
                                            <validation-provider name="Status Karyawan" rules="required"
                                                v-slot="{ errors }">
                                                <label for="empStatusEdit">Status Karyawan</label>
                                                <input name="empStatusEdit" v-model="empStatusEdit" type="text"
                                                    class="form-control" placeholder="Status Karyawan">
                                                <div class="text-danger input-group">
                                                    <small>{{ errors[0] }}</small>
                                                </div>
                                            </validation-provider>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group col">
                                    <validation-provider name="No Telefon" rules="required" v-slot="{ errors }">
                                        <label for="phoneEdit">No Telefon</label>
                                        <div class="input-group mb-3">
                                            <input name="phoneEdit" v-model="phoneEdit" type="text" class="form-control"
                                                placeholder="No Telefon" :disabled="vTelefonEdit">
                                            <div class="input-group-append">
                                                <button class="btn btn-secondary" type="button"
                                                    @click.prevent="editVerifikasi">Verifikasi</button>
                                            </div>
                                            <div class="text-danger input-group">
                                                <small>{{ errors[0] }}</small>
                                            </div>
                                            <div class="text-danger input-group">
                                                <small>*Pastikan No Telefon Telah Diverifikasi</small>
                                            </div>
                                        </div>
                                    </validation-provider>
                                </div>
                                <div class="form-group col">
                                    <validation-provider name="Email" rules="required|email" v-slot="{ errors }">
                                        <label for="emailEdit">Email</label>
                                        <input name="emailEdit" v-model="emailEdit" type="email" class="form-control"
                                            placeholder="Email">
                                        <div class="text-danger input-group">
                                            <small>{{ errors[0] }}</small>
                                        </div>
                                    </validation-provider>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal"
                                        @click="xUserEdits()">Close</button>
                                    <button type="submit" class="btn btn-primary" v-bind:disabled="invalid">
                                        <span v-show="loading" class="spinner-border spinner-border-sm mr-1"></span>
                                        <span>Edit</span>
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
                        <h5 class="card-title">Apakah anda yakin untuk menghapus user ini ?</h5>
                        <h6 class="card-text text-danger">{{ empNameDelete }}</h6>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-danger" @click="deleteForm()">
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
    name: "UserAdmin",
    components: {
        ValidationProvider,
        ValidationObserver,
    },
    data() {
        return {

            //User Create
            npk: "",
            role: null,
            employee: "",
            empStatus: "",
            password: "",
            cfrmPassword: "",
            email: "",
            empName: "",
            phone: "",

            //User Edit
            userUuid: "",
            npkEdit: "",
            roleEdit: null,
            employeeEdit: "",
            empStatusEdit: "",
            passwordEdit: "",
            cfrmPasswordEdit: "",
            emailEdit: "",
            empNameEdit: "",
            phoneEdit: "",

            //User Delete
            empNameDelete: "",
            indexUser: [],

            //others
            user: '',
            loginType: '',
            nameUser: '',
            dataUsers: [],
            loading: false,
            message: "",
            btnDisabled: true,
            btnDisabledE: true,
            vTelefonCreate: false,
            vTelefonEdit: false,

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
        getAllUser() {
            axiosinstance.get('users/')
                .then(response => {
                    this.dataUsers = response.data;

                    if (!(this.dataUsers.length < this.indexEnd)) {
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
                if (this.btnDisabled == true) {
                    this.$toast.error("Verifikasi No Telefon terlebih dahulu", {
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
                } else {
                    if (this.password !== this.cfrmPassword) {
                        this.loading = false;
                        this.$toast.error("Password konfirmasi belum sesuai", {
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
                    } else {
                        this.createForm()
                    }
                }
            }
        },
        //Edit Modal
        async submitEdit() {
            const isValid = await this.$refs.observerEdit.validate();
            console.log("Form is valid", isValid);
            if (isValid) {
                if (this.btnDisabledE == true) {
                    this.$toast.error("Verifikasi No Telefon terlebih dahulu", {
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
                } else {
                    this.updateForm()
                }
            }
        },

        //Create Modul
        createVerifikasi() {
            axiosinstance.post('cekwhatsaap/', {}, {
                params: { nomor: this.phone }
            })
                .then(response => {
                    this.phone = response.data.msg.user;
                    this.vTelefonCreate = true;
                    this.$toast.success("Nomor Terdaftar di Whatsapp", {
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
                    this.btnDisabled = false
                })
                .catch(error => {
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
        },
        createForm() {
            this.loading = true;
            axiosinstance.post('users/', {
                npk: this.npk,
                role: this.role,
                employee: this.employee,
                emp_status: this.empStatus,
                password: this.password,
                email: this.email,
                name: this.empName,
                phone: this.phone
            })
                .then(response => {
                    this.loading = false;

                    document.getElementById("exitCreate").click();
                    this.getAllUser();

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

                    this.npk = null;
                    this.role = null;
                    this.employee = null;
                    this.empStatus = null;
                    this.password = null;
                    this.cfrmPassword = null;
                    this.email = null;
                    this.empName = null;
                    this.phone = null;
                    this.vTelefonCreate = false;
                    this.btnDisabled = true;
                    this.$refs.observerCreate.reset();
                })
                .catch(error => {
                    console.clear()
                    this.loading = false;
                    this.messages = error.messages;
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
        userEdits(user) {
            this.userUuid = user?.uuid;
            this.npkEdit = user?.npk;
            this.roleEdit = user?.role;
            this.employeeEdit = user?.employee;
            this.empStatusEdit = user?.emp_status;
            this.passwordEdit = null;
            this.emailEdit = user?.email;
            this.empNameEdit = user?.name;
            this.phoneEdit = user?.phone;
        },
        xUserEdits() {
            this.userUuid = null;
            this.npkEdit = null;
            this.roleEdit = null;
            this.employeeEdit = null;
            this.empStatusEdit = null;
            // this.passwordEdit = user?.;
            this.emailEdit = null;
            this.empNameEdit = null;
            this.phoneEdit = null;
            this.$refs.observerEdit.reset();
            this.btnDisabled = true
        },
        editVerifikasi() {
            axiosinstance.post('cekwhatsaap/', {}, {
                params: { nomor: this.phoneEdit }
            })
                .then(response => {
                    this.phoneEdit = response.data.msg.user;
                    this.vTelefonEdit = true;
                    this.$toast.success("Nomor Terdaftar di Whatsapp", {
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
                    this.btnDisabledE = false
                })
                .catch(error => {
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
        },
        updateForm() {
            this.loading = true;
            axiosinstance.patch('users/' + this.userUuid, {
                npk: this.npkEdit,
                role: this.roleEdit,
                employee: this.employeeEdit,
                emp_status: this.empStatusEdit,
                password: this.passwordEdit,
                email: this.emailEdit,
                name: this.empNameEdit,
                phone: this.phoneEdit
            })
                .then(response => {
                    this.loading = false;
                    document.getElementById("exitEdit").click();
                    this.getAllUser();
                    this.vTelefonEdit = false;

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
                    this.btnDisabledE = true;
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
                })
        },

        //Delete Modul
        userDeletes(user) {
            console.log(user)
            this.userUuid = user.uuid
            this.empNameDelete = user?.name;
            this.indexModul = user

        },

        deleteForm() {
            this.loading = true
            axiosinstance.delete('users/', {
                params: { 'id': this.userUuid }
            })
                .then(response => {
                    this.loading = false;
                    document.getElementById("exitDelete").click();

                    const idx = this.dataUsers.indexOf(this.indexUser);
                    this.dataUsers.splice(idx, 1);

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

            if (!(this.dataUsers.length < this.indexEnd)) {
                this.nextDis = ""
            } else {
                this.nextDis = "disabled"
            }
        },
        next() {
            if (!(this.dataUsers.length < this.indexEnd)) {
                this.current++;
            }

            if (!(this.dataUsers.length < this.indexEnd)) {
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

            if (!(this.dataUsers.length < this.indexEnd)) {
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
        this.getAllUser();
    },
    computed: {
        indexStart() {
            return (this.current - 1) * this.pageSize;
        },
        indexEnd() {
            return this.indexStart + this.pageSize;
        },
        paginated() {
            return this.dataUsers.slice(this.indexStart, this.indexEnd);
        },
        pageNumber() {
            const y = this.dataUsers.length
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