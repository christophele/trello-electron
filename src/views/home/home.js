document.addEventListener('DOMContentLoaded', () => {
    addList();
    handleModal();
})

const addList = () => {
    const addListBtnDOMElement = document.getElementById('addList');
    const newListInputDOMElement = document.getElementById('newListInput');
    
    addListBtnDOMElement.addEventListener('click', () => {
        if (newListInputDOMElement.value.length > 0) {
            createNewListElement(newListInputDOMElement.value);
            newListInputDOMElement.value = '';
            addListBtnDOMElement.nextElementSibling.click();
        } else {
            console.log('Veuillez insérer un titre')
        }
        
    })
}

const createNewListElement = (listTitle) => {
    const allListsDOMElement = document.getElementById('allLists');
    const listWrapperDOMElement = document.createElement('div');
    listWrapperDOMElement.setAttribute('class', 'bg-gray-100 rounded-lg p-4 rounded max-w-sm overflow-hidden w-64 border-t-8 border-yellow-600  mr-4');

    const listHeaderDOMElement = document.createElement('div');
    listHeaderDOMElement.setAttribute('class', 'flex justify-between items-center');

    const listTitleDOMElement = document.createElement('p');
    listTitleDOMElement.setAttribute('class', 'text-gray-700 font-semibold font-sans tracking-wide text-sm');
    listTitleDOMElement.textContent = listTitle;

    const listActionsBtnDOMElement = document.createElement('button');
    listActionsBtnDOMElement.setAttribute('class', 'hover:bg-gray-100 py-1 px-1 rounded ml-5');

    const actionsSvgDOMElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    actionsSvgDOMElement.setAttribute('class', 'fill-current w-4 h-4');
    actionsSvgDOMElement.setAttribute('viewBox', '0 0 24 24');

    const actionsSvgPathOneDOMElement = document.createElement('path');
    actionsSvgPathOneDOMElement.setAttribute('d', 'M0 0h24v24H0z');
    actionsSvgPathOneDOMElement.setAttribute('fill', 'none');

    const actionsSvgPathTwoDOMElement = document.createElement('path');
    actionsSvgPathTwoDOMElement.setAttribute('d', 'M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z');

    const addListButton = document.querySelector('.addList');

    /* add task button */
    const addTaskButtonDOMElement = document.createElement('a');
    addTaskButtonDOMElement.setAttribute('class', 'addTask modal-open inline-flex items-center text-sm font-medium text-blue-500 hover:text-blue-600 mt-3');
    addTaskButtonDOMElement.setAttribute('data-modal', listTitle);

    const addTaskSvgDOMElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    addTaskSvgDOMElement.setAttribute('class', 'fill-current w-4 h-4 mr-1');
    addTaskSvgDOMElement.setAttribute('viewBox', '0 0 24 24');

    const addTaskSvgPathOneDOMElement = document.createElement('path');
    addTaskSvgPathOneDOMElement.setAttribute('d', 'M0 0h24v24H0z');
    addTaskSvgPathOneDOMElement.setAttribute('fill', 'none');

    const addTaskSvgPathTwoDOMElement = document.createElement('path');
    addTaskSvgPathTwoDOMElement.setAttribute('d', 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z');
    
    addTaskButtonDOMElement.textContent = 'Ajouter une tâche';
    addTaskButtonDOMElement.onclick = handleModal;

    // build actions button
    actionsSvgDOMElement.appendChild(actionsSvgPathOneDOMElement);
    actionsSvgDOMElement.appendChild(actionsSvgPathTwoDOMElement);
    listActionsBtnDOMElement.appendChild(actionsSvgDOMElement);

    // build list header
    listHeaderDOMElement.appendChild(listTitleDOMElement);
    listHeaderDOMElement.appendChild(listActionsBtnDOMElement);
    listWrapperDOMElement.appendChild(listHeaderDOMElement);

    // build add task button
    addTaskSvgDOMElement.appendChild(addTaskSvgPathOneDOMElement)
    addTaskSvgDOMElement.appendChild(addTaskSvgPathTwoDOMElement)
    addTaskButtonDOMElement.appendChild(addTaskSvgDOMElement);
    listWrapperDOMElement.appendChild(addTaskButtonDOMElement);

    allListsDOMElement.appendChild(listWrapperDOMElement);
    allListsDOMElement.appendChild(createNewTaskModalDOMElement(listTitle));
    // return listWrapperDOMElement;
}

const createNewTaskElement = () => {

}

const createNewTaskModalDOMElement = (dataModalId) => {
    const modalWrapperDOMElement = document.createElement('div');
    modalWrapperDOMElement.setAttribute('id', dataModalId);
    modalWrapperDOMElement.setAttribute('class', 'modal hidden fixed w-full h-full top-0 left-0 flex items-center justify-center');

    const modalOverlayDOMElement = document.createElement('div');
    modalOverlayDOMElement.setAttribute('class', 'modal-overlay absolute w-full h-full bg-gray-900 opacity-50');

    const modalContainerDOMElement = document.createElement('div');
    modalContainerDOMElement.setAttribute('class', 'modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto');

    const modalCloseBtnDOMElement = document.createElement('div');
    modalCloseBtnDOMElement.setAttribute('class', 'modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50');

    const closeSvgDOMElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    closeSvgDOMElement.setAttribute('class', 'modal-close fill-current text-white');
    closeSvgDOMElement.setAttribute('viewBox', '0 0 18 18');

    const closeSvgPathDOMElement = document.createElement('path');
    closeSvgPathDOMElement.setAttribute('class', 'modal-close');
    closeSvgPathDOMElement.setAttribute('d', 'M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z');

    closeSvgDOMElement.appendChild(closeSvgPathDOMElement);
    modalCloseBtnDOMElement.appendChild(closeSvgDOMElement);
    modalContainerDOMElement.appendChild(modalCloseBtnDOMElement);
    
    modalWrapperDOMElement.appendChild(modalOverlayDOMElement);
    
    const modalContentDOMElement = document.createElement('div');
    modalContentDOMElement.setAttribute('class', 'modal-content py-4 text-left px-6');

    const modalContentHeaderDOMElement = document.createElement('div');
    modalContentHeaderDOMElement.setAttribute('class', 'flex justify-between items-center pb-3');

    const modalContentHeaderTitleDOMElement = document.createElement('p');
    modalContentHeaderTitleDOMElement.setAttribute('class', 'text-2xl font-bold');
    modalContentHeaderTitleDOMElement.textContent = 'Ajout d\'une tâche';

    const modalContentBodyDOMElement = document.createElement('div');
    modalContentBodyDOMElement.setAttribute('class', 'flex relative');

    const modalContentBodyInputDOMElement = document.createElement('input');
    modalContentBodyInputDOMElement.setAttribute('class', 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline');
    modalContentBodyInputDOMElement.setAttribute('type', 'text');
    modalContentBodyInputDOMElement.setAttribute('placeholder', 'Titre');

    const modalContentBodyBtnDOMElement = document.createElement('button');
    modalContentBodyBtnDOMElement.setAttribute('class', 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2');
    modalContentBodyBtnDOMElement.setAttribute('id', 'addTask');

    // const modalClosebtnDOMElement = document.createElement('div');
    modalContentBodyDOMElement.appendChild(modalContentBodyInputDOMElement)
    modalContentBodyDOMElement.appendChild(modalContentBodyBtnDOMElement)
    modalContentHeaderDOMElement.appendChild(modalContentHeaderTitleDOMElement)
    modalContentDOMElement.appendChild(modalContentHeaderDOMElement)
    modalContentDOMElement.appendChild(modalContentBodyDOMElement)
    modalContainerDOMElement.appendChild(modalContentDOMElement);
    modalWrapperDOMElement.appendChild(modalContainerDOMElement);

    return modalWrapperDOMElement;
}

const handleModal = () => {
    const openModals = document.querySelectorAll('.modal-open');
    const closeModals = document.querySelectorAll('.modal-close');

    for (let i = 0; i < openModals.length; i++) {
        const thisBtn = openModals[i];

        thisBtn.addEventListener('click', function(event) {
            event.preventDefault();
            const modal = document.getElementById(this.dataset.modal);
            modal.style.display = 'flex';

            if (closeModals.length > 0) {
                for (let i = 0; i < closeModals.length; i++) {
                    const thisCloseModal = closeModals[i];

                    window.addEventListener('click', function(e) {
                        if (e.keyCode === 27 || e.target === thisCloseModal) {
                            modal.style.display = 'none';
                        }
                    })  
                }
            }
        })
    }
}