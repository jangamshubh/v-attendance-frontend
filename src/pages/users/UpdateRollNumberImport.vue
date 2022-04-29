<template>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <Toast />
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Import Users</h5>
                    <Button type="button" icon="pi pi-arrow-left" label="Back To Index Page" class="p-button-outlined mb-2" @click="redirectToIndexPage()" />
                </div>
                <form @submit="submitForm" enctype="multipart/form-data" method="post">
                    <div class="field p-fluid">
                        <label for="file_input1">Select CSV File</label><br>
                        <input type="file" name="filename" class="custom-file-input" id="file_input1" v-on:change="onFileChange">
                    </div>
                    <Button label="Submit" type="submit" value="Upload"></Button>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import FormData from 'form-data';
export default {
    mounted() {
        console.log('Component successfully mounted.')
    },
    data() {
        return {
            filename: '',
            file: '',
            success: ''
        };
    },
    methods: {
        onFileChange(e) {
            this.file = e.target.files[0];
        },
        submitForm(e) {
            e.preventDefault();
            let currentObj = this;
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user_access_token')),
                }
            }
            let data = new FormData();
            data.append('file', this.file);
            axios.post(`${process.env.VUE_APP_API_URL}/users/update-roll-numbers`, data, config)
            .then(data => {
                let response = data.data;
                if(response.status == 'Success') {
                    this.$router.push({ name: 'users.index' });
                }
            })
            .catch(function (error) {
                currentObj.output = error;
            });
        },
        redirectToIndexPage() {
            this.$router.push({ name: 'users.index' });
        }
    }
}
</script>
