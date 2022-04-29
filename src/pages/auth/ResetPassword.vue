<template>
    <div class ="row">
        <Toast />
        <div class="col-12">
            <div class="surface-card p-4 shadow-2 border-round w-full">
                <div class="text-center mb-5">
                    <div class="text-900 text-3xl font-medium mb-3">Step 3: Add New Password</div>
                </div>
                <div>
                    <label for="password1" class="block text-900 font-medium mb-2">New Password</label>
                    <InputText id="password1" type="password" class="w-full mb-3" v-model="v$.user.password.$model" />

                    <div class="flex align-items-center justify-content-between mb-6">
                        <router-link class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer" :to="{ name: 'reset-password.generate-otp' }">Go back to Step 1</router-link>
                    </div>

                    <Button label="Change Password" icon="pi pi-user" class="w-full" v-on:click="resetPassword"></Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { required, minLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import axios from 'axios';
export default {
    name:"Login",
    data() {
        return {
            user: {
                password: '',
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
                password: { required, min:minLength(6) },
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
            this.$toast.add({ severity: status, summary: message, detail:'', life: 3000 });
        },
        checkStatus() {
            axios.get(`${process.env.VUE_APP_API_URL}/reset-password/${this.$route.params.unique_identifier}/check-status`).then(data => {
                let response = data.data;
                if(response.status == 'success') {
                    if(response.data.reset_completed_time != null) {
                        if(response.data.otp_verified_time == null) {
                            let message = 'You have not verified your OTP, reset your password!';
                            let status = 'error';
                            this.toastMessage(message,status);
                            setTimeout(() => this.$router.push({ name: 'reset-password.check-otp', params: { unique_identifier: this.$route.params.unique_identifier }}), 3000)
                        } else {
                            let message = 'You have already reset your password!';
                            let status = 'error';
                            this.toastMessage(message,status);
                            this.$router.push({ name: 'login' });
                        }
                    } else {
                        //
                    }
                } else {
                    this.$router.push({ name: 'login'});
                }
            })
        },
        resetPassword() {
            axios.post(`${process.env.VUE_APP_API_URL}/reset-password/${this.$route.params.unique_identifier}/change-password`,this.user).then(data => {
                let response = data.data;
                if(response.status == 'success') {
                    let message = 'Password Changed, now you can login with new password!';
                    let status = 'success';
                    this.toastMessage(message,status);
                    setTimeout(() => this.$router.push({ name: 'login' }), 1500)
                }
            })
        },
    },
}
</script>
