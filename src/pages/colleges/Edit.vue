<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <Toast />
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Edit College</h5>
                    <Button type="button" icon="pi pi-arrow-left" label="Back To Index Page" class="p-button-outlined mb-2" @click="redirectToIndexPage()" />
                </div>
                <div class="field p-fluid">
                    <label for="name1">Name</label>
                    <InputText id="name1" type="text" v-model="v$.college.name.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="year_of_establishment1">Year Of Establishment</label>
                    <InputText id="year_of_establishment1" type="text" v-model="v$.college.year_of_establishment.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="aicte_id1">AICTE Code</label>
                    <InputText id="aicte_id1" type="text" v-model="v$.college.aicte_id.$model"/>
                </div>
                <div class="field p-fluid">
                    <h5>Select Admin</h5>
                    <Dropdown v-model="v$.college.admin_id.$model" :options="admins" optionLabel="name" optionValue="id" placeholder="Select Admin for College" />
                </div>
                <Button label="Submit" v-on:click="updateCollege()" :disabled="v$.college.$invalid"></Button>
            </div>
        </div>
    </div>
</template>

<script>
import { required, minLength, maxLength, numeric } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import axios from 'axios';
import authHeader from '../../services/auth-header';
export default {
    name:"Login",
    data() {
        return {
            college: {
                name: '',
                year_of_establishment: '',
                aicte_id:'',
                admin_id: '',
            },
            admins: [],
        };
    },
    setup: () => ({ v$: useVuelidate() }),
    validations () {
        return {
            college: {
              name: { required, min: minLength(3), max: maxLength(50) },
              year_of_establishment: { required, numeric },
              aicte_id : { required },
              admin_id : { required, numeric },
            }
        }
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
        checkRole() {
            return this.$store.state.auth.role;
        },
    },
    created() {
        this.checkUserLogin();
        this.checkUserRole();
        this.getAllCollegeAdmins();
    },
    mounted() {
        this.getCollege();
    },
    methods: {
        checkUserLogin() {
            if (!this.loggedIn) {
                this.$router.push("/login");
            }
        },
        checkUserRole() {
            if(this.checkRole != 'Super Admin') {
               this.$router.push("/");
            }
        },
        getAllCollegeAdmins() {
            axios.get(`${process.env.VUE_APP_API_URL}/users/getAllCollegeAdmins`, { headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'Success') {
                    this.admins = response.data;
                }
            })
        },
        getCollege() {
            axios.get(`${process.env.VUE_APP_API_URL}/colleges/${this.$route.params.id}/edit`,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'Success') {
                    this.college = response.data;
                }
            })
        },
        showSuccess() {
            this.$toast.add({ severity:'success', summary: 'Success Message', detail:'Message Detail', life: 3000 });
        },
        redirectAfterSuccess() {
            setTimeout(() => this.$router.push({ name: 'colleges.index' }), 3000)
        },
        updateCollege() {
            axios.put(`${process.env.VUE_APP_API_URL}/colleges/${this.$route.params.id}/update`,this.college,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'Success') {
                    this.showSuccess();
                    this.redirectAfterSuccess();
                } else {
                    console.log('error');
                }
            })
        },
        redirectToIndexPage() {
            this.$router.push({ name: 'colleges.index' });
        },


    },
}
</script>
