<script>
	import Header from './Header.svelte';
	import AuthController from './AuthController.svelte';
	import './styles.css';
</script>

<div class="app">
	<Header />
	<AuthController />

	<main>
		<slot />
	</main>

	<footer>
		<p>visit <a href="https://github.com/sep6-a2022/sep6">github.com/sep6-a2022/sep6</a> <br> to learn more about this project</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
