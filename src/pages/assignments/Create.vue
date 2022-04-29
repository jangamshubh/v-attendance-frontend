<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <Toast />
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Create Assignment</h5>
                    <Button type="button" icon="pi pi-arrow-left" label="Back To Index Page" class="p-button-outlined mb-2" @click="redirectToIndexPage()" />
                </div>
                <div class="field p-fluid">
                    <label for="name1">Name</label>
                    <InputText id="name1" type="text" v-model="v$.assignment.name.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="description1">Description</label>
                    <Textarea id="description1" type="text" v-model="v$.assignment.description.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="rubric1">Rubric</label>
                    <Textarea id="rubric1" type="text" v-model="v$.assignment.rubric.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="start_date_time1">Assignment Start Date Time</label>
                    <Datepicker id="start_date_time1" v-model="v$.assignment.start_date_time.$model" />
                </div>
                <div class="field p-fluid">
                    <label for="end_date_time1">Assignment End Date Time</label>
                    <Datepicker id="end_date_time1" v-model="v$.assignment.end_date_time.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="total_marks1">Total Marks</label>
                    <InputText id="total_marks1" type="text" v-model="v$.assignment.total_marks.$model"/>
                </div>
                <div class="field p-fluid">
                    <h5>Allow Late Submission?</h5>
                    <Dropdown v-model="v$.assignment.allow_late_submision.$model" :options="late_submissions" optionLabel="name" optionValue="id" placeholder="Yes / No"/>
                </div>
                <div class="field p-fluid">
                    <label for="more_info_link1">Additional Information Link</label>
                    <InputText id="more_info_link1" type="text" v-model="v$.assignment.more_info_link.$model"/>
                </div>
                <div class="field p-fluid">
                    <h5>Visibility?</h5>
                    <Dropdown v-model="v$.assignment.visibility.$model" :options="visibility_options" optionLabel="name" optionValue="id" placeholder="Draft / Published"/>
                </div>
                <div class = "field p-fluid">
                    <h5>Subject?</h5>
                    <Dropdown v-model="v$.assignment.subject_id.$model" :options="subjects" optionLabel="name" optionValue="id" placeholder="Select"/>
                </div>
                <div class="field p-fluid" v-if="assignment.subject_id != ''">
                    <h5>Where to Add the Assignment?</h5>
                    <div class="grid">
                        <div class="col-12 md:col-4">
                            <div class="field-radiobutton mb-0">
                                <RadioButton id="option1" v-model="v$.assignment.add_for_all_classrooms.$model" value="0" @change="getTeacherClassrooms()"/>
                                <label for="option1">Add For All Classrooms &amp; associated batches for selected Subject</label>
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field-radiobutton mb-0">
                                <RadioButton id="option2" value="1" v-model="v$.assignment.add_for_all_classrooms.$model" @change="getTeacherClassrooms()"/>
                                <label for="option2">Add For 1 Classroom &amp; associated batches for selected Subject</label>
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="field-radiobutton mb-0">
                                <RadioButton id="option3" value="2" v-model="v$.assignment.add_for_all_classrooms.$model" @change="getTeacherClassrooms()"/>
                                <label for="option3">Add For a Particular Batch</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field p-fluid" v-if="assignment.add_for_all_classrooms == 1 || assignment.add_for_all_classrooms == 2">
                    <h5>Select Classroom</h5>
                    <Dropdown v-model="v$.assignment.classroom_id.$model" :options="classrooms" optionLabel="name" optionValue="id" placeholder="" @change="getTeacherBatches()"/>
                </div>
                <div class="field p-fluid" v-if="assignment.add_for_all_classrooms == 2">
                    <h5>Select Batch</h5>
                    <Dropdown v-model="v$.assignment.batch_id.$model" :options="batches" optionLabel="name" optionValue="id" placeholder=""/>
                </div>
                <Button label="Submit" v-on:click="saveAssignment()" :disabled="v$.assignment.$invalid"></Button>
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
            assignment: {
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
            assignment: {
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
                this.$router.push({ name: 'assignments.index' });
            }
        },
        showSuccess(status,message) {
            this.$toast.add({ severity: status, summary: message, detail: message, life: 3000 });
        },
        redirectAfterSuccess() {
            setTimeout(() => this.$router.push({ name: 'assignments.index'}), 3000)
        },
        getTeacherSubjects() {
            axios.get(`${process.env.VUE_APP_API_URL}/batch-teacher-subjects/getTeacherSubjects`, { headers: authHeader() }).then(data => {
                let response = data.data;
                this.subjects = response.data;
            })
        },
        getTeacherClassrooms() {
            if(this.assignment.add_for_all_classrooms == 1) {
                this.assignment.classroom_id = '';
                axios.get(`${process.env.VUE_APP_API_URL}/batch-teacher-subjects/${this.assignment.subject_id}/getTeacherClassrooms`, { headers: authHeader() }).then(data => {
                    let response = data.data;
                    this.classrooms = response.data;
                })
            } else if (this.assignment.add_for_all_classrooms == 2) {
                this.assignment.classroom_id = '';
                this.assignment.batch_id = '';
                axios.get(`${process.env.VUE_APP_API_URL}/batch-teacher-subjects/${this.assignment.subject_id}/getTeacherClassrooms`, { headers: authHeader() }).then(data => {
                    let response = data.data;
                    this.classrooms = response.data;
                })
            }
        },
        getTeacherBatches() {
            if(this.assignment.add_for_all_classrooms == 2 && this.assignment.classroom_id != '') {
                axios.get(`${process.env.VUE_APP_API_URL}/batch-teacher-subjects/${this.assignment.classroom_id}/getTeacherBatches`, { headers: authHeader() }).then(data => {
                    let response = data.data;
                    this.batches = response.data;
                })
            }
        },
        saveAssignment() {
            axios.post(`${process.env.VUE_APP_API_URL}/assignments/store`,this.assignment,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'success') {
                    let status = response.status;
                    let message = response.message;
                    this.showSuccess(status,message);
                    this.redirectAfterSuccess();
                } else {
                    console.log(response);
                }
            })
        },
        redirectToIndexPage() {
            this.$router.push({ name: 'assignments.index' });
        },

    },
}
</script>
