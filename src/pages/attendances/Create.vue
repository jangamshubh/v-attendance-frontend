<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <Toast />
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Create Attendance</h5>
                    <Button type="button" icon="pi pi-arrow-left" label="Back To Index Page" class="p-button-outlined mb-2" @click="redirectToIndexPage()" />
                </div>
                <div class="field p-fluid">
                    <label for="subject1">Subject</label>
                    <Dropdown v-model="v$.attendance.subject_id.$model" :options="subjects" optionLabel="name" optionValue="id" placeholder="Select Subject For Which Attendance is to be Taken"/>
                </div>
                <div class="field p-fluid">
                    <div class="field p-fluid">
                        <label for="date1">Date</label>
                        <Datepicker id="date1" v-model="v$.attendance.date.$model" :format="format" />
                    </div>
                </div>
                <div class="field p-fluid">
                    <div class="field p-fluid">
                        <label for="start_time1">Start Time</label>
                        <Datepicker id="start_time1" v-model="v$.attendance.start_time.$model" timePicker />
                    </div>
                </div>
                <div class="field p-fluid">
                    <div class="field p-fluid">
                        <label for="end_time1">End Time</label>
                        <Datepicker id="end_time1" v-model="v$.attendance.end_time.$model" timePicker />
                    </div>
                </div>
                <div class="field p-fluid" v-if="attendance.subject_id != ''">
                    <h5>Select Classroom / Batch ?</h5>
                    <div class="grid">
                        <div class="col-12 md:col-4">
                            <div class="field-radiobutton mb-0">
                                <RadioButton id="option1" v-model="v$.attendance.attendance_for.$model" value="1" @change="getTeacherClassrooms()"/>
                                <label for="option1">Add For All Batches in Selected Classroom</label>
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field-radiobutton mb-0">
                                <RadioButton id="option2" value="2" v-model="v$.attendance.attendance_for.$model" @change="getTeacherClassrooms()"/>
                                <label for="option2">Add For Particular Batch</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field p-fluid" v-if="attendance.attendance_for == 1 || attendance.attendance_for == 2">
                    <h5>Select Classroom</h5>
                    <Dropdown v-model="v$.attendance.classroom_id.$model" :options="classrooms" optionLabel="name" optionValue="id" placeholder="" @change="getTeacherBatches()"/>
                </div>
                <div class="field p-fluid" v-if="attendance.attendance_for == 2">
                    <h5>Select Batch</h5>
                    <Dropdown v-model="v$.attendance.batch_id.$model" :options="batches" optionLabel="name" optionValue="id" placeholder=""/>
                </div>
                <Button label="Submit" v-on:click="saveAttendance()" :disabled="v$.attendance.$invalid"></Button>
            </div>
        </div>
    </div>
</template>

<script>
import { required, numeric } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import axios from 'axios';
import authHeader from '../../services/auth-header';
export default {
    name:"Login",
    data() {
        return {
            attendance: {
                subject_id: '',
                date: '',
                start_time: '',
                end_time: '',
                attendance_for: '',
                classroom_id: '',
                batch_id: '',
            },
            format: 'd-M-Y',
            classrooms: [],
            batches: [],
            subjects: [],
        };
    },
    setup: () => ({ v$: useVuelidate() }),
    validations () {
        return {
          attendance: {
            subject_id: { required },
            date: { required },
            start_time: { required },
            end_time: { required },
            attendance_for: { required },
            classroom_id: { numeric },
            batch_id: { numeric }
          }
        }
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
        checkUser() {
            return this.$store.state.auth.user;
        },
        checkRole() {
            return this.$store.state.auth.role;
        }
    },
    created() {
         this.checkUserLogin();
         this.checkUserRole();
         this.getTeacherSubjects();
    },
    methods: {
        checkUserLogin() {
            if (!this.loggedIn) {
                this.$router.push("/login");
            }
        },
        checkUserRole() {
            if(this.checkRole != 'Super Admin' && this.checkRole != 'Teacher') {
               this.$router.push("/");
           }
        },
        toastMessage(message,status) {
            this.$toast.add({ severity: status, summary: message, detail:'', life: 3000 });
        },
        redirectAfterSuccess(data) {
            this.$router.push({ name: 'attendances.take-attendance', params: { attendance_id: data.id } })
        },
        getTeacherSubjects() {
            axios.get(`${process.env.VUE_APP_API_URL}/batch-teacher-subjects/getTeacherSubjects`, { headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'success') {
                    this.subjects = response.data;
                } else {
                    this.toastMessage(response.message,response.status);
                    this.redirectToIndexPage();
                }
            })
        },
        getTeacherClassrooms() {
            if(this.attendance.attendance_for == 1) {
                this.attendance.classroom_id = '';
                axios.get(`${process.env.VUE_APP_API_URL}/batch-teacher-subjects/${this.attendance.subject_id}/getTeacherClassrooms`, { headers: authHeader() }).then(data => {
                    let response = data.data;
                    if(response.status == 'success') {
                        this.classrooms = response.data;
                    } else {
                        this.toastMessage(response.message,response.status);
                        this.redirectToIndexPage();
                    }
                })
            } else if (this.attendance.attendance_for == 2) {
                this.attendance.classroom_id = '';
                this.attendance.batch_id = '';
                axios.get(`${process.env.VUE_APP_API_URL}/batch-teacher-subjects/${this.attendance.subject_id}/getTeacherClassrooms`, { headers: authHeader() }).then(data => {
                    let response = data.data;
                    if(response.status == 'success') {
                        this.classrooms = response.data;
                    } else {
                        this.toastMessage(response.message,response.status);
                        this.redirectToIndexPage();
                    }
                })
            }
        },
        getTeacherBatches() {
            if(this.attendance.attendance_for == 2 && this.attendance.classroom_id != '') {
                axios.get(`${process.env.VUE_APP_API_URL}/batch-teacher-subjects/${this.attendance.classroom_id}/getTeacherBatches`, { headers: authHeader() }).then(data => {
                    let response = data.data;
                    if(response.status == 'success') {
                        this.batches = response.data;
                    } else {
                        this.toastMessage(response.message,response.status);
                        this.redirectToIndexPage();
                    }
                })
            }
        },
        saveAttendance() {
            axios.post(`${process.env.VUE_APP_API_URL}/attendances/store`,this.attendance,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'success') {
                    this.toastMessage(response.message,response.status);
                    this.redirectAfterSuccess(response.data);
                } else {
                    console.log(response);
                }
            })
        },
        redirectToIndexPage() {
            this.$router.push({ name: 'attendances.index' });
        },

    },
}
</script>
