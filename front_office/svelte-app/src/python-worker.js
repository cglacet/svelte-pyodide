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
        self.pyodide.repr = self.pyodide.pyimport('repr');
        const str = self.pyodide.repr(results);
        self.postMessage({results: str});
        // self.postMessage({results});
    }
    catch (error){
        setTimeout(() => { throw error; });
    }
}