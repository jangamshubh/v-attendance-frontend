<template>
    <div class="grid">
        <div class="col-12">
            <Card>
                <template v-slot:title>
                    <div class="flex align-items-center justify-content-between mb-0">
                        <h5>Attendance</h5>
                        <Button icon="pi pi-arrow-left" class="p-button-rounded mr-2 mb-2" @click="redirectToIndex()"/>
                    </div>
                </template>
                <template v-slot:content>
                    <table class="min-w-full border divide-y divide-gray-200">
                        <tbody class="bg-white divide-y divide-gray-200 divide-solid">
                            <tr class="bg-white">
                                <th>Subject</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                    {{ attendance.attendance_get_subjects.name }}
                                </td>
                            </tr>
                            <tr>
                                <th>Date</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                    {{ attendance.date }}
                                </td>
                            </tr>
                            <tr>
                                <th>Start Time</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                    {{ attendance.start_time }}
                                </td>
                            </tr>
                            <tr>
                                <th>End Time</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                    {{ attendance.end_time }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </template>
            </Card>
            <hr>
            <Card>
                <template v-slot:title>
                    <div class="flex align-items-center justify-content-between mb-0">
                        <h5>Batches For Which Attendance is Taken</h5>
                    </div>
                </template>
                <template v-slot:content>
                    <DataTable :value="attendance_batches" :paginator="true" class="p-datatable-gridlines" :rows="10" dataKey="id" :rowHover="true"
                    v-model:filters="filters1" filterDisplay="menu" :loading="loading1" :filters="filters1" responsiveLayout="scroll"
                    :globalFilterFields="['']">
                        <template #empty>
                            No data found.
                        </template>
                        <template #loading>
                            Loading data. Please wait.
                        </template>
                        <Column field="classroom" header="Classroom" style="min-width:12rem">
                            <template #body="{data}">
                                {{ data.classroom_batch_get_classrooms.name }}
                            </template>
                        </Column>
                        <Column field="batch" header="Batch" style="min-width:12rem">
                            <template #body="{data}">
                                {{ data.classroom_batch_get_batches.name }}
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>
            <hr>
            <Card>
                <template v-slot:title>
                    <div class="flex align-items-center justify-content-between mb-0">
                        <h5>Students</h5>
                    </div>
                </template>
                <template v-slot:content>
                    <DataTable :value="attendance_students" :paginator="true" class="p-datatable-gridlines" :rows="10" dataKey="id" :rowHover="true"
                    v-model:filters="filters1" filterDisplay="menu" :loading="loading3" responsiveLayout="scroll" :globalFilterFields="['']" >
                        <template #empty>
                            No data found.
                        </template>
                        <template #loading>
                            Loading data. Please wait.
                        </template>
                        <Column field="student" header="Student" style="min-width:12rem">
                            <template #body="{data}">
                                {{ data.attendance_student_get_students.name }}
                            </template>
                        </Column>
                        <Column field="status" header="Status" style="min-width:12rem">
                            <template #body="{data}">
                                <div v-if="data.status == 0"> Absent</div>
                                <div v-else-if="data.status == 1">Present</div>
                                <div v-else>Late</div>
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import authHeader from '../../services/auth-header';
export default {
    data() {
        return {
            attendance:{
                attendance_get_subjects: {
                    name: '',
                }
            },
            attendance_batches: null,
            batches: [],
            attendance_students: [],
            students: [],
            filters1: null,
            filters2: {},
            loading1: true,
            loading2: true,
            loading3: true,
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
        },
    },
    created() {
        this.checkUserLogin();
        this.checkUserRole();
        this.getData();
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
        getData() {
            axios.get(`${process.env.VUE_APP_API_URL}/attendances/${this.$route.params.attendance_id}/show`,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'success') {
                    this.attendance = response.attendance;
                    this.attendance_batches = response.attendance_batches;
                    this.loading1 = false;
                    this.attendance_students = response.attendance_students;
                    this.loading3 = false;
                } else {
                    this.$router.push({ name: 'attendances.index' });
                }
            })
        },
        redirectToIndex() {
            this.$router.push({ name: 'attendances.index' });
        },
    },
}
</script>
