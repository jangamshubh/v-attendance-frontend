<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <Toast />
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Add Submission</h5>
                    <Button type="button" icon="pi pi-arrow-left" label="Back To Index Page" class="p-button-outlined mb-2" @click="redirectToIndexPage()" />
                </div>
                <div class="field p-fluid">
                    <label for="answer1">Answer</label>
                    <Textarea id="answer1" type="text" v-model="v$.submission.answer.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="file_link1">File Link</label>
                    <InputText id="file_link1" type="text" v-model="v$.submission.file_link.$model"/>
                </div>
                <Button label="Submit" v-on:click="saveSubmission()" :disabled="v$.submission.$invalid"></Button>
            </div>
        </div>
    </div>
</template>

<script>
import { required, minLength, url } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import axios from 'axios';
import authHeader from '../../services/auth-header';
export default {
    name:"Create Submission",
    data() {
        return {
            submission: {
                answer: '',
                file_link: '',
            },
        };
    },
    setup: () => ({ v$: useVuelidate() }),
    validations () {
        return {
            submission: {
                answer: { required, minLength: minLength(5) },
                file_link : { url },
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
        this.checkTime();
        this.checkSubmissionPermission();
    },
    methods: {
        checkUserLogin() {
            if (!this.loggedIn) {
                this.$router.push("/login");
            }
        },
        checkUserRole() {
            if(this.checkRole != 'Super Admin' && this.checkRole != 'Student') {
                this.$router.push({ name: 'practicals.index' });
            }
        },
        checkTime() {
            axios.get(`${process.env.VUE_APP_API_URL}/practicals/${this.$route.params.practical_id}/submissions/checkTime`, { headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status != 'Success') {
                    this.showTimeError();
                    setTimeout(() => this.$router.push({ name: 'practicals.index' }), 3000)
                }
            })
        },
        checkSubmissionPermission() {
            axios.get(`${process.env.VUE_APP_API_URL}/practicals/${this.$route.params.practical_id}/submissions/checkSubmissionPermission`, { headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status != 'Success') {
                    this.showSubmissionPermissionError();
                    setTimeout(() => this.$router.push({ name: 'practicals.index' }), 3000)
                }
            })
        },
        showTimeError() {
            this.$toast.add({ severity:'error', summary: 'Deadline has Already Passed', detail:'Message Detail', life: 1000 });
        },
        showSubmissionPermissionError() {
            this.$toast.add({ severity:'error', summary: 'You are not allowed to Add Answer', detail:'Message Detail', life: 1000 });
        },
        showSuccess() {
            this.$toast.add({ severity:'success', summary: 'Success Message', detail:'Message Detail', life: 3000 });
        },
        redirectAfterSuccess() {
            setTimeout(() => this.$router.push({ name: 'practical-submissions.index', params: { practical_id: this.$route.params.practical_id } }), 1500)
        },

        saveSubmission() {
            axios.post(`${process.env.VUE_APP_API_URL}/practicals/${this.$route.params.practical_id}/submissions/add`,this.submission,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'Success') {
                    this.showSuccess();
                    this.redirectAfterSuccess();
                } else {
                    console.log(response);
                }
            })
        },
        redirectToIndexPage() {
            this.$router.push({ name: 'practical-submissions.index', params: { practical_id: this.$route.params.practical_id } });
        },

    },
}
</script>
