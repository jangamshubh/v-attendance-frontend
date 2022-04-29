<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <Toast />
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Edit Profile</h5>
                    <Button type="button" icon="pi pi-arrow-left" label="Back To Index Page" class="p-button-outlined mb-2" @click="redirectToProfile()" />
                </div>
                <div class="field p-fluid">
                    <label for="name1">Name</label>
                    <InputText id="name1" type="text" v-model="v$.user.name.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="contact_email1">Contact Email</label>
                    <InputText id="contact_email1" type="email" v-model="v$.user.contact_email.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="mobile_number1">Mobile Number</label>
                    <InputText id="mobile_number1" type="text" v-model="v$.user.mobile_number.$model"/>
                </div>
                <Button label="Submit" v-on:click="updateProfile()" :disabled="v$.user.$invalid"></Button>
            </div>
        </div>
    </div>
</template>

<script>
import { required, minLength, maxLength, email, numeric } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import axios from 'axios';
import authHeader from '../../services/auth-header';
export default {
    name:"Login",
    data() {
        return {
            user: {
                name: '',
                contact_email: '',
                mobile_number:'',
            },
        };
    },
    setup: () => ({ v$: useVuelidate() }),
    validations () {
        return {
            user: {
              name: { required, min: minLength(3), max: maxLength(50) },
              contact_email: { required, email },
              mobile_number : { required, numeric, max: maxLength(10) },
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
        this.getProfile();
    },
    mounted() {
    },
    methods: {
        checkUserLogin() {
            if (!this.loggedIn) {
                this.$router.push("/login");
            }
        },
        getProfile() {
            axios.get(`${process.env.VUE_APP_API_URL}/profile/getProfile`,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'success') {
                    this.user = response.data;
                } else {
                    this.toastMessage(response.message,response.status);
                }
            })
        },
        toastMessage(message,status) {
            this.$toast.add({ severity: status, summary: message, detail: '', life: 3000 });
        },
        redirectAfterSuccess() {
            setTimeout(() => this.$router.push({ name: 'profile' }), 3000)
        },
        updateProfile() {
            axios.put(`${process.env.VUE_APP_API_URL}/profile/update`,this.user,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'success') {
                    this.toastMessage(response.message,response.status);
                    this.redirectAfterSuccess();
                } else {
                    console.log('error');
                }
            })
        },
        redirectToProfile() {
            this.$router.push({ name: 'profile' });
        },


    },
}
</script>
