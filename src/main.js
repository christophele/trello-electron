const {app, BrowserWindow, Menu, dialog, ipcMain} = require('electron');
const fs = require('fs');

const dataFileName = 'save-data-trello.json';

const menuTemplate = [
    {
        label: 'Sauvegarde',
        submenu: [
            {
                label: 'Import',
                click: (menuItem, window, event) => { importDataFile(window); }
            },
            {
                label: 'Export',
                click: (menuItem, window, event) => { exportDataFile(window); }
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

    win.webContents.openDevTools();

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

function readData() {
    return new Promise((resolve, reject) => {
        fs.access(dataFileName, fs.constants.F_OK, error => {
            if (error) {
                reject(error);
                return;
            }

            fs.readFile(dataFileName, 'utf-8', (error, data) => {
                if (error) {
                    reject(error);
                }

                resolve(data ? JSON.parse(data) : {});
            });
        });
    });
}

async function saveData(data) {
    await fs.writeFile(dataFileName, JSON.stringify(data), 'utf-8', (error) => {
        if (error) {
            console.log(error);
        }
    });
}

function loadData(window) {
    readData().then(data => {
        window.webContents.send('load-data', data);
    }).catch(error => {
        console.log(error);
    });
}

function importDataFile(window) {
    const dialogTemplate = {
        title: 'Selectionner un fichier de sauvegarde à importer',
        defaultPath: '../' + __dirname,
        buttonLabel: 'Importer',
        filters: [{ name: 'Sauvegarde Trello', extensions: ['json']}],
        properties: ['openFile']
    };

    if (process.platform === 'darwin') {
        dialogTemplate.properties.push('openDirectory');
    }

    dialog.showOpenDialog(dialogTemplate).then(async file => {
        if (file.canceled) {
            return;
        }

        await fs.readFile(file.filePaths[0].toString(), 'utf-8', async (error, data) => {
            if (error) {
                console.log(error);
                dialog.showErrorBox('Echec de l\'import du fichier',
                    'Une erreur est survenue lors de l\'import du fichier.');
            }

            await saveData(JSON.parse(data));
            loadData(window);
        });
    }).catch(error => {
        dialog.showErrorBox('Echec de l\'import du fichier',
         'Une erreur est survenue lors de l\'import du fichier.');
        console.log(error);
    });
}

function exportDataFile(window) {
    dialog.showSaveDialog(window, {
        title: 'Exporter un fichier de sauvegarde',
        defaultPath: '../' + __dirname,
        buttonLabel: 'Sauvegarder',
        filters: [{ name: 'Sauvegarde Trello', extensions: ['json']}],
    }).then(file => {
        if (file.canceled) {
            return;
        }

        readData().then(data => {
            fs.writeFile(file.filePath.toString(), JSON.stringify(data), 'utf-8', (error) => {
                if (error) {
                    dialog.showErrorBox('Echec de l\'export du fichier',
                    'Une erreur est survenue lors de l\'export du fichier.');
                    console.log(error);
                }
            });
        }).catch(error => {
            dialog.showErrorBox('Echec de l\'export du fichier',
            'Une erreur est survenue lors de l\'export du fichier.');
            console.log(error);
        });
    }).catch(error => {
        dialog.showErrorBox('Echec de l\'export du fichier',
         'Une erreur est survenue lors de l\'export du fichier.');
        console.log(error);
    });
}

ipcMain.on('get-data', (event) => {
    readData().then(data => {
        event.reply('load-data', data);
    }).catch(error => {
        console.log(error);
    });
});

ipcMain.on('save-data', (event, data) => {
    saveData(data);
});

app.whenReady().then(createWindow);