# Tutorial 

## Prepare your working directory 

### Installs

```bash
❯ pyenv install 3.9.0a5
❯ pyenv virtualenv 3.9.0a5 wasm
❯ pyenv local wasm
❯ poetry new
❯ poetry add fastapi
❯ poetry add -D black mypy pylint
```

### Git 

I used to search for different `.gitignore` 
(usually for [macOS][.gitignore macos] and [python][.gitignore python]) 
and copy the contents of the two files within my local `.gitignore`.
Which takes approximately 30s.

Here is an [API][Gitignore.io] that automates this process:

```bash
curl -sL "https://www.toptal.com/developers/gitignore/api/python,macos" >> .gitignore
```

You most likely don't want to remember that long URL and therefore want 
to [add this `gi` command][Gitignore.io CLI install]:


```bash
git config --global alias.ignore \
'!gi() { curl -sL https://www.toptal.com/developers/gitignore/api/$@ ;}; gi'
```

Then simply run:

```bash
gi python,macos >> .gitignore
```

You can even [activate zsh][Gitignore.io zsh] autocompletion to easily find available 
configurations.

[Gitignore.io]: https://www.toptal.com/developers/gitignore
[.gitignore macos]: https://www.google.com/search?q=gitignore+macos
[.gitignore python]: https://www.google.com/search?q=gitignore+python
[Gitignore.io CLI install]: https://docs.gitignore.io/install/command-line
[Gitignore.io zsh]: https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/gitignore


### Pylint configuration 

In order to avoid conflicts between black and 
pylint we will add the following to 
[pyproject.toml](pyproject.toml):

```ini
[tool.pylint.messages_control]
disable = "C0330, C0326"

[tool.pylint.format]
max-line-length = "88"
```

### Hello world server 

```bash
❯ cd wasmpython
❯ code main.py
```

Open vscode command palette (command + p or Ctrl + p) and 
select `wasm` as python interpreter. 

```python
from typing import Optional
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}
```

This code shouldn't show any error, in particular
`fastapi` import shouldn't display an import error.
If this is working you are ready to run the server:


```bash
❯ uvicorn wasmpython.main:app --reload
❯ curl http://127.0.0.1:8000
{"Hello":"World"}
❯ curl http://127.0.0.1:8000/items/12\?q\=foo
{"item_id":12,"q":"foo"}
```

## Code

### Front

We will test [svelte][svelte] using this [degit][svelte degit] [template][svelte degit template]:

```bash
❯ mkdir front_office
❯ cd front_office
❯ npm install -g degit
/usr/local/bin/degit -> /usr/local/lib/node_modules/degit/bin.js
+ degit@2.8.0
added 1 package from 1 contributor in 1.245s
❯ npx degit sveltejs/template svelte-app
> cloned sveltejs/template#master to svelte-app
❯ cd svelte-app
❯ npm install
❯ npm i @sveltejs/svelte-repl
```

I had to modify the default port to make this work:

```diff
{
  "scripts": {
    "build": "rollup -c",
+   "dev": "PORT=8081 rollup -c -w",
    "start": "sirv public"
  },
}
```

Let's try it:

```bash
❯ npm run dev
❯ open http://localhost:8081
```

And now add the python interpreter: 

```
```

[svelte]: https://svelte.dev/
[svelte degit]: https://svelte.dev/blog/the-easiest-way-to-get-started#2_Use_degit
[svelte degit template]: https://github.com/sveltejs/template

### Serving static files and templating 

```bash
❯ poetry add aiofiles jinja2
❯ mkdir static templates
```

```python
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
```

We can then send responses using [templates][jinja2 templates]:

```python
templates.TemplateResponse("item.html", {"request": request, "id": id})
```

```bash
code templates/item.html
```

```html
Item ID: 
{{ id }}
```


```bash
❯ curl -sL http://127.0.0.1:8000/items/12\?q\=foo
Item ID: 
12
```

You should see:



[jinja2 templates]: https://fastapi.tiangolo.com/advanced/templates


## Additional steps 

Import ace to include homemade themes:

```bash 
❯ git submodule add git@github.com:ajaxorg/ace.git
❯ cd ace/tool
❯ npm install
```

Then, copy tmThemes files in `ace/tool/tmthemes/`, 
edit `ace/tool/tmtheme.js` to add your theme:

```diff
var themes = {
+   "Material-Theme": "Material-Theme",
    "clouds": "Clouds",
    "clouds_midnight": "Clouds Midnight",
    "cobalt": "Cobalt",
}
```



