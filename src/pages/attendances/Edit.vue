<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <Toast />
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Edit Attendance</h5>
                    <Button type="button" icon="pi pi-arrow-left" label="Back To Index Page" class="p-button-outlined mb-2" @click="redirectToIndexPage()" />
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
                <Button label="Submit" v-on:click="updateAttendance()" :disabled="v$.attendance.$invalid"></Button>
            </div>
        </div>
    </div>
</template>

<script>
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import axios from 'axios';
import authHeader from '../../services/auth-header';
export default {
    name:"Edit Attendance",
    data() {
        return {
            attendance: {
                date: '',
                start_time: {},
                end_time: {},
            },
            format: 'd-M-Y',
        };
    },
    setup: () => ({ v$: useVuelidate() }),
    validations () {
        return {
          attendance: {
            date: { required },
            start_time: { required },
            end_time: { required },
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
         this.getAttendance();
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
        getAttendance() {
            axios.get(`${process.env.VUE_APP_API_URL}/attendances/${this.$route.params.attendance_id}/edit`,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'success') {
                    // console.log(response);
                    this.attendance = response.data;
                    let start_time_array = response.data.start_time.split(":");
                    let end_time_array = response.data.end_time.split(":");
                    this.attendance.start_time = {};
                    this.attendance.start_time['hours'] = start_time_array[0];
                    this.attendance.start_time['minutes'] = start_time_array[1];
                    this.attendance.end_time = {};
                    this.attendance.end_time['hours'] = end_time_array[0];
                    this.attendance.end_time['minutes'] = end_time_array[1];
                } else {
                    this.toastMessage(response.message,response.status);
                    this.redirectToIndexPage();
                }
            })
        },
        updateAttendance() {
            axios.put(`${process.env.VUE_APP_API_URL}/attendances/${this.$route.params.attendance_id}/update`,this.attendance,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'success') {
                    this.toastMessage(response.message,response.status);
                    this.redirectToIndexPage();
                } else {
                    this.toastMessage(response.message,response.status);
                    this.redirectToIndexPage();
                }
            })
        },
        redirectToIndexPage() {
            setTimeout(() => this.$router.push({ name: 'attendances.index' }), 1500);
        },

    },
}
</script>
