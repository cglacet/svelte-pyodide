import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		title: 'Svelte & Pyodide' // = ♥
	}
});

export default app;