<template>
    <div class="grid">
        <div class="col-12">
            <div class="card" v-if="this.role == 'Teacher'">
                <Toast />
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Attendance</h5>
                    <Button type="button" icon="pi pi-plus" label="Create Attendance" class="p-button-outlined mb-2" @click="redirectToCreatePage()"/>
                </div>
                <DataTable :value="attendances" :paginator="true" class="p-datatable-gridlines" :rows="10" dataKey="id" :rowHover="true"
                v-model:filters="filters1" filterDisplay="menu" :loading="loading1" :filters="filters1" responsiveLayout="scroll"
                :globalFilterFields="['date']" >

                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2" @click="clearFilter1()"/>
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%"/>
                            </span>
                        </div>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Dropdown v-model="teacher.subject_id" :options="subjects" optionLabel="name" optionValue="id" placeholder="Select Subject" @change="getTeacherClassrooms()"/>
                            <Dropdown v-if="teacher.subject_id != ''" v-model="teacher.classroom_id" :options="classrooms" optionLabel="name" optionValue="id" placeholder="Select Classroom" @change="getTeacherBatches()"/>
                            <Dropdown v-if="teacher.classroom_id != ''" v-model="teacher.batch_id" :options="batches" optionLabel="name" optionValue="id" placeholder="Select Batch" @change="getData()"/>
                        </div>
                    </template>
                    <template #empty>
                        No data found.
                    </template>
                    <template #loading>
                        Loading data. Please wait.
                    </template>
                    <Column field="subject" header="Subject" style="min-width:12rem">
                        <template #body="{data}">
                            {{ data.attendance_get_subjects.name }}
                        </template>
                        <template #filter="{filterModel}">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
                        </template>
                    </Column>
                    <Column field="date" header="Date" style="min-width:12rem">
                        <template #body="{data}">
                            {{ data.date }}
                        </template>
                    </Column>
                    <Column field="students" header="Present Students" style="min-width:12rem">
                        <template #body="{data}">
                            {{ data.present_students }} / {{ data.total_students }}
                        </template>
                    </Column>
                    <Column>
                        <template #body="data">
                            <Button v-if="data.attendance_taken == false" icon="pi pi-user-plus" class="p-button-rounded p-button-info mr-2" label="Take Attendance" @click="takeAttendance(data.data)" />
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-info mr-2" @click="editAttendance(data.data)" />
                            <Button icon="pi pi-clone" class="p-button-rounded p-button-info mr-2" @click="duplicateAttendance(data.data)" />
                            <Button icon="pi pi-eye" class="p-button-rounded p-button-info mr-2" @click="showAttendance(data.data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
            <div class="card" v-if="this.role == 'Student'">
                <Toast />
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Attendance</h5>
                </div>
                <DataTable :value="attendances" :paginator="true" class="p-datatable-gridlines" :rows="10" dataKey="id" :rowHover="true"
                v-model:filters="filters1" filterDisplay="menu" :loading="loading1" :filters="filters1" responsiveLayout="scroll"
                :globalFilterFields="['status']" >

                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Dropdown v-model="attendance.subject_id" :options="subjects" optionLabel="name" optionValue="id" placeholder="Select Subject" @change="getAttendanceData()"/>
                            <p>
                                Percentage Attendance: <b v-if="this.attendance_percentage">{{ this.attendance_percentage }}%</b>
                                <b v-else>No Data Yet</b>
                            </p>
                        </div>
                    </template>
                    <template #empty>
                        No data found.
                    </template>
                    <template #loading>
                        Loading data. Please wait.
                    </template>
                    <Column field="date" header="Date" style="min-width:12rem">
                        <template #body="{data}">
                            {{ data.attendance_student_get_attendance.date }}
                        </template>
                    </Column>
                    <Column field="status" header="Status" style="min-width:12rem">
                        <template #body="{data}">
                            <b v-if="data.status == 0">Absent</b>
                            <b v-else-if="data.status == 1">Present</b>
                            <b v-else>Late</b>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
