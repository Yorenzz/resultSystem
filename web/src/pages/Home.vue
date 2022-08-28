<script setup>
import storage  from '../utils/storage.js'
import LeftNav from '../components/LeftNav.vue'
import BreadCrumb from '../components/BreadCrumb.vue'
</script>

<template>
	<div class="basic-layout">
		<div class="nav-side"><LeftNav /></div>

		<div class="content-right">
			<div class="nav-top">
				<BreadCrumb />
			</div>

			<div class="wrapper">
				<div class="main-page">
					<router-view/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.basic-layout {
	position: relative;
	display: flex;
	.nav-side {
		height: 100vh;
		width: 230px;
	}
	.content-right {
		height: 100%;
		width: 100%;
		.nav-top {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			margin-left: 16px;
			height: 50px;
			line-height: 50px;
		}

		.wrapper {
			background: #eef0f3;
			padding: 20px;
			height: calc(100vh - 50px);
			.main-page {
				background: #fff;
				height: 100%;
			}
		}
	}
}
</style>
