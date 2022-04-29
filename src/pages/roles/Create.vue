<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <Toast />
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Create Role</h5>
                    <Button type="button" icon="pi pi-arrow-left" label="Back To Index Page" class="p-button-outlined mb-2" @click="redirectToIndexPage()" />
                </div>
                <div class="field p-fluid">
                    <label for="name1">Name</label>
                    <InputText id="name1" type="text" v-model="v$.role.name.$model"/>
                </div>
                <Button label="Submit" v-on:click="saveRole()" :disabled="v$.role.$invalid"></Button>
            </div>
        </div>
    </div>
</template>

<script>
import { required, minLength,maxLength } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import axios from 'axios';
import authHeader from '../../services/auth-header';
export default {
    name:"Create Role",
    data() {
        return {
            role: {
                name: '',
            },
        };
    },
    setup: () => ({ v$: useVuelidate() }),
    validations () {
        return {
          role: {
            name: { required, min: minLength(3), max: maxLength(50) },
          }
        }
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
        checkRole() {
            if(this.$store.state.auth.role != 'Super Admin') {
                return false;
            }
            return true;
        }
    },
    created() {
        this.checkUserLogin();
        this.checkUserRole();
    },
    methods: {
        checkUserLogin() {
            if (!this.loggedIn) {
                this.$router.push("/login");
            }
        },
        checkUserRole() {
            if(!this.checkRole) {
               this.$router.push("/");
            }
        },
        showSuccess() {
            this.$toast.add({ severity:'success', summary: 'Success Message', detail:'Message Detail', life: 3000 });
        },
        redirectAfterSuccess() {
            setTimeout(() => this.$router.push("/roles"), 3000)
        },
        saveUser() {
            axios.post(`${process.env.VUE_APP_API_URL}/roles/store`,this.role,{ headers: authHeader() }).then(data => {
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
            this.$router.push({ name: 'roles.index' });
        },

    },
}
</script>
