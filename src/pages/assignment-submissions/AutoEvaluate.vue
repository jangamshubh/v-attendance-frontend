<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <Toast />
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Auto Evaluate All Submissions</h5>
                    <Button type="button" icon="pi pi-arrow-left" label="Back To Index Page" class="p-button-outlined mb-2" @click="redirectToIndexPage()" />
                </div>
                <div class="field p-fluid">
                    <label for="submission_marks_before_deadline1">Marks for Submissions before Deadline / {{ assignment.total_marks }} </label>
                    <InputText id="submission_marks_before_deadline1" type="text" v-model="v$.marks.submission_marks_before_deadline.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="submission_comments_before_deadline1">Generic Comment for Submissions Before Deadline</label>
                    <InputText id="submission_comments_before_deadline1" type="text" v-model="v$.marks.submission_comments_before_deadline.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="submission_marks_after_deadline1">Marks for Submissions after Deadline / {{ assignment.total_marks }} </label>
                    <InputText id="submission_marks_after_deadline1" type="text" v-model="v$.marks.submission_marks_after_deadline.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="submission_comments_after_deadline1">Generic Comment for Submissions After Deadline</label>
                    <InputText id="submission_comments_after_deadline1" type="text" v-model="v$.marks.submission_comments_after_deadline.$model"/>
                </div>
                <Button label="Submit" v-on:click="saveMarks()" :disabled="v$.marks.$invalid"></Button>
            </div>
        </div>
    </div>
</template>

<script>
import { required, numeric, maxLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import axios from 'axios';
import authHeader from '../../services/auth-header';
export default {
    name:"Create Assignment",
    data() {
        return {
            assignment: {
                total_marks: '',
            },
            marks: {
                submission_marks_before_deadline: '',
                submission_marks_after_deadline: '',
                submission_comments_before_deadline: '',
                submission_comments_after_deadline: '',
            },
        };
    },
    setup: () => ({ v$: useVuelidate() }),
    validations () {
        return {
            marks: {
                submission_marks_before_deadline: { required, numeric },
                submission_marks_after_deadline: { required, numeric },
                submission_comments_before_deadline: { max: maxLength(1000)},
                submission_comments_after_deadline: { max: maxLength(1000)},
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
        this.getAssignment();
    },
    methods: {
        checkUserLogin() {
            if (!this.loggedIn) {
                this.$router.push("/login");
            }
        },
        checkUserRole() {
            if(this.checkRole != 'Teacher' && this.checkRole != 'Super Admin') {
                this.$router.push({ name: 'assignments.index' });
            }
        },
        toastMessage(message,status) {
            this.$toast.add({ severity: status, summary: message, detail:'', life: 1500 });
        },
        redirectAfterSuccess() {
            setTimeout(() => this.$router.push({ name: 'assignment-submissions.index', params: { assignment_id: this.$route.params.assignment_id } }), 3000)
        },
        getAssignment() {
            axios.get(`${process.env.VUE_APP_API_URL}/assignments/${this.$route.params.assignment_id}/show`, { headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'success') {
                    this.assignment = response.assignment;
                } else {
                    this.$router.push({ name: 'assignment-submissions.index', params: { assignment_id: this.$route.params.assignment_id } });
                }
            })
        },
        saveMarks() {
            axios.post(`${process.env.VUE_APP_API_URL}/assignments/${this.$route.params.assignment_id}/submissions/auto-evaluate`,this.marks,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'success') {
                    this.toastMessage(response.message,response.status);
                    this.redirectAfterSuccess();
                } else {
                    this.toastMessage(response.message,response.status);
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
