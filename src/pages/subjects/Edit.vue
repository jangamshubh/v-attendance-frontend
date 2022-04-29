<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <Toast />
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Edit Subject</h5>
                    <Button type="button" icon="pi pi-arrow-left" label="Back To Index Page" class="p-button-outlined mb-2" @click="redirectToIndexPage()" />
                </div>
                <div class="field p-fluid">
                    <label for="name1">Name</label>
                    <InputText id="name1" type="text" v-model="v$.subject.name.$model"/>
                </div>
                <div class="field p-fluid">
                    <label for="code1">Code</label>
                    <InputText id="code1" type="text" v-model="v$.subject.code.$model"/>
                </div>
                <Button label="Submit" v-on:click="updateSubject()" :disabled="v$.subject.$invalid"></Button>
            </div>
        </div>
    </div>
</template>

<script>
import { required, minLength, maxLength} from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import axios from 'axios';
import authHeader from '../../services/auth-header';
export default {
    name:"Login",
    data() {
        return {
            subject: {
                name: '',
                code: '',
            },
        };
    },
    setup: () => ({ v$: useVuelidate() }),
    validations () {
        return {
            subject: {
              name: { required, min: minLength(3), max: maxLength(50) },
              code: { required, min: minLength(3), max: maxLength(50) },
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
        this.getSubject();
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
        getSubject() {
            axios.get(`${process.env.VUE_APP_API_URL}/subjects/${this.$route.params.id}/edit`,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'Success') {
                    this.subject = response.data;
                }
            })
        },
        showSuccess() {
            this.$toast.add({ severity:'success', summary: 'Success Message', detail:'Message Detail', life: 3000 });
        },
        redirectAfterSuccess() {
            setTimeout(() => this.$router.push({ name: 'subjects.index' }), 3000)
        },
        updateSubject() {
            axios.put(`${process.env.VUE_APP_API_URL}/subjects/${this.$route.params.id}/update`,this.subject,{ headers: authHeader() }).then(data => {
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
            this.$router.push({ name: 'subjects.index' });
        },


    },
}
</script>
