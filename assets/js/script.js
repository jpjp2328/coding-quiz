// Grabed syntaxs that would be used from the html
var timerTag = document.querySelector('#timer');
var timerP = document.querySelector('header').children[1];
var highScoresBtn = document.querySelector('#highScoresBtn');
var startBtn = document.querySelector('#startBtn');
var submitInitialsBtn = document.querySelector('#submitInitialsBtn');
var goBackBtn = document.querySelector('#goBackBtn');
var clearHighScoreBtn = document.querySelector('#clearHighScoreBtn');
var questionTitle = document.querySelector('#questionTitle');
var answerList = document.querySelector('ul');

// Content card containing the questions and answers
var quizCard = {
    questions: [
        'Commonly used data types DO NOT include:',
        'The condition in an if / else statement is enclosed within ____.',
        'Arrays in JavaScript can be used to store ____.',
        'String values must be enclosed within ____ when being assigned to variables.',
        'A very useful tool used during development and debugging for printing content to the debugger is:',
    ],
    answers: [
        ['<strings>', '<booleans>', 'correct:<alert>', '<numbers>'],
        ['<quotes>', 'correct:<curly brackets>', '<parentheses>', '<square brackets>'],
        ['<numbers and strings>', '<other arrays>','<booleans>','correct:<all of the above>'],
        ['<commas>', '<curly brackets>', 'correct:<quotes>', '<paraentheses>'],
        ['<JavaScript>', '<terminal/bash>', '<for loops>', 'correct:<console.log>']
    
    ]
}

// variables needed for the quiz
var timerPreset = 75;

var questionIndexNumber = 0;
var timeLeft = timerPreset;
var score = 0;
var quizFinished = true;

// function to go back to the main page
function mainPage() {
    timeLeft = timerPreset;
    timerTag.textContent = timerPreset;

    document.querySelector('#highScoreTally').style.display = 'none';

    questionTitle.textContent = 'Coding Quiz';

    questionTitle.style.display = 'block';
    document.querySelector('#intro').style.display = 'block';
    highScoresBtn.style.display = 'block';
    startBtn.style.display = 'block';

    return;
}

// function to start the quiz
function startQuiz() {
    quizFinished = false; 
    questionIndexNumber = 0;

    //hide elements
    startBtn.getElementsByClassName.display = 'none';
    document.querySelector('#intro').style.display = 'none';
    highScoresBtn.style.display = 'none';
    timerTag.style.display = 'block';

    
    setQuestions(questionIndexNumber);
    timerStart();

    return;

}

// function to start the timer countdown
function timerStart () {
    var timerInterval = setInterval(function() {
        if(quizFinished === true) {
            clearInterval(timerInterval);

            return;
        }

        if(timeLeft < 1) {
            clearInterval(timerInterval);
            gameOver();
        }

        timerTag.textContent = timeLeft;
        timeLeft--;

    }, 1000)

    return;
}

// function to set the questions to the page
function setQuestions(currentQuestionIndex) {
    questionTitle.textContent = quizCard.questions[currentQuestionIndex];
    createAnswers(currentQuestionIndex);

    return;
}

// function to create answer li elements displayed as buttons
function createAnswers(currentQuestionIndex) {
    answerList.innerHTML = '';

    for (let answerIndex = 0; answerIndex < quizCard.answers[currentQuestionIndex].length; answerIndex++) {
        var answerListElement = document.createElement('li');
        var answerStr = quizCard.answers[currentQuestionIndex][answerIndex];

        if (quizCard.answers[currentQuestionIndex][answerIndex].includes('correct:')){
            answerStr = quizCard.answers[currentQuestionIndex][answerIndex].substring(8, quizCard.answers[currentQuestionIndex][answerIndex].length);
            answerListElement.id = 'correct';

        }

        answerListElement.textContent = answerStr;
        answerList.appendChild(answerListElement);
    }

    return;
}

// function to generate the next question
function nextQuestion() {
    questionIndexNumber++; 
    if (questionIndexNumber >= quizCard.questions.length){ 
        gameOver(); 
    } else { 
        setQuestions(questionIndexNumber);
    } 

    return;
}

// function to end the quiz
function gameOver () {
    quizFinished = true;
    score = timeLeft;

    timerP.style.display = 'none';
    questionTitle.style.display = 'none';
    answerList.innerHTML = '';

    document.querySelector('#finalScore').textContent = score;
    document.querySelector('#completedQuiz').style.display = 'block';
    document.querySelector('#inputInitials').style.display = 'block';
    startBtn.style.display = 'none';

    return;
}

// function to check if the answer selected is wrong or not
function checkAnswer(event) {
    if (event.target != answerList){

        if (!(event.target.id.includes('correct'))){
            timeLeft -= 5;
        }

        nextQuestion();
    }

    return;
}

// function to store user data (initials and score) to local storage when user submits details
function storeUserData() {
    var inputInitialsBox = document.querySelector('input');
    var tempArrayOfObjects = [];

    if(inputInitialsBox.value != '' || inputInitialsBox.value != null) {
        var tempObject = { 
            names: inputInitialsBox.value,
            scores: score,
        }

        if(window.localStorage.getItem('highScores') == null) {
            tempArrayOfObjects.push(tempObject);
            window.localStorage.setItem('highScores', JSON.stringify(tempArrayOfObjects));

        } else {
            tempArrayOfObjects = JSON.parse(window.localStorage.getItem('highScores'));

            for (let index = 0; index <= tempArrayOfObjects.length; index++) {
                if (index == tempArrayOfObjects.length) {
                    tempArrayOfObjects.push(tempObject)
                    break;
                } else if (tempArrayOfObjects[index].scores < score) {
                    tempArrayOfObjects.splice(index, 0, tempObject);
                    break;
                }
            }
            window.localStorage.setItem('highScores', JSON.stringify(tempArrayOfObjects))
        }
        document.querySelector('input').value = '';
        score = 0;

        showHighscores();
    }

    return;
}

// function to show highscore div with stored data when highscore button is clicked
function showHighscores() {
    //hide elements
    questionTitle.style.display = 'none';
    startBtn.style.display = 'none';
    document.querySelector('header').children[0].style.display = 'none';
    document.querySelector('#intro').style.display = 'none';
    document.querySelector('#completedQuiz').style.display = 'none';

    //show elements
    document.querySelector('#highScoreTally').style.display = 'block';

    tempOrderList = document.querySelector('ol');
    tempOrderList.innerHTML = '';

    tempArrayOfObjects = JSON.parse(window.localStorage.getItem('highScores'));
    if (tempArrayOfObjects != null) {
        for (let index = 0; index < tempArrayOfObjects.length; index++) {
            var newScore = documenet.createElement('li')
            newScore.textContent = tempArrayOfObjects[index].names + ' - ' + tempArrayOfObjects[index].scores;
            tempOrderList.appendChild(newScore);
        }

    } else {
        var newScore = document.createElement('p')
        newScore.textContent = 'No HighScore';
        tempOrderList.appendChild(newScore);
    }

    return;
}

// function to clear highscores, clearing the local storage
function clearHighscores() {
    document.querySelector('ol').innerHTML = '';
    window.localStorage.clear();

    mainPage();

    return;
}


// function to initial event listeners upon loading of the page
function init() {
    
    startBtn.addEventListener('click', startQuiz);
    answerList.addEventListener('click', checkAnswer);
    highScoresBtn.addEventListener('click', showHighscores);
    submitInitialsBtn.addEventListener('click', storeUserData);
    clearHighScoreBtn.addEventListener('click', clearHighscores);
    goBackBtn.addEventListener('click', mainPage);

    mainPage();

    return;
}

init();
