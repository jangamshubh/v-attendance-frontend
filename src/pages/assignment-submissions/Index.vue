<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Submissions</h5>
                    <Button type="button" v-if="this.checkRole == 'Teacher'" icon="pi pi-arrow-left" label="Assignments" class="p-button-outlined mb-2" @click="redirectToAssignmentsPage()"/>
                    <Button type="button" v-if="this.checkRole == 'Student'" icon="pi pi-plus" label="Add Submission" class="p-button-outlined mb-2" @click="redirectToCreatePage()"/>
                </div>
                <DataTable :value="submissions" :paginator="true" class="p-datatable-gridlines" :rows="10" dataKey="id" :rowHover="true"
                v-model:filters="filters1" filterDisplay="menu" :loading="loading1" :filters="filters1" responsiveLayout="scroll"
                :globalFilterFields="['']" >
                    <template #header>
                        <Button type="button" v-if="this.checkRole == 'Teacher'" icon="pi pi-pencil" label="Auto Evaluate" class="p-button-outlined mb-2" @click="autoEvaluate()"/>
                    </template>
                    <template #empty>
                        No Data found.
                    </template>
                    <template #loading>
                        Loading data. Please wait.
                    </template>
                    <Column field="student_name" header="Student" style="min-width:12rem">
                        <template #body="{data}">
                            {{ data.assignment_submission_get_students.name }} - {{ data.assignment_submission_get_students.roll_no }}
                        </template>
                        <template #filter="{filterModel}">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
                        </template>
                    </Column>
                    <Column field="obtained_marks" header="Obtained Marks" style="min-width:12rem">
                        <template #body="{data}">
                            <b v-if="data.obtained_marks != null">{{ data.obtained_marks }} / {{ data.assignment_submission_get_assignments.total_marks}}</b>
                            <b v-else>Not Yet Evaluated</b>
                        </template>
                    </Column>
                    <Column>
                        <template #body="data">
                            <Button icon="pi pi-pencil" label="Evaluate" class="p-button-rounded p-button-success mr-2" @click="addMarks(data.data)" v-if="this.checkRole == 'Teacher'"/>
                            <Button icon="pi pi-eye" label="View" class="p-button-rounded p-button-info mr-2" @click="showSubmission(data.data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
<script>
import { FilterMatchMode } from 'primevue/api';
import axios from 'axios'
import authHeader from '../../services/auth-header';
export default {
    data() {
        return {
            submissions: null,
            filters1: null,
            filters2: {},
            loading1: true,
            loading2: true,
            deleteRoleDialog: false,
        }
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
        checkRole() {
            return this.$store.state.auth.role;
        }
    },
    created() {
        this.checkUserLogin();
        this.checkUserRole();
        this.initFilters1();
    },
    mounted() {
        this.getAllSubmissions();
    },
    methods: {
        checkUserLogin() {
            if (!this.loggedIn) {
                this.$router.push("/login");
            }
        },
        checkUserRole() {
            if(this.checkRole != 'Super Admin' && this.checkRole != 'Teacher' && this.checkRole != 'Student') {
               this.$router.push("/");
            }
        },
        getAllSubmissions() {
            axios.get(`${process.env.VUE_APP_API_URL}/assignments/${this.$route.params.assignment_id}/submissions`, { headers: authHeader() }).then(data => {
                let response = data.data
                if(response.status == 'success') {
                    this.submissions = response.data;
                    this.loading1 = false;
                } else {
                    this.$router.push({ name: 'assignments.index' });
                }
            })
            this.loading2 = false;
        },
        initFilters1() {
            this.filters1 = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
            }
        },
        clearFilter1() {
            this.initFilters1();
        },
        addMarks(data) {
            this.$router.push({ name: 'assignment-submissions.add-marks', params: { assignment_id: this.$route.params.assignment_id, id: data.id }});
        },
        showSubmission(data) {
            this.$router.push({ name: 'assignment-submissions.show', params: { assignment_id: this.$route.params.assignment_id , id: data.id }});
        },
        redirectToAssignmentsPage() {
            this.$router.push({ name: 'assignments.index' });
        },
        redirectToCreatePage() {
            this.$router.push({ name: 'assignment-submissions.create'});
        },
        autoEvaluate() {
            this.$router.push({ name: 'assignment-submissions.auto-evaluate', params: { assignment_id: this.$route.params.assignment_id }});
        },
    },

}
</script>

<style scoped lang="scss">

</style>
