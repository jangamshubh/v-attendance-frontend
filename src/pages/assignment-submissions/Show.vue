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
                        <tr>
                            <th>Marks</th>
                            <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                <b v-if="submission.obtained_marks == null">Not Yet Evaluated</b>
                                <b v-else>{{ submission.obtained_marks }} / {{ submission.assignment_submission_get_assignments.total_marks }}</b>
                            </td>
                        </tr>
                        <tr>
                            <th>Teacher Comments</th>
                            <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                <b v-if="submission.teacher_comments == null">Not Yet Evaluated</b>
                                <b v-else>{{ submission.teacher_comments }} </b>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
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
                obtained_marks: '',
                teacher_comments: '',
            },
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
        this.getSubmission();
    },
    methods: {
        checkUserLogin() {
            if (!this.loggedIn) {
                this.$router.push("/login");
            }
        },
        checkUserRole() {
            if(this.checkRole != 'Super Admin' && this.checkRole != 'Teacher' && this.checkRole != 'Student') {
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
                } else {
                    this.$router.push({ name: 'assignment-submissions.index', params: { assignment_id: this.$route.params.assignment_id } });
                }
            })
        },

        redirectToIndexPage() {
            this.$router.push({ name: 'assignment-submissions.index', params: { assignment_id: this.$route.params.assignment_id } });
        },

    },
}
</script>
