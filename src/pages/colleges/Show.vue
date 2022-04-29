<template>
    <div class="grid">
        <div class="col-12">
            <Card>
				<template v-slot:title>
					<div class="flex align-items-center justify-content-between mb-0">
						<h5>View College Details</h5>
                        <Button icon="pi pi-arrow-left" class="p-button-rounded mr-2 mb-2" @click="redirectToIndex()"/>
                    </div>
                </template>
                <template v-slot:content>
                    <table class="min-w-full border divide-y divide-gray-200">
                        <tbody class="bg-white divide-y divide-gray-200 divide-solid">
                            <tr class="bg-white">
                                <th>Name</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                    {{ college.name }}
                                </td>
                            </tr>
                            <tr class="bg-white">
                                <th>Year of Establishment</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                    {{ college.year_of_establishment }}
                                </td>
                            </tr>
                            <tr class="bg-white">
                                <th>AICTE ID</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                    {{ college.aicte_id }}
                                </td>
                            </tr>
                            <tr class="bg-white">
                                <th>Admin</th>
                                <td class="px-6 py-4 text-sm leading-5 text-gray-900 whitespace-no-wrap">
                                    {{ college.college_get_admins.name }} - {{ college.college_get_admins.email }}
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
            college:{
                name:'',
                year_of_establishment: '',
                aicte_id: '',
                college_get_admins: {
                    name: '',
                    email: '',
                },
            },
        }
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
        checkRole() {
            return this.$store.state.auth.role;
        }
    },
    created() {
        this.checkUserLogin();
        this.checkUserRole();
        this.getCollege();
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
        getCollege() {
            axios.get(`${process.env.VUE_APP_API_URL}/colleges/${this.$route.params.id}/show`,{ headers: authHeader() }).then(data => {
                let response = data.data;
                if(response.status == 'Success') {
                    this.college = response.data;
                }
            })
        },
        redirectToIndex() {
            this.$router.push({ name: 'colleges.index' });
        },
    },
}
</script>
