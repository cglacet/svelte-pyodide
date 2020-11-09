let pyodideWorker = new Worker('./build/python-worker.js');

export function run(script, inputs, onSuccess, onError){ 
    start();
    pyodideWorker.onerror = onError;
    pyodideWorker.onmessage = (e) => onSuccess(e.data.results);
    pyodideWorker.postMessage({
        ...inputs,
        python: script,
    });
}

// Transform the run (callback) form to a more modern async form:
export function asyncRun(script, inputs) {
    return new Promise(function(onSuccess, onError) {
        run(script, inputs, onSuccess, onError);
    });
}

export function start(){
    if(Worker) {
        if(!pyodideWorker) {
            pyodideWorker = new Worker('./build/python-worker.js');
        }
    }
}

export function terminate(){
    pyodideWorker.terminate();
    pyodideWorker = null;
}