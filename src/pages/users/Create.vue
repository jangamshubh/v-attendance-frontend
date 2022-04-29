<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <Toast />
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Create User</h5>
                    <Button type="button" icon="pi pi-arrow-left" label="Back To Index Page" class="p-button-outlined mb-2" @click="redirectToIndexPage()" />
                </div>
                <div class="field p-fluid">
                    <label for="name1">Name</label>
                    <InputText id="name1" type="text" v-model="v$.user.name.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="roll1">Roll Number</label>
                    <InputText id="roll1" type="text" v-model="v$.user.roll_number.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="email1">Email</label>
                    <InputText id="email1" type="text" v-model="v$.user.email.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="mobile1">Mobile Number</label>
                    <InputText id="mobile1" type="text" v-model="v$.user.mobile_number.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="password1">Password</label>
                    <InputText id="password1" type="password" v-model="v$.user.password.$model"/>
                </div>
                <div class="field p-fluid">
                    <h5>Select Role</h5>
                    <Dropdown v-model="v$.user.role.$model" :options="roles" optionLabel="name" optionValue="id" placeholder="Select Role for User"/>
                </div>
                <Button label="Submit" v-on:click="saveUser()" :disabled="v$.user.$invalid"></Button>
            </div>
        </div>
    </div>
</template>

<script>
import { email, required, minLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import axios from 'axios';
import authHeader from '../../services/auth-header';
export default {
    name:"Login",
    data() {
        return {
            user: {
                name: '',
                email: '',
                roll_number: '',
                mobile_number: '',
                password: '',
                role: '',
            },
            roles: [],
        };
    },
    setup: () => ({ v$: useVuelidate() }),
    validations () {
        return {
          user: {
            name: { required },
            roll_number: { required },
            mobile_number: { required },
            email: { required, email },
            password: { required, min: minLength(6)},
            role: { required },
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
         this.getRoles();
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
        showSuccess() {
            this.$toast.add({ severity:'success', summary: 'Success Message', detail:'Message Detail', life: 3000 });
        },
        redirectAfterSuccess() {
            setTimeout(() => this.$router.push("/users"), 3000)
        },
        getRoles() {
            axios.get(`${process.env.VUE_APP_API_URL}/roles`, { headers: authHeader() }).then(data => {
                let response = data.data;
                this.roles = response.data;
            })
        },
        saveUser() {
            axios.post(`${process.env.VUE_APP_API_URL}/users/store`,this.user,{ headers: authHeader() }).then(data => {
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
