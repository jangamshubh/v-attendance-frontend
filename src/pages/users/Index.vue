<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <div class="card-header flex justify-content-between flex-column sm:flex-row">
                    <h5>Users</h5>
                    <Button type="button" icon="pi pi-plus" class="p-button-outlined mb-2" label="Add" @click="redirectToCreatePage()"/>
                    <Button type="button" icon="pi pi-cloud-upload" class="p-button-outlined mb-2" label="Import" @click="redirectToImportPage()"/>
                </div>
                <DataTable :value="users" :paginator="true" class="p-datatable-gridlines" :rows="10" dataKey="id" :rowHover="true"
                v-model:filters="filters1" filterDisplay="menu" :loading="loading1" :filters="filters1" responsiveLayout="scroll"
                :globalFilterFields="['name','email','role']" >

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
                    No customers found.
                </template>
                <template #loading>
                    Loading users data. Please wait.
                </template>
                <Column field="name" header="Name" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.name}}
                    </template>
                    <template #filter="{filterModel}">
                        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
                    </template>
                </Column>
                <Column field="email" header="Email" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.email}}
                    </template>
                    <template #filter="{filterModel}">
                        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by email"/>
                    </template>
                </Column>
                <Column>
                    <template #body="data">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editUser(data.data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mr-2" @click="confirmDeleteUser(data.data)" />
                        <Button icon="pi pi-eye" class="p-button-rounded p-button-info mr-2" @click="showUser(data.data)" />
                    </template>
                </Column>
            </DataTable>
            <Dialog v-model:visible="deleteUserDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
                <div class="flex align-items-center justify-content-center">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="user">Are you sure you want to delete <b>{{ user_data.name }}</b>?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUserDialog = false"/>
                    <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteUser(user_data.id)" />
                </template>
            </Dialog>
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
            users: null,
            filters1: null,
            filters2: {},
            loading1: true,
            loading2: true,
            deleteUserDialog: false,
        }
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
        user() {
            return this.$store.state.auth.user;
        },
        role() {
            return this.$store.state.auth.role;
        },
    },
    created() {
        this.checkUserLogin();
        this.checkUserRole();
        this.initFilters1();
    },
    mounted() {
        this.getAllUsers();
    },
    methods: {
        checkUserLogin() {
            if (!this.loggedIn) {
                this.$router.push("/login");
            }
        },
        checkUserRole() {
            if(this.role != 'Super Admin') {
               this.$router.push("/");
           }
        },
        showDeleteSuccess() {
            this.$toast.add({ severity:'success', summary: 'Success Message', detail:'Message Detail', life: 3000 });
        },
        getAllUsers() {
            axios.get(`${process.env.VUE_APP_API_URL}/users`, { headers: authHeader() }).then(data => {
                this.users = data.data.data;
                this.loading1 = false;
            })
            this.loading2 = false;
        },
        initFilters1() {
            this.filters1 = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
                'name': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
                'email': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
            }
        },
        clearFilter1() {
            this.initFilters1();
        },
        editUser(data) {
            this.$router.push({ name: 'users.edit', params: { id: data.id }});
        },
        showUser(data) {
            this.$router.push({ name: 'users.show', params: { id: data.id }});
        },
        confirmDeleteUser(data) {
			this.user_data = data;
			this.deleteUserDialog = true;
		},
        deleteUser(id){
            axios.get(`${process.env.VUE_APP_API_URL}/users/${id}/delete`, { headers: authHeader() }).then(() => {
                this.getAllUsers();
                this.deleteUserDialog = false;
                this.showDeleteSuccess();
            })
        },
        redirectToCreatePage() {
            this.$router.push({ name: 'users.create' });
        },
        redirectToImportPage() {
            this.$router.push({ name: 'users.import' });
        }
    },

}
</script>

<style scoped lang="scss">

</style>
