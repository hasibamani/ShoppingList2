const { contextBridge, ipcRenderer } = require('electron');

ipcRenderer.on('item:add', (e, item) => {
    console.log("Add item " + item);

    const ul = document.querySelector('ul');
    ul.className = "collection";
    const li = document.createElement('li');
    li.className = "collection-item";
    const itemText = document.createTextNode(item);
    li.appendChild(itemText);
    ul.appendChild(li);
/** */
    // Remove Item handler
    ul.addEventListener('dblclick', (e) => {
        // console.log("dbclick");
        e.target.remove();
        if (ul.children.length == 0) {
            ul.className = '';
        }
    });

    //Clear Items
    ipcRenderer.on('item:clear', function () {
        ul.innerHTML = '';
        ul.className = '';
    });
});
