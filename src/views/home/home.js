const {ipcRenderer} = require('electron');

let data = {};

ipcRenderer.on('load-data', async (event, data) => {
    let listContainer = document.querySelector('[data-list-container]');
    listContainer.innerHTML = '';
    if (!data) {
        return;
    }
    
    for (const listId in data) {
        const list = data[listId];
        await window.trello.addList(list.name, list.id, list.date);

        for (const taskId in list.tasks) {
            const task = list.tasks[taskId];
            await window.trello.addTask(list.id, task.content, task.id, task.date);
        }
    }
});

function loadData() {
    ipcRenderer.send('get-data');
}

function saveData() {
    ipcRenderer.send('save-data', data);
}

let functions = {
    addList: (id, name, date) => {
        return new Promise((ok, notok) => {
            data[id] = {
                id: id,
                name: name,
                date: new Date(),
                tasks: {}
            }

            saveData();
            ok();
        })
    },
    addTask(list, id, content, date) {
        return new Promise((ok, notok) => {
            data[list].tasks[id] = {
                id: id,
                content: content,
                date: date,
            }

            saveData();
            ok();
        })
    },

    removeList(id) {
        return new Promise((ok, notok) => {
            delete data[id];

            saveData();
            ok();
        })
    },
    removeTask(list, id) {
        return new Promise((ok, notok) => {
            delete data[list].tasks[id];

            saveData();
            ok();
        })
    },

    updateList(id, newName) {
        return new Promise((ok, notok) => {
            data[id].name = newName;

            saveData();
            ok();
        })
    },
    updateTask(list, id, newContent) {
        return new Promise((ok, notok) => {
            data[list].tasks[id].content = newContent;

            saveData();
            ok();
        })
    },

    moveTask(id, oldList, newList) {
        return new Promise((ok, notok) => {
            data[newList].tasks[id] = data[oldList].tasks[id];
            delete data[oldList].tasks[id];

            saveData();
            ok();
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.trello = new window.trello_init(data, functions);
    loadData();
});