build Ace: 


```bash
❯ npm install 
❯ node Makefile.dryice.js full --target ../public/ace-builds
```


## Material svelte 

```bash
❯ npm install -D svelte-material-ui 
❯ npm install -D @material/linear-progress @material/theme @material/typography @material/elevation
❯ npm install -D rollup-plugin-postcss svelte-preprocess node-sass 
```

Rollup :
```diff
plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('bundle.css');
			},
+			emitCss: true,
			preprocess: autoPreprocess(),
		}),

		css({ output: "public/build/vendor.css" }),

+		postcss({
+           extract: true,
+           minimize: true,
+           use: [
+               ['sass', {
+               includePaths: [
+                   './src/theme',
+                   './node_modules'
+               ]
+               }]
+           ]
+    }),
```


## Async worker 


A main, that look like:


```html
<script>
	import Test from './Test.svelte';
	export let title;

	if ('serviceWorker' in navigator) {
		console.log("Registeting service worker");
    	navigator.serviceWorker.register('/build/worker.js');
  }
</script>

<main>
	<Test/>
</main>
```

In this process we have three parties: 

* the **consumer**s want to run some scripts outside the main thread
* the **service worker** is responsible for running scripts in its own thread
* the **worker API** exposes a consumer-to-provider communication interface


A `Test.svelte` component that looks like: 

```html
<script>
import { asyncRun } from './py-worker';

const script = `
  import statistics
  from js import A_rank
  statistics.stdev(A_rank)
`;

const context = {
    A_rank: [0.8, 0.4, 1.2, 3.7, 2.6, 5.8],
}

async function main(){
    try {
        const {results, error} = await asyncRun(script, context);
        if (results) {
            console.log('pyodideWorker return results: ', results);
        } else if (error) {
            console.log('pyodideWorker error: ', error);
        }
    }
    catch (e){
        console.log(`Error in pyodideWorker at ${e.filename}, Line: ${e.lineno}, ${e.message}`)
    }
}

main();
</script>
```

The `py-worker.js` file is the API to execute code with the service worker: 

```js
const pyodideWorker = new Worker('./build/worker.js')

export function run(script, context, onSuccess, onError){ 
    pyodideWorker.onerror = onError;
    pyodideWorker.onmessage = (e) => onSuccess(e.data);
    console.log(script)
    pyodideWorker.postMessage({
            ...context,
            python: script,
    });
}

// Transform the run (callback) form to a more modern async form:
export function asyncRun(script, context) {
    return new Promise(function(onSuccess, onError) {
        run(script, context, onSuccess, onError);
    });
}
```

In `src/worker.js` we just call `runPythonAsync` with the right parameters
once we made sure everything loaded properly:

```js
self.languagePluginUrl = 'https://pyodide-cdn2.iodide.io/v0.15.0/full/';
importScripts('https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.js');


let pythonLoading;
async function loadPythonPackages(){
    await languagePluginLoader;
    pythonLoading = self.pyodide.loadPackage(['numpy', 'pytz']);
}

var onmessage = async(event) => {  
    await languagePluginLoader;
    await pythonLoading;
    const {python, ...args} = event.data;
    for (const key of Object.keys(args)){
        self[key] = args[key];
    }
    try {
        self.postMessage({
            results: await self.pyodide.runPythonAsync(python)
        });
    }
    catch (error){
        self.postMessage(
            {error : error.message}
        );
    }
}
```

Automatically copy the worker file using rollup: 

```js
{
    name: 'copy-worker',
    load() {
      this.addWatchFile(path.resolve(__dirname, './src/worker.js'));
    },
    generateBundle() {
      fs.copyFileSync(
      path.resolve('./src/worker.js'),
      path.resolve('./public/build/worker.js')
      );
    }
},
```

Running this, should show in your browser console: 

```js
Registeting service worker
py.js:6 
  import statistics
  from js import A_rank
  statistics.stdev(A_rank)
pyodide.asm.js:8 Python initialization complete
pyodide.js:146 pytz to be loaded from default channel
pyodide.js:146 numpy to be loaded from default channel
pyodide.js:104 Loading pytz, numpy
pyodide.js:104 Loading pytz from https://pyodide-cdn2.iodide.io/v0.15.0/full/pytz.js
pyodide.js:104 Loading numpy from https://pyodide-cdn2.iodide.io/v0.15.0/full/numpy.js
pyodide.js:206 Loaded pytz, numpy
Test.svelte:17 pyodideWorker return results:  2.0634114147853952
```