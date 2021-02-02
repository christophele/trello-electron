function formatDate(d) {
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }

    return [day, month, year].join('/');
}

window.trello_init = function (data, functions) {

    let currentList = null;
    let listTemplate = null;
    let cardTemplate = null;
    let dragged = null;

    let addList = (title, id = null) => {

        let date = new Date();
        id = id === null ? date.getTime().toFixed() : id;

        let listContainer = document.querySelector('[data-list-container]');

        let newList = document.createElement('div')
        newList.innerHTML = listTemplate;
        newList = newList.firstElementChild;

        let titleElement = newList.querySelector('[data-div="column-title"]');
        titleElement.innerHTML = title;

        newList.setAttribute('data-list', id)

        titleElement.addEventListener('click', () => {
            let newName = prompt('Nouveau nom ?', title);
            functions.updateList(id, newName).then(() => {
                titleElement.innerHTML = newName
            }).catch(() => alert('Erreur lors de la mise à jour de la liste'));
        });

        newList.querySelector('[data-button="removeList"]').addEventListener('click', () => {
            if (confirm('Supprimer la liste ?')) {
                functions.removeList(id).then(() => {
                    newList.remove();
                }).catch(() => alert('Erreur lors de la suppression de la liste'));
            }
        });

        return functions.addList(id, title, date).then(() => {
            listContainer.appendChild(newList);

            return id;
        }).catch(() => alert('Erreur lors de l\'ajout de la liste'));
    }

    let addTask = (list, content, id = null) => {
        let date = new Date();
        id = id === null ? date.getTime().toFixed() : id;

        let taskContainer = document.querySelector(`[data-list="${list}"] [data-task-container]`);

        let newTask = document.createElement('div')
        newTask.innerHTML = cardTemplate;
        newTask = newTask.firstElementChild;

        newTask.setAttribute('data-task', list + '-' + id);
        let titleElement = newTask.querySelector('[data-div="task-title"]');
        titleElement.innerHTML = content;
        newTask.querySelector('[data-div="task-date"]').innerHTML = formatDate(date);

        titleElement.addEventListener('click', () => {
            let newContent = prompt('Nouveau contenu ?', content);
            functions.updateTask(list, id, newContent).then(() => {
                titleElement.innerHTML = newContent
            }).catch(() => alert('Erreur lors de la mise à jour de la tache'));
        });

        newTask.addEventListener('dblclick', () => {
            if (confirm('Supprimer la tache ?')) {
                functions.removeTask(list, id).then(() => {
                    newTask.remove();
                }).catch(() => alert('Erreur lors de la suppression de la tache'));
            }
        });

        return functions.addTask(list, id, content, date).then(() => {
            taskContainer.appendChild(newTask);

            return id;
        }).catch(() => alert('Erreur lors de l\'ajout de la tache'));
    }

    let initDrag = () => {

        document.addEventListener('dragstart', () => {
            dragged = event.target;
            event.target.style.opacity = .5;
            event.dataTransfer.setData('text/plain', null);
        }, false)

        document.addEventListener("dragend", function (event) {
            event.target.style.opacity = "";
            // dragged = null;
        }, false);

        document.addEventListener("dragover", function (event) {
            // Empêche le comportement par défaut afin d'autoriser le drop
            event.preventDefault();
        }, false);

        document.addEventListener("dragenter", function (event) {
            if (event.target.matches('[data-list]')) {
                event.target.style.background = "#b9b9b9";
            }
        }, false);

        document.addEventListener("dragleave", function (event) {
            if (event.target.matches('[data-list]')) {
                event.target.style.background = "";
            }
        }, false);

        document.addEventListener("drop", function (event) {
            if (event.target.matches('[data-list]')) {
                let list = event.target.closest('[data-list]');
                event.target.style.background = "";

                let newList = list.getAttribute('data-list');

                let task = dragged.getAttribute('data-task')
                task = task.split('-');
                let oldList = task[0]
                task = task[1]

                functions.moveTask(task, oldList, newList).then(() => {
                    list.querySelector('[data-task-container]').appendChild(dragged)
                    dragged = null;
                }).catch(() => alert('Déplacement de la tache impossible !'));
            }
        }, false);

    }

    let initListTemplate = () => {
        let element = document.querySelector('[data-template="list"]');
        element.removeAttribute('data-template');
        listTemplate = element.outerHTML;
        element.remove();
    }

    let initCardTemplate = () => {
        let element = document.querySelector('[data-template="card"]');
        element.removeAttribute('data-template');
        cardTemplate = element.outerHTML;
        element.remove();
    }

    let initHeader = () => {

        function setCookie(name, value, days) {
            let expires = "";
            if (days) {
                let date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        }

        function getCookie(name) {
            let nameEQ = name + "=";
            let ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        let currentName = document.querySelector('[data-div="currentName"]');
        let currentDate = document.querySelector('[data-div="currentDate"]');

        currentDate.textContent = formatDate(new Date())

        let value = getCookie('trello-electron-name');
        if (!value) {
            value = prompt('Votre nom ?')
            if (value) {
                setCookie('trello-electron-name', value, 365);
                currentName.textContent = value;
            }
        } else {
            currentName.textContent = value;
        }
    }

    let initModals = () => {
        let addListModal = document.querySelector('[data-modal="addList"]');
        let addTaskModal = document.querySelector('[data-modal="addTask"]');

        // Show modal

        let addListButton = document.querySelector('[data-open="addList"]');
        addListButton.addEventListener('click', (e) => {
            e.preventDefault();
            addListModal.classList.remove('hidden');
        });

        document.addEventListener('click', (e) => {
            let button = e.target;
            if (e.target.getAttribute('data-open') === 'addTask') {
                currentList = button.parentElement.getAttribute('data-list');
                e.preventDefault();
                addTaskModal.classList.remove('hidden');
            }
        })

        // Hide modal

        document.querySelectorAll('[data-modal-close]').forEach((button) => {
            button.addEventListener('click', function () {
                this.parentElement.parentElement.parentElement.parentElement.classList.add('hidden')
            })
        });

        // Form modals

        let listInput = document.querySelector('[data-input="list-name"]');
        document.querySelector('[data-button="addList"]').addEventListener('click', function () {
            addList(listInput.value).then(() => {
                this.parentElement.parentElement.parentElement.parentElement.classList.add('hidden');
                listInput.value = '';
            });
        });

        let taskInput = document.querySelector('[data-input="task-name"]');
        document.querySelector('[data-button="addTask"]').addEventListener('click', function () {
            addTask(currentList, taskInput.value).then(() => {
                this.parentElement.parentElement.parentElement.parentElement.classList.add('hidden');
                taskInput.value = '';
            });
        });
    }

    //

    initListTemplate()
    initCardTemplate()
    initModals()
    initHeader();
    initDrag();

    if (Object.keys(data).length === 0) {
        addList('Liste 1').then((id) => {
            addTask(id, 'Tache 1');
        })
    }
}
