<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Roles</h5>
                    <Button type="button" icon="pi pi-plus" label="Create Role" class="p-button-outlined mb-2" @click="redirectToCreatePage()"/>
                </div>
                <DataTable :value="roles" :paginator="true" class="p-datatable-gridlines" :rows="10" dataKey="id" :rowHover="true"
                v-model:filters="filters1" filterDisplay="menu" :loading="loading1" :filters="filters1" responsiveLayout="scroll"
                :globalFilterFields="['title']" >
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2" @click="clearFilter1()"/>
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%"/>
                            </span>
                        </div>
                    </template>
                    <template #empty>
                        No Data found.
                    </template>
                    <template #loading>
                        Loading users data. Please wait.
                    </template>
                    <Column field="title" header="Title" style="min-width:12rem">
                        <template #body="{data}">
                            {{data.name}}
                        </template>
                        <template #filter="{filterModel}">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
                        </template>
                    </Column>
                    <Column>
                        <template #body="data">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editRole(data.data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
<script>
import { FilterMatchMode,FilterOperator } from 'primevue/api';
import axios from 'axios'
import authHeader from '../../services/auth-header';
export default {
    data() {
        return {
            roles: null,
            filters1: null,
            filters2: {},
            loading1: true,
            loading2: true,
            deleteRoleDialog: false,
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
        this.initFilters1();
    },
    mounted() {
        this.getAllRoles();
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
        getAllRoles() {
            axios.get(`${process.env.VUE_APP_API_URL}/roles`, { headers: authHeader() }).then(data => {
                console.log(data.data.data)
                this.roles = data.data.data;
                this.loading1 = false;
            })
            this.loading2 = false;
        },
        initFilters1() {
            this.filters1 = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
                'title': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
            }
        },
        clearFilter1() {
            this.initFilters1();
        },
        editRole(data) {
            this.$router.push({ name: 'roles.edit', params: { id: data.id }});
        },
        redirectToCreatePage() {
            this.$router.push({ name: 'roles.create' });
        },
    },

}
</script>

<style scoped lang="scss">

</style>
