<svelte:head>
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono">
</svelte:head>

<script>
	// import './public/WorkerConsole';
	import CodeBox from './CodeBoxAsync.svelte';
	import Test from './Test.svelte';
	export let title;

	if ('serviceWorker' in navigator) {
		console.log("Registeting service worker");
    	navigator.serviceWorker.register('/build/worker.js');
    }
</script>

<main>
	<h1>{title}</h1>
	<CodeBox/>
	<!-- <Test/> -->
	<a href="https://medium.com/swlh/python-in-web-easy-5f7de3813055">Read this?</a>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>