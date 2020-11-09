<svelte:head>
    <script src="https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.js" on:load={pythonLoaded}></script>
    <script src="/ace-builds/src-noconflict/ace.js" type="text/javascript" charset="utf-8" on:load={aceLoaded}></script>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono">
</svelte:head>

<script>
    import Window from './Window.svelte';
    import { fade } from 'svelte/transition';
    // import '../public/ace-builds/src-noconflict/ace.js';
    import Fab, {Icon} from '@smui/fab';
    import { asyncRun, terminate } from './worker-api';

    const pythonScript = `
        import sys
        import pandas as pd
        import pyodide

        def read_csv_url(url, *args, **kwargs):
            return pd.read_csv(pyodide.open_url(url), *args, **kwargs)

        pd.read_csv_url = read_csv_url

        '.'.join(str(x) for x in sys.version_info[0:2])
    `;
    
    const exampleScript = "" +
        "import numpy as np\n\n" + 
        "df = pd.DataFrame(np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), columns=['a', 'b', 'c'])\n" +
        "df";
    
    let pythonVersion;
    let loading = false;
    let loadingText = "Loading python interpreter ";

    const LOADING_DOTS_MS = 1000;
    let loadingExecution = setTimeout(stillLoading, LOADING_DOTS_MS);
    function stillLoading(){
        loadingText += ".";
        loadingExecution = setTimeout(stillLoading, LOADING_DOTS_MS);
    }

	async function pythonLoaded(){
        loading = true;
        await languagePluginLoader;
        pythonVersion = await asyncRun(pythonScript);
        loading = false;
        clearTimeout(loadingExecution);
    }

    function aceLoaded(){
        loadEditor();
    }
    
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
    
    const RUN_AFTER_MS = 1000;
    let pythonExecution;
    let nbLines = 0;
    async function editorChange(delta){
        console.log(delta);
        nbLines
        clearTimeout(pythonExecution);
        pythonExecution = setTimeout(runEditor, RUN_AFTER_MS);
    }

    let running = false;
    async function runStopEditor(){
        if (running){
            stopEditor();
        }
        else {
            runEditor();
        }
    }

    async function runEditor(){
        console.log("Running = ", running);
        run(editor.getValue());
    }

    function setEditorExample(){
        editor.setValue(exampleScript);
    }

    async function stopEditor(){
        console.log("Running = ", running);
        terminate();
        running = false;
        console.log("Running = ", running);
    }

    async function saveEditor(){
        runEditor();
    }

    let pyErr = false;
    let pyOutput = "";
    async function run(script){
        running = true;
        try {
            pyOutput = await asyncRun(script);
            pyErr = false;
        }
        catch (e) {
            pyOutput = e.message;
            pyErr = true;
        }
        running = false;
    }
</script>

<style type="text/css" media="screen">
    #code-div {
        display: grid;
        grid-template-columns: 1fr 1fr;
        /* min-height: 600px; */
    }
    #editor, #output, #console { 
        height: 100%;
        margin: 0;
    }
    pre#console {
        text-align: left;
        white-space: pre-wrap;       /* Since CSS 2.1 */
        white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
        white-space: -pre-wrap;      /* Opera 4-6 */
        white-space: -o-pre-wrap;    /* Opera 7 */
        word-wrap: break-word;       /* Internet Explorer 5.5+ */
        overflow-y: scroll;
        /* height: 400px; */
        min-height: 100%;
        height: 500px;
        padding: 20px;
    }
    #editor-div {
        padding: 20px;
    }
    .ace_editor {
        position: relative;
        overflow: hidden;
        padding: 0;
        /* font: 16px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace; */
        font: 16px/normal 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
        direction: ltr;
        text-align: left;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    .pyErr {
        color: #ff3e00;
    }
    .highlight {
        background-color: #40b3ff;
        padding: 5px;
        border-radius: 2px;
        color: white;
    }
    #run-code {
        border-radius: 50%;
        background-color: #ff3e00;
        height: 50px;
        width: 50px;
    }
</style>

<div>
    {#if loading}
		<p in:fade>{loadingText}</p>
	{/if}
	{#if pythonVersion}
        <!-- <p in:fade>Running <span class="highlight">python {pythonVersion}</span></p> -->
        <!-- id='run-code' -->
        <Fab on:click={runStopEditor} color="primary"><Icon class="material-icons">{running? "stop" : "play_arrow"}</Icon></Fab>
        <div in:fade id="code-div">
            <Window title="Python {pythonVersion}" backgroundColor="#263238">
                <pre id="editor" class="ace_editor" use:loadEditor></pre>
            </Window>
            <Window title="Output" backgroundColor="#FFF">
                <div id="output">
                    <pre id="console" class:pyErr>{pyOutput}</pre>
                </div>
            </Window>
        </div>
        <Fab on:click={setEditorExample} color="primary"><Icon class="material-icons">library_add</Icon></Fab>
    {/if} 
</div>
