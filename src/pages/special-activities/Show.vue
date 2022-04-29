<template>
    <div class="grid">
        <div class="col-12">
            <Card>
				<template v-slot:title>
					<div class="flex align-items-center justify-content-between mb-0">
						<h5>View Activity Details</h5>
                        <Button icon="pi pi-arrow-left" class="p-button-rounded mr-2 mb-2" @click="redirectToIndex()"/>
                    </div>
                </template>
                <template v-slot:content>
                    <table class="min-w-full border divide-y divide-gray-200">
                        <tbody class="bg-white divide-y divide-gray-200 divide-solid">
                            <tr class="bg-white">
                                <th>Name</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                    {{ activity.name }}
                                </td>
                            </tr>
                            <tr>
                                <th>Description</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                    {{ activity.description }}
                                </td>
                            </tr>
                            <tr>
                                <th>Rubric</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                    {{ activity.rubric }}
                                </td>
                            </tr>
                            <tr>
                                <th>Activity Start Date Time</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                    {{ activity.start_date_time }}
                                </td>
                            </tr>
                            <tr>
                                <th>Activity End Date Time</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                    {{ activity.end_date_time }}
                                </td>
                            </tr>
                            <tr>
                                <th>Late Submission Allowed ?</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap" v-if="activity.allow_late_submision == 1">
                                    Yes
                                </td>
                                <td v-else class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">No</td>
                            </tr>
                            <tr>
                                <th>Subject</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                    {{ activity.activity_get_subjects.name }}
                                </td>
                            </tr>
                            <tr>
                                <th>Group Limit</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                    {{ activity.group_limit }}
                                </td>
                            </tr>
                            <tr>
                                <th>Teacher</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                    {{ activity.activity_get_teachers.name }}
                                </td>
                            </tr>
                            <tr>
                                <th>Visibility ?</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap" v-if="activity.visibility == 1">
                                    Published
                                </td>
                                <td v-else>Draft</td>
                            </tr>
                        </tbody>
                    </table>
                </template>
            </Card>
            <hr>
            <Card>
				<template v-slot:title>
					<div class="flex align-items-center justify-content-between mb-0">
						<h5>View Batch Details</h5>
                    </div>
                </template>
                <template v-slot:content>
                    <DataTable :value="batches" :paginator="true" class="p-datatable-gridlines" :rows="10" dataKey="id" :rowHover="true"
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
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import authHeader from '../../services/auth-header';
export default {
    data() {
        return {
            activity:{
                activity_get_subjects: {
                    name: '',
                },
                activity_get_teachers: {
                    name: '',
                },
            },
            batches:[],
            filters1:null,
            loading1: true,
            loading2: true,
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
        this.getActivity();
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
        getActivity() {
            axios.get(`${process.env.VUE_APP_API_URL}/special-activities/${this.$route.params.id}/show`,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'success') {
                    this.activity = response.activity;
                    this.batches = response.batches;
                    this.loading1 = false;
                } else {
                    this.$router.push({ name: 'special-activities.index' });
                }
            })
        },
        redirectToIndex() {
            this.$router.push({ name: 'special-activities.index' });
        },
    },
}
</script>
