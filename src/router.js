import { createRouter, createWebHashHistory } from 'vue-router';
import Dashboard from './components/Dashboard.vue';

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: Dashboard,
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('./pages/auth/Login.vue'),
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('./pages/profile/Profile.vue'),
    },
    {
        path: '/profile/edit',
        name: 'profile.edit',
        component: () => import('./pages/profile/EditProfile.vue'),
    },
    {
        path: '/users',
        name: 'users.index',
        component: () => import('./pages/users/Index.vue'),
    },
    {
        path: '/users/create',
        name: 'users.create',
        component: () => import('./pages/users/Create.vue'),
    },
    {
        path: '/users/:id/edit',
        name: 'users.edit',
        component: () => import('./pages/users/Edit.vue'),
    },
    {
        path: '/users/:id/show',
        name: 'users.show',
        component: () => import('./pages/users/Show.vue'),
    },
    {
        path: '/users/import',
        name: 'users.import',
        component: () => import('./pages/users/Import.vue'),
    },
    {
        path: '/users/update-roll-numbers',
        name: 'users.update-roll-numbers',
        component: () => import('./pages/users/UpdateRollNumberImport.vue'),
    },
    {
        path: '/roles',
        name: 'roles.index',
        component: () => import('./pages/roles/Index.vue'),
    },
    {
        path: '/roles/create',
        name: 'roles.create',
        component: () => import('./pages/roles/Create.vue'),
    },
    {
        path: '/roles/:id/edit',
        name: 'roles.edit',
        component: () => import('./pages/roles/Edit.vue'),
    },
    {
        path: '/roles/:id/show',
        name: 'roles.show',
        component: () => import('./pages/roles/Show.vue'),
    },

    {
        path: '/subjects',
        name: 'subjects.index',
        component: () => import('./pages/subjects/Index.vue'),
    },
    {
        path: '/subjects/create',
        name: 'subjects.create',
        component: () => import('./pages/subjects/Create.vue'),
    },
    {
        path: '/subjects/:id/edit',
        name: 'subjects.edit',
        component: () => import('./pages/subjects/Edit.vue'),
    },
    {
        path: '/subjects/:id/show',
        name: 'subjects.show',
        component: () => import('./pages/subjects/Show.vue'),
    },

    {
        path: '/colleges',
        name: 'colleges.index',
        component: () => import('./pages/colleges/Index.vue'),
    },
    {
        path: '/colleges/create',
        name: 'colleges.create',
        component: () => import('./pages/colleges/Create.vue'),
    },
    {
        path: '/colleges/:id/edit',
        name: 'colleges.edit',
        component: () => import('./pages/colleges/Edit.vue'),
    },
    {
        path: '/colleges/:id/show',
        name: 'colleges.show',
        component: () => import('./pages/colleges/Show.vue'),
    },

    {
        path: '/attendances',
        name: 'attendances.index',
        component: () => import('./pages/attendances/Index.vue'),
    },
    {
        path: '/attendances/create',
        name: 'attendances.create',
        component: () => import('./pages/attendances/Create.vue'),
    },
    {
        path: '/attendances/:attendance_id/edit',
        name: 'attendances.edit',
        component: () => import('./pages/attendances/Edit.vue'),
    },
    {
        path: '/attendances/:attendance_id/show',
        name: 'attendances.show',
        component: () => import('./pages/attendances/Show.vue'),
    },
    {
        path: '/attendances/:attendance_id/take-attendance',
        name: 'attendances.take-attendance',
        component: () => import('./pages/attendances/TakeAttendance.vue'),
    },
    {
        path: '/attendances/:attendance_id/duplicate-attendance',
        name: 'attendances.duplicate-attendance',
        component: () => import('./pages/attendances/Duplicate.vue'),
    },

];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
