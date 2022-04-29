<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <Toast />
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Create Attendance</h5>
                    <Button type="button" icon="pi pi-arrow-left" label="Back To Index Page" class="p-button-outlined mb-2" @click="redirectToIndexPage()" />
                </div>
                <div class="grid formgrid" v-for="(student, index) in students" :key="student.id">
                        <InputText id="name1" type="hidden" v-model="data.attendance[index].student_id" :value='student.id' :disabled="true"/>
                    <div class="mr-2 lg:col-6">
                        <InputText id="name1" type="text" :value='student.name' :disabled="true"/>
                    </div>
                    <div class="lg:col-4">
                        <Dropdown v-model="data.attendance[index].status" :options="status" optionLabel="name" optionValue="id" placeholder="Status"/>
                    </div>
                </div>
                <Button label="Submit" v-on:click="saveAttendance()"></Button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import authHeader from '../../services/auth-header';
export default {
    name:"Login",
    data() {
        return {
            data: {
                attendance: [],
            },
            students: [],
            status: [
                { name: 'Absent', id: 0 },
                { name: 'Present', id: 1 },
                { name: 'Late', id: 2 },
            ],
        };
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
        this.getAttendanceStudents();
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
        redirectAfterSuccess() {
            setTimeout(() => this.$router.push({ name: 'attendances.index' }), 3000);
        },
        getAttendanceStudents() {
            axios.get(`${process.env.VUE_APP_API_URL}/attendances/${this.$route.params.attendance_id}/getAttendanceStudents`, { headers: authHeader()}).then(data => {
                let response = data.data;
                if (response.status == 'success') {
                    this.students = response.data;
                    for(let i = 0; i < this.students.length; i++) {
                        let att_array = { student_id: '', status: '', name: '' };
                        this.data.attendance.push(att_array);
                    }
                    for(let i = 0; i < this.students.length; i++) {
                        this.data.attendance[i]['student_id'] = this.students[i]['id'];
                        this.data.attendance[i]['name'] = this.students[i]['name'];
                        this.data.attendance[i]['status'] = 1;
                    }
                } else {
                    this.toastMessage(response.message,response.status);
                    this.$router.push({ name: 'attendances.index' });
                }
            })
        },
        saveAttendance() {
            axios.post(`${process.env.VUE_APP_API_URL}/attendances/${this.$route.params.attendance_id}/takeAttendance`,this.data,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'success') {
                    this.toastMessage(response.message,response.status);
                    this.redirectAfterSuccess();
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
