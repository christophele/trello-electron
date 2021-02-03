const {app, BrowserWindow, Menu} = require('electron');

const menuTemplate = [
    {
        label: 'Gestion',
        submenu: [
            {
                label: 'Ajouter une liste',
                click: ''
            },
            {
                label: 'Supprimer toutes les listes !',
                click: ''
            }
        ]
    },
    {
        label: 'Sauvegarde',
        submenu: [
            {
                label: 'Import',
                click: ''
            },
            {
                label: 'Export',
                click: ''
            }
        ]
    }
];

function createWindow() {
    let win = new BrowserWindow({
        width: 1500,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
        }
    });

    win.loadFile('src/views/home/home.html');
    win.once('ready-to-show', () => {
        const menu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(menu);
        win.show();
    });
    
    win.on('closed', () => {
        win = null;
    });

    return win;
}

app.whenReady().then(createWindow);