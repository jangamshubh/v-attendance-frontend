<template>
    <div class ="row">
        <Toast />
        <div class="col-12">
            <div class="surface-card p-4 shadow-2 border-round w-full">
                <div class="text-center mb-5">
                    <div class="text-900 text-3xl font-medium mb-3">Reset Password - Step 2: Enter the OTP sent on your mail</div>
                </div>
                <div>
                    <label for="otp1" class="block text-900 font-medium mb-2">Enter OTP</label>
                    <InputText id="otp1" type="text" class="w-full mb-3" v-model="v$.user.otp.$model" />

                    <div class="flex align-items-center justify-content-between mb-6">
                        <router-link class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer" :to="{ name: 'reset-password.generate-otp' }">Back to Step 1 - Generate OTP</router-link>
                    </div>
                    <Button label="Submit OTP" icon="pi pi-user" class="w-full" v-on:click="checkOTP"></Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { required, maxLength, numeric } from '@vuelidate/validators'
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
              otp: { required, max:maxLength(6), numeric },
          }
        }
    },
    created() {
        this.checkUserLogin();
        this.checkStatus();
    },
    methods: {
        checkUserLogin() {
            if (this.checkUser) {
                this.$router.push("/profile");
            }
        },
        toastMessage(message,status) {
            this.$toast.add({ severity: status, summary: message, detail:'', life: 3000 });
        },
        checkStatus() {
            axios.get(`${process.env.VUE_APP_API_URL}/reset-password/${this.$route.params.unique_identifier}/check-status`).then(data => {
                let response = data.data;
                if(response.status == 'success') {
                    if(response.data.otp_verified_time != null) {
                        if(response.data.reset_completed_time == null) {
                            let message = 'You have already verified your OTP, reset your password!';
                            let status = 'error';
                            this.toastMessage(message,status);
                            setTimeout(() => this.$router.push({ name: 'reset-password.add-password', params: { unique_identifier: this.$route.params.unique_identifier }}),1500)
                        } else {
                            let message = 'You have already reset your password!';
                            let status = 'error';
                            this.toastMessage(message,status);
                            setTimeout(() => this.$router.push({ name: 'login' }),1500);
                        }
                    } else {
                        //
                    }
                } else {
                    this.$router.push({ name: 'login'});
                }
            })
        },
        checkOTP() {
            axios.post(`${process.env.VUE_APP_API_URL}/reset-password/${this.$route.params.unique_identifier}/check-otp`,this.user).then(data => {
                let response = data.data;
                // console.log(response);
                if(response.status == 'success') {
                    let message = 'OTP Verified, Now you can change your password';
                    let status = 'success';
                    this.toastMessage(message,status);
                    setTimeout(() => this.$router.push({ name: 'reset-password.add-password', params: { unique_identifier: this.$route.params.unique_identifier }}), 1500)
                }
            })
        },
    },
}
</script>
