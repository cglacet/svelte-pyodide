# Tutorial 


## Back 

### Initialize your working directory 

#### Installs

```bash
❯ pyenv install 3.9.0a5
❯ pyenv virtualenv 3.9.0a5 wasm
❯ pyenv local wasm
❯ poetry new
❯ poetry add fastapi
❯ poetry add -D black mypy pylint
```

#### Git 

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

We can test that templating works:

```bash
❯ curl -sL http://127.0.0.1:8000/items/12\?q\=foo
Item ID: 
12
```


[jinja2 templates]: https://fastapi.tiangolo.com/advanced/templates


## Front

### Initialize your working directory 

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


[svelte]: https://svelte.dev/
[svelte degit]: https://svelte.dev/blog/the-easiest-way-to-get-started#2_Use_degit
[svelte degit template]: https://github.com/sveltejs/template

### ACE text editor 

We could use ACE builds directly, but if we want to add custom theme its simpler 
to install build it ourselves:

```bash 
❯ git submodule add git@github.com:ajaxorg/ace.git
❯ cd ace/tool
❯ npm install
```

#### Adding themes before building 

Copy **tmThemes** files in `ace/tool/tmthemes/`, 
edit `ace/tool/tmtheme.js` to add your theme:

```diff
var themes = {
+   "Material-Theme": "Material-Theme",
    "clouds": "Clouds",
    "clouds_midnight": "Clouds Midnight",
    "cobalt": "Cobalt",
}
```

#### Build Ace

```bash
❯ npm install 
❯ node Makefile.dryice.js full --target ../public/ace-builds
```

#### Include the build in svelte 

In the component where you want to import the ACE text editor:

```svelte
<svelte:head>
    <script src="/ace-builds/src-noconflict/ace.js" type="text/javascript" charset="utf-8" on:load={loadEditor}></script>
</svelte:head>

<script>
    let editor;
    function loadEditor(){
        editor = ace.edit("editor", {
            printMargin: false,
            cursorStyle: 'wide',
        });
        editor.session.setMode("ace/mode/python");
        editor.setTheme('ace/theme/Material-Theme');
        // editor.session.on('change', editorChange);
        editor.commands.addCommand({
            name: "Save",
            bindKey: { win: "Ctrl-S", mac: "Command-S" },
            exec: saveEditor(),
        });
        editor.commands.addCommand({
            name: "Execute",
            bindKey: { win: "Ctrl-Return", mac: "Command-Return" },
            exec: runEditor,
        });
    }
</script>

<pre id="editor" class="ace_editor"></pre>
```

The `loadEditor` callbacks is very important, its required to setup the ACE editor on the html component only 
after the script as been successfully loaded.


###  Python interpreter

We will use the [pyodide][pyodide] as an interpreter:

> Pyodide brings the Python 3.8 runtime to the browser via WebAssembly, > along with the Python 
> scientific stack including NumPy, Pandas,Matplotlib, parts of SciPy, and NetworkX. 
> The [`packages` directory][pyodide packages]
> lists over 35 packages which are currently available.
>
> Pyodide provides transparent conversion of objects between Javascript and Python. 
> When used inside a browser, Python has full access to the Web APIs.

In other words we can execute python code in the in a web browser and also
exchange objects between python and javascript.

#### Main thread execution & web workers

There are two way of executing code using pyodide: 

* Directly in the main thread, by simply using the provided [functions][pyodide API].
* [Using a web worker][pyodide web worker] to execute the interpreter outside the main thread.

We will most likely use the two ways. The first being way more practical (python and 
javascript both running in the same thread, this facilitates object exchanges). The 
second is very convinrent when running heavier computations because the main thread,
which the browser uses, will not be blocked because of the python interpreter consuming
computation ressources. 

Notice that pyodide provides a method named [`pyodide.runPythonAsync`][pyodide async run]
which allows to run `async` python code and return a javascript [Promise][js promise].
At first it may sound like this function will run the python script in some sort of
event loop (separate thread), like it does in python, but that's not the case. 
This method will block the main JS thread even if it executes asynchronous IO.

> ## Caveats
>
> Using a web worker is advantageous because the python code is run in a separate thread 
> from your main UI, and hence does not impact your application’s responsiveness. There 
> are some limitations, however. At present, Pyodide does not support sharing the Python 
> interpreter and packages between multiple web workers or with your main thread. Since 
> web workers are each in their own virtual machine, you also cannot share globals between 
> a web worker and your main thread. Finally, although the web worker is separate from your 
> main thread, the web worker is itself single threaded, so only one python script will 
> execute at a time.

#### Using the main thread

Let's first start with the easy part and import the library to make sure everything works:

```svelte
<svelte:head>
    <script src="https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.js" on:load={pythonLoaded}></script>
</svelte:head>

<script>
    import { fade } from 'svelte/transition';
    
    const pythonScript = `
        import sys
        '.'.join(str(x) for x in sys.version_info[0:2])
    `;
    
    let pythonVersion;
	async function pythonLoaded(){
        await languagePluginLoader;
        pythonVersion = await pyodide.runPythonAsync(pythonScript);
    }
</script>

<p in:fade>Loading python interpreter</p>
{#if pythonVersion}
    <p in:fade>Python {pythonVersion}</p>
{/if}
```

If this works properly, after loading the page in your browser you should see 
*"Python 3.7"* (or another version if you have a more recent version of pyodide) 
appear right under *"Loading python interpreter"*. It will only take a few 
seconds to load pyodide.


[pyodide]: https://github.com/iodide-project/pyodide
[pyodide packages]: https://github.com/iodide-project/pyodide/tree/master/packages
[pyodide API]: https://pyodide.readthedocs.io/en/latest/api_reference.html
[pyodide web worker]: https://pyodide.readthedocs.io/en/latest/using_pyodide_from_webworker.html
[pyodide async run]: https://pyodide.readthedocs.io/en/latest/js-api/pyodide_runPythonAsync.html#js-api-pyodide-runpythonasync
[js promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

#### Using a web worker 

We first need to create a web worker that will execute python scripts 
using pyodideA main, that look like:

```svelte
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

```svelte
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


### Adding some style 

#### Material svelte 

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

