import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

document.addEventListener('DOMContentLoaded', function () {
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const burgerBtn = document.getElementById('burger');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const sendButton = document.querySelector('#send');
    const modalDialog = document.querySelector('.modal-dialog');

    const firebaseConfig = {
        apiKey: "AIzaSyAv6_fSGChHLUc295RbDyohyByr8K5n1kY",
        authDomain: "testburger-b3e12.firebaseapp.com",
        databaseURL: "https://testburger-b3e12-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "testburger-b3e12",
        storageBucket: "testburger-b3e12.appspot.com",
        messagingSenderId: "722230044349",
        appId: "1:722230044349:web:d8cf2cdee62857743df9d4",
        measurementId: "G-0PGMSDNDHS"
    };
    
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    const getData = () => {
        formAnswers.textContent = 'Завантаження...';
        nextButton.classList.add('d-none');
        prevButton.classList.add('d-none');

        get(ref(db, 'questions'))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    playTest(snapshot.val());
                } else {
                    console.log("Дані відсутні");
                }
            })
            .catch((error) => {
                console.error("Помилка завантаження даних:", error);
            });
    };

    modalBlock.style.opacity = '0';
    modalBlock.style.transition = 'opacity 0.5s ease';

    const showModal = () => {
        modalBlock.classList.add('d-block');
        modalBlock.style.opacity = '1';
    };

    const hideModal = () => {
        modalBlock.style.opacity = '0';
        setTimeout(() => {
            modalBlock.classList.remove('d-block');
        }, 500);  
    };

    btnOpenModal.addEventListener('click', () => {
        showModal();
        getData();
    });

    closeModal.addEventListener('click', () => {
        hideModal();
        burgerBtn.classList.remove('active');
    });

    document.addEventListener('click', function (event) {
        if (
            !event.target.closest('.modal-dialog') &&
            !event.target.closest('#btnOpenModal') &&
            !event.target.closest('#burger')
        ) {
            hideModal();
        }
    });

    const playTest = (questions) => {
        const finalAnswers = [];
        let numberQuestion = 0;

        const renderAnswers = (index) => {
            formAnswers.innerHTML = ''; 
            questions[index].answers.forEach((answer) => {
                const answerItem = document.createElement('div');
                answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');
                answerItem.innerHTML = `
                    <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                    <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                        <img class="answerImg" src="${answer.url}" alt="${answer.title}">
                        <span>${answer.title}</span>
                    </label>
                `;
                formAnswers.appendChild(answerItem);
            });
        };

        const renderQuestions = (indexQuestion) => {
            formAnswers.innerHTML = '';
            questionTitle.textContent = '';

            if (indexQuestion >= 0 && indexQuestion < questions.length) {
                questionTitle.textContent = questions[indexQuestion].question;
                renderAnswers(indexQuestion);
                nextButton.classList.remove('d-none');
                prevButton.classList.remove('d-none');
                sendButton.classList.add('d-none');
                if (indexQuestion === 0) prevButton.classList.add('d-none');
            } else if (indexQuestion === questions.length) {
                questionTitle.textContent = 'Введіть свій номер телефону';
                formAnswers.innerHTML = `
                    <div class="form-group">
                        <label for="numberPhone">Введіть номер телефону</label>
                        <input type="phone" class="form-control" id="numberPhone" placeholder="+380">
                    </div>
                `;
                nextButton.classList.add('d-none');
                prevButton.classList.remove('d-none');
                sendButton.classList.remove('d-none');
            } else {
                questionTitle.textContent = 'Дякуємо за пройдене тестування!';
                formAnswers.innerHTML = `
                    <p>Хочете почати тест заново?</p>
                    <button id="retryTest" class="btn btn-primary">Так</button>
                    <button id="closeTab" class="btn btn-secondary">Ні</button>
                `;

                document.getElementById('retryTest').addEventListener('click', () => {
                    location.reload(); 
                });

                document.getElementById('closeTab').addEventListener('click', () => {
                    window.close(); 
                });
            }
        };

        const checkAnswer = () => {
            const obj = {};
            const inputs = formAnswers.querySelectorAll('input:checked, #numberPhone');

            inputs.forEach((input, index) => {
                if (numberQuestion < questions.length) {
                    obj[`${index}_${questions[numberQuestion].question}`] = input.value;
                } else if (input.id === 'numberPhone') {
                    obj['Номер телефону'] = input.value;
                }
            });

            finalAnswers.push(obj);
        };

        nextButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
        };

        prevButton.onclick = () => {
            if (numberQuestion > 0) {
                numberQuestion--;
                renderQuestions(numberQuestion);
            }
        };

        sendButton.onclick = () => {
            checkAnswer();
            push(ref(db, 'Відповіді'), finalAnswers)
                .then(() => {
                    console.log("Дані успішно збережені!");
                    numberQuestion++;
                    renderQuestions(numberQuestion);
                })
                .catch((error) => {
                    console.error("Помилка збереження даних:", error);
                });
        };

        renderQuestions(numberQuestion);
    };

  
    const phoneInput = document.getElementById('numberPhone');
    phoneInput.addEventListener('focus', function() {
        if (!phoneInput.value) {
            phoneInput.value = '+380'; 
        }
    });

    
    phoneInput.addEventListener('input', function() {
        if (phoneInput.value.startsWith('+380') === false) {
            phoneInput.value = '+380' + phoneInput.value.replace(/[^0-9]/g, ''); 
        }
    });
});
