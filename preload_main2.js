const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    "api", {
        "sendItem": (item) => {
            ipcRenderer.send("item:add", item);
        }
    }
)
