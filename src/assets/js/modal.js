document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.getElementsByClassName('click-to-open');
    const closeButtons = document.getElementsByClassName('close');
    const cancelButtons = document.getElementsByClassName('cancel');
    const eventList = ['click', 'keyup'];
    
    for (let i = 0; i < buttons.length; i++) {
        const thisBtn = buttons[i];

        thisBtn.addEventListener('click', function() {
            const modal = document.getElementById(this.dataset.modal);
            modal.style.display = 'block';
            
            if (closeButtons.length > 0) {
                for (let i = 0; i < closeButtons.length; i++) {
                    const thisCloseBtn = closeButtons[i];

                    for (let j = 0; j < cancelButtons.length; j++) {
                        const thisCancelBtn = cancelButtons[j];

                        for (event of eventList) {
                            window.addEventListener(event, (e) => {
                                if (e.keyCode === 27
                                    || e.target === modal
                                    || e.target === thisCancelBtn
                                    || e.target === thisCloseBtn) {
                                    modal.style.display = 'none';
                                }
                            });
                        }
                    }
                }
            }

            for (event of eventList) {
                window.addEventListener(event, (e) => {
                    if (e.keyCode === 27 || e.target === modal) {
                        modal.style.display = 'none';
                    }
                })
            }
        });
    }
});
