<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Submission</h5>
                    <Button type="button" icon="pi pi-arrow-left" label="Back To Index Page" class="p-button-outlined mb-2" @click="redirectToIndexPage()" />
                </div>
                <table class="min-w-full border divide-y divide-gray-200">
                    <tbody class="bg-white divide-y divide-gray-200 divide-solid">
                        <tr class="bg-white">
                            <th>Student Name</th>
                            <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                {{ submission.assignment_submission_get_students.name }} - {{ submission.assignment_submission_get_students.roll_no }}
                            </td>
                        </tr>
                        <tr>
                            <th>Deadline ?</th>
                            <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                {{ submission.assignment_submission_get_assignments.end_date_time }}
                            </td>
                        </tr>
                        <tr>
                            <th>Submission Date &amp; Time</th>
                            <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                {{ submission.answer_added_at }}
                            </td>
                        </tr>
                        <tr>
                            <th>Answer</th>
                            <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                {{ submission.answer }}
                            </td>
                        </tr>
                        <tr>
                            <th>File Link</th>
                            <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                <Button icon="pi pi-cloud" label="View File" class="p-button-rounded mr-2 mb-2" @click="openFile(submission.file_link)"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <hr>
            <div class="card">
                <Toast />
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Evaluate Submission</h5>
                </div>
                <div class="field p-fluid">
                    <label for="obtained_marks1">Obtained Marks / {{ submission.assignment_submission_get_assignments.total_marks }}</label>
                    <InputText id="obtained_marks1" type="text" v-model="v$.evaluation.obtained_marks.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="teacher_comments1">Additional Comments</label>
                    <Textarea id="teacher_comments1" type="text" v-model="v$.evaluation.teacher_comments.$model"/>
                </div>
                <Button label="Submit" v-on:click="saveEvaluation()" :disabled="v$.evaluation.$invalid"></Button>
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
    name:"Evaluate Submission",
    data() {
        return {
            submission: {
                answer: '',
                file_link: '',
                assignment_submission_get_students: {},
                assignment_submission_get_assignments: {},
            },
            evaluation : {
                obtained_marks: '',
                teacher_comments: '',
            },
        };
    },
    setup: () => ({ v$: useVuelidate() }),
    validations () {
        return {
            evaluation: {
                obtained_marks: { required, numeric },
                teacher_comments: ''
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
        this.checkAddMarksPermission();
        this.getSubmission();
    },
    methods: {
        checkUserLogin() {
            if (!this.loggedIn) {
                this.$router.push("/login");
            }
        },
        checkUserRole() {
            if(this.checkRole != 'Super Admin' && this.checkRole != 'Teacher') {
                this.$router.push({ name: 'assignments.index' });
            }
        },
        openFile(link) {
            window.open(link, '_blank');
        },
        getSubmission() {
            axios.get(`${process.env.VUE_APP_API_URL}/assignments/${this.$route.params.assignment_id}/submissions/${this.$route.params.id}/show`,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if (response.status == 'success') {
                    this.submission = response.data;
                    this.evaluation.obtained_marks = response.data.obtained_marks;
                    this.evaluation.teacher_comments = response.data.teacher_comments;
                }
            })
        },
        checkAddMarksPermission() {
            axios.get(`${process.env.VUE_APP_API_URL}/assignments/${this.$route.params.assignment_id}/submissions/${this.$route.params.id}/show`,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if (response.status != 'success') {
                    let message = response.message;
                    let status = response.status;
                    this.toastMessge(message,status);
                    setTimeout(() => this.$router.push({ name: 'assignments.index' }), 3000)
                }
            })
        },
        toastMessage(message,status) {
            this.$toast.add({ severity: status, summary: message, detail:'', life: 1500 });
        },
        redirectAfterSuccess() {
            setTimeout(() => this.$router.push({ name: 'assignment-submissions.index', params: { assignment_id: this.$route.params.assignment_id } }), 1500)
        },

        saveEvaluation() {
            axios.post(`${process.env.VUE_APP_API_URL}/assignments/${this.$route.params.assignment_id}/submissions/${this.$route.params.id}/add-marks`,this.evaluation,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'success') {
                    let message = response.message;
                    let status = response.status;
                    this.toastMessage(message,status);
                    this.redirectAfterSuccess();
                } else {
                    this.redirectToIndexPage();
                }
            })
        },
        redirectToIndexPage() {
            this.$router.push({ name: 'assignment-submissions.index', params: { assignment_id: this.$route.params.assignment_id } });
        },

    },
}
</script>
