<template>
    <div class="grid">
        <div class="col-12">
            <Card>
				<template v-slot:title>
					<div class="flex align-items-center justify-content-between mb-0">
						<h5>View User Details</h5>
                        <Button icon="pi pi-arrow-left" class="p-button-rounded mr-2 mb-2" @click="redirectToUsersIndex()"/>
                    </div>
                </template>
                <template v-slot:content>
                    <table class="min-w-full border divide-y divide-gray-200">
                        <tbody class="bg-white divide-y divide-gray-200 divide-solid">
                            <tr class="bg-white">
                                <th>Name</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                    {{ user.name }}
                                </td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                    {{ user.email }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </template>
            </Card>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import authHeader from '../../services/auth-header';
export default {
    data() {
        return {
            user:{
                name:'',
                email: '',
            },
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
            axios.get(`${process.env.VUE_APP_API_URL}/users/${this.$route.params.id}/show`,{ headers: authHeader() }).then(data => {
                let response = data.data;
                // console.log(response);
                if(response.status == 'Success') {
                    this.user = response.data;
                }
            })
        },
        redirectToUsersIndex() {
            this.$router.push({ name: 'users.index' });
        },
    },
}
</script>
