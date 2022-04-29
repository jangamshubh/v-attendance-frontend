<template>
	<div class="layout-topbar">
		<router-link to="/" class="layout-topbar-logo">
			<span>V - Attendance</span>
		</router-link>
		<button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
			<i class="pi pi-bars"></i>
		</button>

		<button class="p-link layout-topbar-menu-button layout-topbar-button"
		v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein',
		leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true}">
			<i class="pi pi-ellipsis-v"></i>
		</button>
		<ul class="layout-topbar-menu hidden lg:flex origin-top">
			<li>
				<button class="p-link layout-topbar-button" @click.prevent="logOut">
					<i class="pi pi-power-off"></i>
					<span>Logout</span>
				</button>
			</li>
			<li>
				<button class="p-link layout-topbar-button" @click="redirectToProfile">
					<i class="pi pi-user"></i>
					<span>Profile</span>
				</button>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	methods: {
		logOut() {
			this.$store.dispatch('auth/logout');
			window.location.href = process.env.VUE_APP_URL;
		},
		onMenuToggle(event) {
			this.$emit('menu-toggle', event);
		},
		onTopbarMenuToggle(event) {
			this.$emit('topbar-menu-toggle', event);
		},
		topbarImage() {
			return this.$appState.darkTheme ? 'images/logo-white.svg' : 'images/logo-dark.svg';
		},
		redirectToProfile() {
			this.$router.push({ name: 'profile' });
		},
	},
	computed: {
		darkTheme() {
			return this.$appState.darkTheme;
		}
	}
}
</script>
