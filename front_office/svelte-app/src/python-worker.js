self.languagePluginUrl = 'https://pyodide-cdn2.iodide.io/v0.15.0/full/';
importScripts('https://pyodide-cdn2.iodide.io/v0.15.0/full/pyodide.js');


let pythonLoading;
async function loadPythonPackages(){
    await languagePluginLoader;
    pythonLoading = self.pyodide.loadPackage(['pandas']);
}


var onmessage = async(event) => { 
    await languagePluginLoader;
    await pythonLoading;
    const {python, ...args} = event.data;
    for (const key of Object.keys(args)){
        self[key] = args[key];
    }
    try {
        const results = await self.pyodide.runPythonAsync(python);
        self.postMessage({
            results: results
        });
    }
    catch (error){
        setTimeout(() => { throw error; });
    }
}