<script>
import { FilterMatchMode,FilterOperator } from 'primevue/api';
import axios from 'axios'
import authHeader from '../../services/auth-header';
export default {
    data() {
        return {
            attendances: null,
            filters1: null,
            filters2: {},
            loading1: false,
            loading2: false,
            attendance: {
                subject_id:''
            },
            subjects: [],
            classrooms: [],
            batches: [],
            attendance_percentage: '',
            teacher: {
                subject_id: '',
                classroom_id: '',
                batch_id: '',
            },
        }
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
        user() {
            return this.$store.state.auth.user;
        },
        role() {
            return this.$store.state.auth.role;
        },
    },
    created() {
        this.checkUserLogin();
        this.checkUserRole();
        this.initFilters1();
    },
    mounted() {
        // this.getAttendances();
        this.getAllStudentBatchSubjects();
        this.getAllTeacherSubjects();
    },
    methods: {
        checkUserLogin() {
            if (!this.loggedIn) {
                this.$router.push("/login");
            }
        },
        checkUserRole() {
            if(this.role != 'Super Admin' && this.role != 'Teacher' && this.role != 'Student') {
               this.$router.push("/");
           }
        },
        getAllTeacherSubjects() {
            if(this.role == 'Teacher') {
                axios.get(`${process.env.VUE_APP_API_URL}/batch-teacher-subjects/getTeacherSubjects`, { headers: authHeader() }).then(data => {
                    this.subjects = data.data.data;
                })
            }
        },
        getTeacherClassrooms() {
            if(this.role == 'Teacher' && this.teacher.subject_id != '') {
                axios.get(`${process.env.VUE_APP_API_URL}/batch-teacher-subjects/${this.teacher.subject_id}/getTeacherClassrooms`, { headers: authHeader() }).then(data => {
                    this.classrooms = data.data.data;
                })
            }
        },
        getTeacherBatches() {
            if(this.role == 'Teacher' && this.teacher.classroom_id != '') {
                axios.get(`${process.env.VUE_APP_API_URL}/batch-teacher-subjects/${this.teacher.classroom_id}/getTeacherBatches`, { headers: authHeader() }).then(data => {
                    this.batches = data.data.data;
                })
            }
        },
        getAllStudentBatchSubjects() {
            if(this.role == 'Student') {
                axios.get(`${process.env.VUE_APP_API_URL}/batch-students/getAllStudentBatchSubjects`, { headers: authHeader() }).then(data => {
                    this.subjects = data.data.data;
                })
            }
        },
        getAttendanceData() {
            if(this.role == 'Student') {
                axios.get(`${process.env.VUE_APP_API_URL}/attendances/${this.attendance.subject_id}/student-attendance`, { headers: authHeader() }).then(data => {
                    this.attendances = data.data.data;
                    let total_attendance = this.attendances.length;
                    let total_present = 0;
                    for(let i = 0; i < total_attendance; i++) {
                        if(this.attendances[i].status == 1) {
                             total_present = total_present + 1;
                        }
                    }
                    this.attendance_percentage = (total_present/total_attendance) * 100;
                })
            }
        },
        getData() {
            if(this.role == 'Teacher') {
                axios.get(`${process.env.VUE_APP_API_URL}/attendances/${this.teacher.batch_id}/get-data`, { headers: authHeader() }).then(data => {
                    this.attendances = data.data.data;
                })
            }
        },
        initFilters1() {
            this.filters1 = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
                'status': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
            }
        },
        clearFilter1() {
            this.initFilters1();
        },
        editAttendance(data) {
            // console.log(data.id)
            this.$router.push({ name: 'attendances.edit', params: { attendance_id: data.id }});
        },
        showAttendance(data) {
            this.$router.push({ name: 'attendances.show', params: { attendance_id: data.id }});
        },
        duplicateAttendance(data) {
            this.$router.push({ name: 'attendances.duplicate-attendance', params: { attendance_id: data.id }});
        },
        takeAttendance(data) {
            this.$router.push({ name: 'attendances.take-attendance', params: { attendance_id: data.id }});
        },
        redirectToCreatePage() {
            this.$router.push({ name: 'attendances.create' });
        },
    },

}
</script>

<style scoped lang="scss">

</style>
