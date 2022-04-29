<template>
    <div class="grid">
        <div class="col-12">
            <Card>
				<template v-slot:title>
					<div class="flex align-items-center justify-content-between mb-0">
						<h5>View Role Details</h5>
                        <Button icon="pi pi-arrow-left" class="p-button-rounded mr-2 mb-2" @click="redirectToRolesIndex()"/>
                    </div>
                </template>
                <template v-slot:content>
                    <table class="min-w-full border divide-y divide-gray-200">
                        <tbody class="bg-white divide-y divide-gray-200 divide-solid">
                            <tr class="bg-white">
                                <th>Name</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                    {{ role.name }}
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
            role:{
                name:'',
            },
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
        this.getRole();
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
        getRole() {
            axios.get(`${process.env.VUE_APP_API_URL}/roles/${this.$route.params.id}/show`,{ headers: authHeader() }).then(data => {
                let response = data.data;
                // console.log(response.data[0]);
                if(response.message == 'success') {
                    this.role = response.data[0];
                }
            })
        },
        redirectToRolesIndex() {
            this.$router.push({ name: 'roles.index' });
        },
    },
}
</script>
