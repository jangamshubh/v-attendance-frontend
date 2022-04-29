<template>
    <div class="grid panel-demo">
        <div class="col-6">
            <div class="card">
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Profile Details</h5>
                    <Button type="button" icon="pi pi-pencil" label="Edit Profile" class="p-button-outlined mb-2" @click="redirectToEditProfile()"/>
                </div>
                <h5>Name: {{ user.name }}</h5>
                <h5>Roll Number: {{ user.roll_number }}</h5>
                <h5>Login Email: {{ user.email }}</h5>
                <h5>Contact Email: {{ user.contact_email }}</h5>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import authHeader from '../../services/auth-header';
export default {
    name: 'Profile',
    data() {
        return {
            user: {},
        }
    },
    computed: {
        currentUser() {
            return this.$store.state.auth.user;
        },
        currentAccessToken() {
            return this.$store.state.auth.access_token;
        }
    },
    created() {
        if (!this.currentUser) {
            this.$router.push('/login');
        }
    },
    mounted() {
        this.getProfile();
    },
    methods: {
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
        redirectToEditProfile() {
            this.$router.push({ name: 'profile.edit' });
        },
    },
};
</script>

<style scoped>

</style>
