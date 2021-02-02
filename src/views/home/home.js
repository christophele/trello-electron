let data = {};

let functions = {
    addList: (id, name, date) => {
        return new Promise((ok, notok) => {
            data[id] = {
                id: id,
                name: name,
                date: new Date(),
                tasks: {}
            }

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

            ok();
        })
    },

    removeList(id) {
        return new Promise((ok, notok) => {
            delete data[id];

            ok();
        })
    },
    removeTask(list, id) {
        return new Promise((ok, notok) => {
            delete data[list].tasks[id];

            ok();
        })
    },

    updateList(id, newName) {
        return new Promise((ok, notok) => {
            data[id].name = newName;

            ok();
        })
    },
    updateTask(list, id, newContent) {
        return new Promise((ok, notok) => {
            data[list].tasks[id].content = newContent;

            ok();
        })
    },

    moveTask(id, oldList, newList) {
        return new Promise((ok, notok) => {
            data[newList].tasks[id] = data[oldList].tasks[id];
            delete data[oldList].tasks[id];

            ok();
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.trello_init(data, functions);
});