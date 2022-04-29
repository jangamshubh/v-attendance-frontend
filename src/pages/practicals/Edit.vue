<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <Toast />
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Edit Practical</h5>
                    <Button type="button" icon="pi pi-arrow-left" label="Back To Index Page" class="p-button-outlined mb-2" @click="redirectToIndexPage()" />
                </div>
                <div class="field p-fluid">
                    <label for="name1">Name</label>
                    <InputText id="name1" type="text" v-model="v$.practical.name.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="description1">Description</label>
                    <Textarea id="description1" type="text" v-model="v$.practical.description.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="rubric1">Rubric</label>
                    <Textarea id="rubric1" type="text" v-model="v$.practical.rubric.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="start_date_time1">Assignment Start Date Time</label>
                    <Datepicker id="start_date_time1" v-model="v$.practical.start_date_time.$model" />
                </div>
                <div class="field p-fluid">
                    <label for="end_date_time1">Assignment End Date Time</label>
                    <Datepicker id="end_date_time1" v-model="v$.practical.end_date_time.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="total_marks1">Total Marks</label>
                    <InputText id="total_marks1" type="text" v-model="v$.practical.total_marks.$model"/>
                </div>
                <div class="field p-fluid">
                    <h5>Allow Late Submission?</h5>
                    <Dropdown v-model="v$.practical.allow_late_submision.$model" :options="late_submissions" optionLabel="name" optionValue="id" placeholder="Yes / No"/>
                </div>
                <div class="field p-fluid">
                    <label for="more_info_link1">Additional Information Link</label>
                    <InputText id="more_info_link1" type="text" v-model="v$.practical.more_info_link.$model"/>
                </div>
                <div class="field p-fluid">
                    <h5>Visibility?</h5>
                    <Dropdown v-model="v$.practical.visibility.$model" :options="visibility_options" optionLabel="name" optionValue="id" placeholder="Draft / Published"/>
                </div>
                <Button label="Update" v-on:click="updatePractical()" :disabled="v$.practical.$invalid"></Button>
            </div>
        </div>
    </div>
</template>

<script>
import { required, minLength, maxLength, numeric, url } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import axios from 'axios';
import authHeader from '../../services/auth-header';
import Datepicker from 'vue3-date-time-picker';
import 'vue3-date-time-picker/dist/main.css'
export default {
    name:"Create Assignment",
    components: { Datepicker },
    data() {
        return {
            practical: {
                name: '',
                description: '',
                rubric: '',
                start_date_time: '',
                end_date_time: '',
                total_marks: '',
                allow_late_submision: '',
                more_info_link: '',
                visibility: '',
            },
            late_submissions: [
                { name: 'Yes', id: 1 },
                { name: 'No', id: 0 },
            ],
            visibility_options: [
                { name: 'Published', id: 1 },
                { name: 'Draft', id: 0 },
            ],
        };
    },
    setup: () => ({ v$: useVuelidate() }),
    validations () {
        return {
            practical: {
                name: { required, minLength: minLength(5) },
                description: { required },
                rubric: { maxLength: maxLength(1000) },
                start_date_time: { required },
                end_date_time: { required },
                total_marks: { required, numeric },
                allow_late_submision: { required, numeric },
                more_info_link : { required, url },
                visibility: { required, numeric },
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
        this.getPractical();
    },
    methods: {
        checkUserLogin() {
            if (!this.loggedIn) {
                this.$router.push("/login");
            }
        },
        checkUserRole() {
            if(this.checkRole != 'Teacher' && this.checkRole != 'Super Admin') {
                this.$router.push({ name: 'practicals.index' });
            }
        },
        showSuccess() {
            this.$toast.add({ severity:'success', summary: 'Success Message', detail:'Message Detail', life: 3000 });
        },
        redirectAfterSuccess() {
            setTimeout(() => this.$router.push({ name: 'practicals.index' }), 3000)
        },
        getPractical() {
            axios.get(`${process.env.VUE_APP_API_URL}/practicals/${this.$route.params.id}/edit`, { headers: authHeader() }).then( data => {
                let response = data.data;
                if(response.message != 'success') {
                    this.$router.push({ name: 'practicals.index' });
                }
                this.practical = response.data;
            })
        },
        updatePractical() {
            axios.put(`${process.env.VUE_APP_API_URL}/practicals/${this.$route.params.id}/update`,this.practical,{ headers: authHeader() }).then(data => {
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
            this.$router.push({ name: 'users.index' });
        },

    },
}
</script>
