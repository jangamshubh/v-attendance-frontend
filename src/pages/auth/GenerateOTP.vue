<template>
    <div class ="row">
        <Toast />
        <div class="col-12">
            <div class="surface-card p-4 shadow-2 border-round w-full">
                <div class="text-center mb-5">
                    <div class="text-900 text-3xl font-medium mb-3">Reset Password - Step 1: Enter your email</div>
                </div>
                <div>
                    <label for="email1" class="block text-900 font-medium mb-2">Email</label>
                    <InputText id="email1" type="text" class="w-full mb-3" v-model="v$.user.email.$model" />

                    <div class="flex align-items-center justify-content-between mb-6">
                        <router-link class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer" :to="{ name: 'login' }">Back to login page</router-link>
                    </div>
                    <Button label="Generate OTP" icon="pi pi-user" class="w-full" v-on:click="generateOTP"></Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { required, email } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import axios from 'axios';
export default {
    name:"Login",
    data() {
        return {
            user: {
                email: '',
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
    },
    setup: () => ({ v$: useVuelidate() }),
    validations () {
        return {
          user: {
              email: { required, email },
          }
        }
    },
    created() {
        this.checkUserLogin();
    },
    methods: {
        checkUserLogin() {
            if (this.checkUser) {
                this.$router.push("/profile");
            }
        },
        toastMessage(message,status) {
            this.$toast.add({ severity: status, summary: message, detail: '', life: 3000 });
        },
        generateOTP() {
            axios.post(`${process.env.VUE_APP_API_URL}/reset-password/generate-otp`,this.user).then(data => {
                let response = data.data;
                // console.log(response.status.status);
                if(response.status.status == 'success') {
                    let message = 'OTP Generated Successfully';
                    let status = 'success';
                    this.toastMessage(message,status);
                    setTimeout(() => this.$router.push({ name: 'reset-password.check-otp', params: { unique_identifier: response.unique_identifier }}), 1500)
                }
            })
        },
    },
}
</script>
