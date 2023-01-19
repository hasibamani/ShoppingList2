const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = require('electron');


let mainWindow;
let addWindow;

//Listen for app to be ready 
app.on('ready', function () {
    //Create new window
    mainWindow = new BrowserWindow({
        "webPreferences": {   
            "preload": path.join(__dirname, "preload_main.js")
        }
    });
    //Load html into windwow
    let url = new URL(path.join(__dirname, 'mainWindow.html'));
    url.protocol = 'file:';
    mainWindow.loadURL(url.toString());
    //Qiutt app when closed
    mainWindow.on('closed', function () {
        app.quit();
    });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemple);
    // Menü einfügen
    Menu.setApplicationMenu(mainMenu);
});

// Handle create add window
function createAddWindow() {
    //Create new window
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Item',
        webPreferences: {
            preload: path.join(__dirname, "preload_main2.js")
        }
    });
    //Load html into windwow
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow2.html'),                      //__dirname aktuelles Verzeichnis
        protocol: 'file:',
        slashed: true                      // das alles tut nur die datei übertragen. ODER zum ersetzen: file://dirname/addWindow.html
    }));
    //Garbege collection handle
    addWindow.on('window-all-closed', function () {
        addWindow = null;
    });
    // console.log('2');
}
// console.log('1');

// 
// Catch item:add
ipcMain.on('item:add', function (e, item) {               
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});


// Create menu template
const mainMenuTemple = [{
    label: 'File',
    submenu: [
        {
            label: 'Add Item',                       //Etikett,  für das Hinzufügen von Artikeln
            accelerator: process.platform == 'darwin' ? 'Command+S' :     
                'Ctrl+S',  
            click() {
                createAddWindow();
            }
        },
        {
            label: 'Clear Items',
            click(){
                mainWindow.webContents.send('item:clear')
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q':
                'Ctrl+Q',
            click() {
                app.quit();
            }
        }
    ]
}
];

// If mac, add empty object to menu
if (process.platform == 'darwin') {
    mainMenuTemple.unshif({});
}

// Add developer tools item if not in prod
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemple.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.plattform == 'darwin' ? 'Cpmmand+I' :
                    'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}




/*const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = require('electron');

let mainWindow;
// let shoppingContainer = document.getElementById('shopping-container');

//Listen for app to be ready 
app.on('ready', function () {
    

    //Create new window
    mainWindow = new BrowserWindow({
        "webPreferences": {
            "preload": path.join(__dirname, "preload_main.js")
        }
    });

    //Load html into windwow
    let url = new URL(path.join(__dirname, 'mainWindow.html'));
    url.protocol = 'file:';
    mainWindow.loadURL(url.toString());
    //Qiutt app when closed
    mainWindow.on('closed', function () {
        app.quit();
    });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemple);
    // Menü einfügen
    Menu.setApplicationMenu(mainMenu);
    

});


// Create menu template
const mainMenuTemple = [{
    label: 'File',
    submenu: [
        {
            label: 'Add Item',                       //Etikett,  für das Hinzufügen von Artikeln
            accelerator: process.platform == 'darwin' ? 'Command+S' :
                'Ctrl+S',
            click() {
                createMainWindow();
            }
        },
        {
            label: 'Clear Items',
            click() {
                mainWindow.webContents.send('item:clear')
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' :     //'if'; wenn  das richtig ist(darwin ) dann soll command+Q 
                'Ctrl+Q',                                                      //ausführen, (:, else)ansonsten Ctrl+Q
            click() {
                app.quit();
            }
        }
    ]
}
];*/