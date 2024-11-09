document.addEventListener('DOMContentLoaded', function () {
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const sendButton = document.querySelector('#send');
    let numberQuestion = 0;
    const finalAnswers = [];
    let testCompleted = false; 

    const questions = [
        {
            question: "Якого кольору бургер?",
            answers: [
                { title: 'Стандарт', url: './image/burger.png' },
                { title: 'Чорний', url: './image/burgerBlack.png' }
            ],
            type: 'radio'
        },
        {
            question: "З якого м'яса котлета?",
            answers: [
                { title: 'Курка', url: './image/chickenMeat.png' },
                { title: 'Яловичина', url: './image/beefMeat.png' },
                { title: 'Свинина', url: './image/porkMeat.png' }
            ],
            type: 'radio'
        },
        {
            question: "Додаткові інгредієнти?",
            answers: [
                { title: 'Помідор', url: './image/tomato.png' },
                { title: 'Огірок', url: './image/cucumber.png' },
                { title: 'Салат', url: './image/salad.png' },
                { title: 'Цибуля', url: './image/onion.png' }
            ],
            type: 'checkbox'
        },
        {
            question: "Додати соус?",
            answers: [
                { title: 'Часниковий', url: './image/sauce1.png' },
                { title: 'Томатний', url: './image/sauce2.png' },
                { title: 'Гірчичний', url: './image/sauce3.png' }
            ],
            type: 'radio'
        }
    ];

    const renderAnswers = (index) => {
        formAnswers.innerHTML = '';
        questions[index].answers.forEach((answer) => {
            const answerItem = document.createElement('div');
            answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');
            answerItem.innerHTML = `
                <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                    <img class="answerImg" src="${answer.url}" alt="burger">
                    <span>${answer.title}</span>
                </label>
            `;
            formAnswers.appendChild(answerItem);
        });
    };

    const renderQuestions = (indexQuestion) => {
        formAnswers.innerHTML = '';
        
        switch (true) {
            case (numberQuestion >= 0 && numberQuestion < questions.length):
                questionTitle.textContent = questions[indexQuestion].question;
                renderAnswers(indexQuestion);
                nextButton.classList.remove('d-none');
                prevButton.classList.remove('d-none');
                sendButton.classList.add('d-none');
                if (numberQuestion === 0) prevButton.classList.add('d-none');
                break;
            
            case (numberQuestion === questions.length):
                questionTitle.textContent = '';
                formAnswers.innerHTML = ` 
                    <div class="form-group">
                        <label for="numberPhone">Введіть свій номер телефону</label>
                        <input type="phone" class="form-control" id="numberPhone">
                    </div>
                `;
                nextButton.classList.add('d-none');
                prevButton.classList.add('d-none');
                sendButton.classList.remove('d-none');
                break;
            
            case (numberQuestion === questions.length + 1):
                formAnswers.innerHTML = `
                    <p>Дякуємо за проходження тесту!</p>
                    <p>Бажаєте пройти тест ще раз?</p>
                    <button class="btn btn-primary" id="restartYes">Так</button>
                    <button class="btn btn-secondary" id="restartNo">Ні</button>
                `;
                
                document.querySelector('#restartYes').addEventListener('click', () => {
                    finalAnswers.length = 0; 
                    location.reload();
                });

                document.querySelector('#restartNo').addEventListener('click', () => {
                    modalBlock.classList.add('fade-out');
                    setTimeout(() => modalBlock.classList.remove('d-block'), 500);
                    testCompleted = true; 
                });
                break;
        }
    };

    const checkAnswer = () => {
        const obj = {};
        const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone');
        inputs.forEach((input, index) => {
            if (numberQuestion >= 0 && numberQuestion < questions.length) {
                obj[`${index}_${questions[numberQuestion].question}`] = input.value;
            }
            if (numberQuestion === questions.length) {
                obj['Номер телефону'] = input.value;
            }
        });
        finalAnswers.push(obj);
        console.log(finalAnswers);  // Вывод ответа в консоль
    };

    nextButton.onclick = () => {
        checkAnswer();
        numberQuestion++;
        renderQuestions(numberQuestion);
    };

    prevButton.onclick = () => {
        numberQuestion--;
        renderQuestions(numberQuestion);
    };

    sendButton.onclick = () => {
        checkAnswer();
        numberQuestion++;
        renderQuestions(numberQuestion);
    };

    btnOpenModal.addEventListener('click', () => {
        if (testCompleted) { 
            alert("Ви вже пройшли тест, дякуємо за відповідь");
        } else {
            modalBlock.classList.add('d-block');
            modalBlock.classList.remove('fade-out');
            renderQuestions(numberQuestion);
        }
    });

    closeModal.addEventListener('click', () => {
        modalBlock.classList.add('fade-out');
        setTimeout(() => modalBlock.classList.remove('d-block'), 500); 
    });
});
