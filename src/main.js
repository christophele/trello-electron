const {app, BrowserWindow} = require('electron');

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
        win.show();
    });
    
    win.on('closed', () => {
        win = null;
    });

    return win;
}

app.whenReady().then(createWindow);