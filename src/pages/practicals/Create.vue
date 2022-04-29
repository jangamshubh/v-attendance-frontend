<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <Toast />
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Create Practical</h5>
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
                    <label for="start_date_time1">Start Date Time</label>
                    <Datepicker id="start_date_time1" v-model="v$.practical.start_date_time.$model" />
                </div>
                <div class="field p-fluid">
                    <label for="end_date_time1">End Date Time</label>
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
                <div class = "field p-fluid">
                    <h5>Subject?</h5>
                    <Dropdown v-model="v$.practical.subject_id.$model" :options="subjects" optionLabel="name" optionValue="id" placeholder="Select"/>
                </div>
                <div class="field p-fluid" v-if="practical.subject_id != ''">
                    <h5>Where to Add the Practical?</h5>
                    <div class="grid">
                        <div class="col-12 md:col-4">
                            <div class="field-radiobutton mb-0">
                                <RadioButton id="option1" v-model="v$.practical.add_for_all_classrooms.$model" value="0" @change="getTeacherClassrooms()"/>
                                <label for="option1">Add For All Classrooms &amp; associated batches for selected Subject</label>
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field-radiobutton mb-0">
                                <RadioButton id="option2" value="1" v-model="v$.practical.add_for_all_classrooms.$model" @change="getTeacherClassrooms()"/>
                                <label for="option2">Add For 1 Classroom &amp; associated batches for selected Subject</label>
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field-radiobutton mb-0">
                                <RadioButton id="option3" value="2" v-model="v$.practical.add_for_all_classrooms.$model" @change="getTeacherClassrooms()"/>
                                <label for="option3">Add For a Particular Batch</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field p-fluid" v-if="practical.add_for_all_classrooms == 1 || practical.add_for_all_classrooms == 2">
                    <h5>Select Classroom</h5>
                    <Dropdown v-model="v$.practical.classroom_id.$model" :options="classrooms" optionLabel="name" optionValue="id" placeholder="" @change="getTeacherBatches()"/>
                </div>
                <div class="field p-fluid" v-if="practical.add_for_all_classrooms == 2">
                    <h5>Select Batch</h5>
                    <Dropdown v-model="v$.practical.batch_id.$model" :options="batches" optionLabel="name" optionValue="id" placeholder=""/>
                </div>
                <Button label="Submit" v-on:click="savePractical()" :disabled="v$.practical.$invalid"></Button>
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
    name:"Create Practical",
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
                subject_id: '',
                add_for_all_classrooms:'',
                classroom_id: '',
                batch_id: '',
            },
            late_submissions: [
                { name: 'Yes', id: 1 },
                { name: 'No', id: 0 },
            ],
            visibility_options: [
                { name: 'Published', id: 1 },
                { name: 'Draft', id: 0 },
            ],
            subjects:[],
            classrooms:[],
            batches: [],
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
                add_for_all_classrooms: { required },
                subject_id: { required },
                classroom_id: { numeric },
                batch_id: { numeric },
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
        this.getTeacherSubjects();
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
        getTeacherSubjects() {
            axios.get(`${process.env.VUE_APP_API_URL}/assignments/getTeacherSubjects`, { headers: authHeader() }).then(data => {
                let response = data.data;
                this.subjects = response.data;
            })
        },
        getTeacherClassrooms() {
            if(this.practical.add_for_all_classrooms == 1) {
                this.practical.classroom_id = '';
                axios.get(`${process.env.VUE_APP_API_URL}/assignments/${this.practical.subject_id}/getTeacherClassrooms`, { headers: authHeader() }).then(data => {
                    let response = data.data;
                    this.classrooms = response.data;
                })
            } else if (this.practical.add_for_all_classrooms == 2) {
                this.practical.classroom_id = '';
                this.practical.batch_id = '';
                axios.get(`${process.env.VUE_APP_API_URL}/assignments/${this.practical.subject_id}/getTeacherClassrooms`, { headers: authHeader() }).then(data => {
                    let response = data.data;
                    this.classrooms = response.data;
                })
            }
        },
        getTeacherBatches() {
            if(this.practical.add_for_all_classrooms == 2 && this.practical.classroom_id != '') {
                axios.get(`${process.env.VUE_APP_API_URL}/assignments/${this.practical.classroom_id}/getTeacherBatches`, { headers: authHeader() }).then(data => {
                    let response = data.data;
                    this.batches = response.data;
                })
            }
        },
        savePractical() {
            axios.post(`${process.env.VUE_APP_API_URL}/practicals/store`,this.practical,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.message == 'success') {
                    this.showSuccess();
                    this.redirectAfterSuccess();
                } else {
                    console.log(response);
                }
            })
        },
        redirectToIndexPage() {
            this.$router.push({ name: 'practicals.index' });
        },

    },
}
</script>
