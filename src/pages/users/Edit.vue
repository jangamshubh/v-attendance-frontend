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
                <Button label="Submit" v-on:click="updateUser()" :disabled="v$.user.$invalid"></Button>
            </div>
        </div>
    </div>
</template>

<script>
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import axios from 'axios';
import authHeader from '../../services/auth-header';
export default {
    name:"Login",
    data() {
        return {
            user: {
                name: '',
                roll_number: '',
            },
        };
    },
    setup: () => ({ v$: useVuelidate() }),
    validations () {
        return {
          user: {
            name: { required },
            roll_number: { required },
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
        },
    },
    created() {
        this.checkUserLogin();
        this.checkUserRole();
        this.getUser();
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
        getUser() {
            axios.get(`${process.env.VUE_APP_API_URL}/users/${this.$route.params.id}/edit`,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'Success') {
                    this.user = response.data;
                }
            })
        },
        showSuccess() {
            this.$toast.add({ severity:'success', summary: 'Success Message', detail:'Message Detail', life: 3000 });
        },
        redirectAfterSuccess() {
            setTimeout(() => this.$router.push("/users"), 3000)
        },
        updateUser() {
            axios.put(`${process.env.VUE_APP_API_URL}/users/${this.$route.params.id}/update`,this.user,{ headers: authHeader() }).then(data => {
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
            this.$router.push({ name: 'users.index' });
        },

    },
}
</script>
