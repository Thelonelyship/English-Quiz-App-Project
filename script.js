// ! Start Quiz Button
const startQuiz = document.getElementById('startquiz')
// ! Next Question Button
const nextButton = document.getElementById('nextquestion')
// ! Main menu
const startMenu = document.querySelector('.startMenu');
// ! Quiz
const quiz = document.querySelector('.quiz');
// ! Showing a Question
const questionSection = document.getElementById('question');
// ! Section with Answers
const answerButtonsSection = document.getElementById('answerwrapper');
// ! End Page
const end = document.querySelector('.end');
// ! Score During Quiz
const scoreDisplay = document.querySelector('.score');
// ! Score on End Page
const finalScore = document.querySelector('.finalscore');
// ! Question Number
const questionNumber = document.getElementById('number');
// ! Restart Button on End Page
const restartQuiz = document.getElementById('restart');
// ! Level Selection
const difficultySelector = document.getElementById('level');
// ! Show Graph
const showGraph = document.getElementById('graphbutton')
const graph = document.querySelector('.graphpage')
// ! Restart Button on Graph Page
const restartQuiz2 = document.getElementById('restart2');

let shuffledQ, currentQuestionIndex; // ! Shuffling the questions later
let score = 0; // ! Starting Score is 0
let timerInterval; // ! Setting the time
    
// ! When Clicking the Buttons
startQuiz.addEventListener('click', startGame);
restartQuiz.addEventListener('click', returnToMainMenu);
restartQuiz2.addEventListener('click', returnToMainMenu);
showGraph.addEventListener('click', displayGraph)
nextButton.addEventListener('click', () => {
        currentQuestionIndex++;    // ! moves up a question
        if (currentQuestionIndex >= shuffledQ.length) { // ! If there are no questions left hide all and show end screen
            quiz.classList.add('hideall'); 
            end.classList.remove('hideall'); 
            scoreDisplay.classList.add('hideall');
            endQuiz(); 
        } else { // ! Otherwise, reset the timer and show the next question
            resetTimer();
            nextQuestion();
        }
    });


// ! Start the Game
function startGame() {
    // ! They pick the level
    const selectedLevel = difficultySelector.value; 
    // ! Load the questions from that level
    const filteredQuestions = questions.filter(question => question.level === selectedLevel);
    // ! Joke pop up
    if (filteredQuestions.length === 0) {
        alert("You're a god and don't need my help!");
        return;
    }
    // ! This shuffles the questions randomly
    shuffledQ = filteredQuestions.sort(() => Math.random() - 0.5);
    // ! Start at 0 question index and 0 score
    currentQuestionIndex = 0;
    score = 0;
    // ! Update the score
    updateScore();
    // ! hide start screen and load the quiz and scores
    startMenu.classList.add('hideall');
    quiz.classList.remove('hideall');
    scoreDisplay.classList.remove('hideall');
    resetTimer();
    nextQuestion();
}


// ! Clear and load next question
function nextQuestion() {
    resetState();
    showQuestion(shuffledQ[currentQuestionIndex]);
    questionNumber.innerText = `Question: ${currentQuestionIndex + 1}`;

}

// ! Return to Main Menu
function returnToMainMenu() {
    end.classList.add('hideall'); 
    startMenu.classList.remove('hideall'); 
    scoreDisplay.classList.add('hideall'); 
    graph.classList.add('hideall');
}

// ! Show the question in the app
function showQuestion(question) {
    questionSection.innerText = question.question;
    question.answers.sort(() => Math.random() - 0.5); // ! Randomizes answer order
    question.answers.forEach(answer => {
        const answerbox = document.createElement('button');
        answerbox.innerText = answer.text;
        answerbox.classList.add('answerbutton');
        if (answer.correct) {
            answerbox.dataset.correct = answer.correct;
        }
        answerbox.addEventListener('click', selectAnswer);
        answerButtonsSection.appendChild(answerbox);
    });
}

// ! Reset the state
function resetState() {
    while (answerButtonsSection.firstChild) {
        answerButtonsSection.removeChild(answerButtonsSection.firstChild);
    }
}

// ! Update the score display
function updateScore() {
    scoreValue.innerText = score;
}

// ! Select an answer
function selectAnswer(e) {
    // ! allows you to target and pick an answer
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    setStatusClass(selectedButton, correct);
    if (correct) {
        score++;
        updateScore();
    }
    // ! Array.from makes it an array to apply .foreach loop
    Array.from(answerButtonsSection.children).forEach(answerbox => {
        setStatusClass(answerbox, answerbox.dataset.correct);
    });
    clearInterval(timerInterval); // ! Stops the timer when you pick an answer
}

// ! Correct or Wrong
function setStatusClass(element, correct) {
    clearStatusClass(element);
    // ! adds the colours to show if it's right or wrong
    if (correct) {
        element.classList.add('correct');
        disableAnswerButtons();
    } else {
        element.classList.add('wrong');
        disableAnswerButtons();
    }
}
    // ! removes the right or wrong colours to reset it for the next question
function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}


// ! Reset and Start Timer
function resetTimer() {
    fulltime = 20;
    progressBar.style.width = '100%';
    progressText.innerHTML = `${fulltime}s`;
    clearInterval(timerInterval); // ! Clears the previous timer
    timerInterval = setInterval(updateTimer, 1000); // ! Starts a new timer
}

// ! Timer Function
function updateTimer() {
    fulltime--;

    // ! Update progress bar width and text
    progressBar.style.width = `${(fulltime / 20) * 100}%`;
    progressText.innerHTML = `${fulltime}s`;

    // ! Stop the timer, reveal the correct answer and disable all answer buttons because too late
    if (fulltime <= 0) {
        clearInterval(timerInterval);
        revealCorrectAnswer();
        disableAnswerButtons();
        
    }
}

// ! Reveal the Correct Answer
function revealCorrectAnswer() {
    // ! Array.from makes it an array to apply .foreach loop
    Array.from(answerButtonsSection.children).forEach(answerbox => {
        if (answerbox.dataset.correct === "true") {
            answerbox.classList.add('correct'); // ! Highlights the correct answer
        }
    });
}

// ! Disable Answer Buttons
function disableAnswerButtons() {
    // ! Array.from makes it an array to apply .foreach loop
    Array.from(answerButtonsSection.children).forEach(answerbox => {
        answerbox.disabled = true; // ! Disables all answer buttons when no longer allowed to answer
    });
}

// ! End the quiz
function endQuiz() {
    quiz.classList.add('hideall'); // ! Hides the quiz by adding the hideall class
    end.classList.remove('hideall'); // ! Shows the end page by removing the hideall class
    scoreDisplay.classList.add('hideall'); // ! Hides the score display
    finalScore.innerText = score; // ! Updates the final score on end page
    clearInterval(timerInterval); // ! Stops the timer
}




// ! Progress Bar Timing
const progressBar = document.querySelector(".progressbar");
const progressText = document.querySelector(".timeleft");

let fulltime = 20;
let x = setInterval(function() {
    fulltime -= 1;
    clearInterval(x);

    // ! Update progress bar width and text
    progressBar.style.width = `${(fulltime / 20) * 100}%`; 
    progressText.innerHTML = `${fulltime}s`;

    // ! Stop the interval when fulltime reaches 0
    if (fulltime <= 0) {
        clearInterval(x); 
        revealCorrectAnswer()
    }
}, 1000); // ! Runs it every second


// ! Show Graph
function displayGraph(){
    end.classList.add('hideall'); // ! Hides the end screen
    graph.classList.remove('hideall') // ! Shows graph page
}








// ! Questions
const questions = [
        {
            level: 'A1',
            question: 'Where are ____ from?',
            answers: [
                { text: 'you are', correct: false },
                { text: 'you', correct: true },
                { text: 'are you', correct: false },
                { text: 'Did', correct: false }
            ]
        },
        {
            level: 'A1',
            question: 'We have ___ house in Moscow.',
            answers: [
                { text: 'any', correct: false },
                { text: 'a', correct: true },
                { text: 'an', correct: false },
                { text: 'many', correct: false }
            ]
        },
        {
            level: 'A1',
            question: 'I have two ____, a boy and a girl.',
            answers: [
                { text: 'sons', correct: false },
                { text: 'too', correct: false },
                { text: 'daughter', correct: false },
                { text: 'children', correct: true }
            ]
        },
        {
            level: 'A1',
            question: 'I work in a ____. I’m a doctor.',
            answers: [
                { text: 'supermarket', correct: false },
                { text: 'shop', correct: false },
                { text: 'hospital', correct: true },
                { text: 'hotel', correct: false }
            ]
        },
        {
            level: 'A1',
            question: 'This is my brother. ____ name’s Paul.',
            answers: [
                { text: 'Her', correct: false },
                { text: 'His', correct: true },
                { text: 'He’s', correct: false },
                { text: 'She’s', correct: false }
            ]
        },
        {
            level: 'A1',
            question: '____ five people in my family.',
            answers: [
                { text: 'They are', correct: false },
                { text: 'There is', correct: false },
                { text: 'They is', correct: false },
                { text: 'There are', correct: true }
            ]
        },
        {
            level: 'A1',
            question: 'I get up ____ 7 o’clock in the morning.',
            answers: [
                { text: 'at', correct: true },
                { text: 'in', correct: false },
                { text: 'on', correct: false },
                { text: 'for', correct: false }
            ]
        },
        {
            level: 'A1',
            question: 'I like apples, but I ____ bananas.',
            answers: [
                { text: 'don’t like', correct: true },
                { text: 'like', correct: false },
                { text: 'do like', correct: false },
                { text: 'likes', correct: false }
            ]
        },
        {
            level: 'A1',
            question: 'Excuse me. ____ speak French?',
            answers: [
                { text: 'Do you', correct: true },
                { text: 'You', correct: false },
                { text: 'You do', correct: false },
                { text: 'We are', correct: false }
            ]
        },
        {
            level: 'A1',
            question: 'How much are ____ shoes?',
            answers: [
                { text: 'this', correct: false },
                { text: 'that', correct: false },
                { text: 'these', correct: true },
                { text: 'one', correct: false }
            ]
        },
        {
            level: 'A1',
            question: 'Where are my glasses? They’re ____ the table.',
            answers: [
                { text: 'between', correct: false },
                { text: 'on', correct: true },
                { text: 'in', correct: false },
                { text: 'at', correct: false }
            ]
        },
        {
            level: 'A1',
            question: 'My sister ____ tennis very well.',
            answers: [
                { text: 'plays', correct: true },
                { text: 'play', correct: false },
                { text: 'playing', correct: false },
                { text: 'unplayed', correct: false }
            ]
        },
        {
            level: 'A1',
            question: 'I usually go to work ____ train.',
            answers: [
                { text: 'on', correct: false },
                { text: 'by', correct: true },
                { text: 'with', correct: false },
                { text: 'from', correct: false }
            ]
        },
        {
            level: 'A1',
            question: 'I don’t see my parents very often ____ they live in South Africa.',
            answers: [
                { text: 'so', correct: false },
                { text: 'but', correct: false },
                { text: 'because', correct: true },
                { text: 'moreover', correct: false }
            ]
        },
        {
            level: 'A1',
            question: 'Rosie stayed ____ home yesterday afternoon.',
            answers: [
                { text: 'in', correct: false },
                { text: 'with', correct: false },
                { text: 'to', correct: false },
                { text: 'at', correct: true }
            ]
        },
        {
            level: 'A1',
            question: 'Last night, I ___ to the cinema.',
            answers: [
                { text: 'went', correct: true },
                { text: 'was', correct: false },
                { text: 'did', correct: false },
                { text: 'go', correct: false }
            ]
        },
        {
            level: 'A1',
            question: 'The ____ is very expensive but the food there is excellent.',
            answers: [
                { text: 'restaurant', correct: true },
                { text: 'film', correct: false },
                { text: 'book', correct: false },
                { text: 'computer', correct: false }
            ]
        },
        {
            level: 'A1',
            question: 'Do you want to listen to music or _____ TV?',
            answers: [
                { text: 'see', correct: false },
                { text: 'look', correct: false },
                { text: 'watch', correct: true },
                { text: 'listen', correct: false }
            ]
        },
        {
            level: 'A1',
            question: '___ were you at the weekend? I was in Scotland.',
            answers: [
                { text: 'When', correct: false },
                { text: 'Who', correct: false },
                { text: 'Where', correct: true },
                { text: 'What', correct: false }
            ]
        },
        {
            level: 'A1',
            question: '_____ you have a good time at the party? Yes, it was fun.',
            answers: [
                { text: 'Did', correct: true },
                { text: 'Had', correct: false },
                { text: 'Were', correct: false },
                { text: 'Was', correct: false }
            ]
        },
        {
            level: 'A2',
            question: 'Are you _____ English teacher?',
            answers: [
                { text: 'Maria', correct: false },
                { text: `Marias'`, correct: false },
                { text: `Maria's`, correct: true },
                { text: 'of Maria', correct: false }
            ]
        },
        {
            level: 'A2',
            question: 'Bob will meet ____ at the airport.',
            answers: [
                { text: 'us', correct: true },
                { text: 'we', correct: false },
                { text: 'our', correct: false },
                { text: 'ours', correct: false }
            ]
        },
        {
            level: 'A2',
            question: `I'm going to a concert tonight. ____ you like to come?`,
            answers: [
                { text: 'Do', correct: false },
                { text: 'Are', correct: false },
                { text: 'Would', correct: true },
                { text: 'Did', correct: false }
            ]
        },
        {
            level: 'A2',
            question: `Hey! ___ use your dictionary?\n \nSure. Here you are!`,
            answers: [
                { text: 'Could I', correct: true },
                { text: 'Could you', correct: false },
                { text: 'Do I', correct: false },
                { text: 'Did She?', correct: false }
            ]
        },
        {
            level: 'A2',
            question: 'I like this apartment, but the ___ is too expensive!',
            answers: [
                { text: 'money', correct: false },
                { text: 'tax', correct: false },
                { text: 'costs', correct: false },
                { text: 'rent', correct: true }
            ]
        },
        {
            level: 'A2',
            question: 'Excuse me. How do I ___ to the bus station?',
            answers: [
                { text: 'come', correct: false },
                { text: 'get', correct: true },
                { text: 'arrive', correct: false },
                { text: 'terminal', correct: false }
            ]
        },
        {
            level: 'A2',
            question: `Do you sell stamps?\n \nYes, we do. How ___ do you want?`,
            answers: [
                { text: 'any', correct: false },
                { text: 'few', correct: false },
                { text: 'much', correct: false },
                { text: 'many', correct: true }
            ]
        },
        {
            level: 'A2',
            question: `Sorry I'm so late!\n \nThat's ____.`,
            answers: [
                { text: 'good', correct: false },
                { text: 'okay', correct: true },
                { text: 'right', correct: false },
                { text: 'great', correct: false }
            ]
        },
        {
            level: 'A2',
            question: `I'd like ___ milk in my coffee, please.`,
            answers: [
                { text: 'some', correct: true },
                { text: 'a', correct: false },
                { text: 'any', correct: false },
                { text: 'many', correct: false }
            ]
        },
        {
            level: 'A2',
            question: '____ a bus stop near my flat.',
            answers: [
                { text: `Here's`, correct: false },
                { text: `It's`, correct: false },
                { text: `There's`, correct: true },
                { text: `Theirs`, correct: false }
            ]
        },
        {
            level: 'A2',
            question: 'Is this a good time to talk?\n \nSorry, no. I ___ dinner.',
            answers: [
                { text: 'am cooking', correct: true },
                { text: 'cook', correct: false },
                { text: 'cooking', correct: false },
                { text: 'cooked', correct: false }
            ]
        },
        {
            level: 'A2',
            question: 'I think cycling is more dangerous ____ driving.',
            answers: [
                { text: 'like', correct: false },
                { text: 'as', correct: false },
                { text: 'than', correct: true },
                { text: 'similar', correct: false }
            ]
        },
        {
            level: 'A2',
            question: 'We ____ going to the theater next Saturday.',
            answers: [
                { text: 'Will', correct: false },
                { text: 'do', correct: false },
                { text: 'are', correct: true },
                { text: 'have', correct: false }
            ]
        },
        {
            level: 'A2',
            question: '____ meet for coffee some time soon.',
            answers: [
                { text: 'Do you', correct: false },
                { text: 'We', correct: false },
                { text: 'Shall they', correct: false },
                { text: 'Let’s', correct: true }
            ]
        },
        {
            level: 'A2',
            question: 'Robert has a holiday home near ____ sea.',
            answers: [
                { text: 'many', correct: false },
                { text: 'the', correct: true },
                { text: 'some', correct: false },
                { text: 'an', correct: false }
            ]
        },
        {
            level: 'A2',
            question: 'If you’ve got a headache, you ____ go home.',
            answers: [
                { text: 'should', correct: true },
                { text: 'did', correct: false },
                { text: 'had', correct: false },
                { text: 'never', correct: false }
            ]
        },
        {
            level: 'A2',
            question: '___ ever been to New York?',
            answers: [
                { text: 'Have you', correct: true },
                { text: 'Are you', correct: false },
                { text: 'Did you', correct: false },
                { text: 'Do you', correct: false }
            ]
        },
        {
            level: 'A2',
            question: 'I only get about 5 hours sleep at night.\n \nThat’s not ______.',
            answers: [
                { text: 'enough', correct: true },
                { text: 'lot', correct: false },
                { text: 'too much', correct: false },
                { text: 'more', correct: false }
            ]
        },
        {
            level: 'A2',
            question: 'Did Amanda finish the report?\n \nNo. She ____ it tomorrow.',
            answers: [
                { text: 'finishes', correct: false },
                { text: 'is going to finish', correct: true },
                { text: 'finished', correct: false },
                { text: 'finishing', correct: false }
            ]
        },
        {
            level: 'A2',
            question: 'Paula _____ loves working with children.',
            answers: [
                { text: 'really', correct: true },
                { text: 'very', correct: false },
                { text: 'much', correct: false },
                { text: 'loves', correct: false }
            ]
        },
        {
            level: 'B1',
            question: 'Is Ottawa the capital of Canada?',
            answers: [
                { text: 'is', correct: false },
                { text: 'yes', correct: true },
                { text: 'so', correct: false },
                { text: 'right', correct: false }
            ]
        },
        {
            level: 'B1',
            question: 'We never ___ a television when I was a child.',
            answers: [
                { text: 'have had', correct: false },
                { text: 'hadn’t', correct: false },
                { text: 'had', correct: true },
                { text: 'didn’t have', correct: false }
            ]
        },
        {
            level: 'B1',
            question: 'We paid the restaurant bill ____ credit card.',
            answers: [
                { text: 'to', correct: false },
                { text: 'with', correct: false },
                { text: 'on', correct: false },
                { text: 'by', correct: true }
            ]
        },
        {
            level: 'B1',
            question: 'The last time I ____ Joanna was in Paris.',
            answers: [
                { text: 'have seen', correct: false },
                { text: 'saw', correct: true },
                { text: 'see', correct: false },
                { text: 'was seeing', correct: false }
            ]
        },
        {
            level: 'B1',
            question: 'If you ____ money from a friend, you should always pay it back promptly.',
            answers: [
                { text: 'borrow', correct: true },
                { text: 'earn', correct: false },
                { text: 'spend', correct: false },
                { text: 'lend', correct: false }
            ]
        },
        {
            level: 'B1',
            question: 'Can I make myself a cup of coffee?\n \nOf course. You ___ to ask.',
            answers: [
                { text: 'haven’t', correct: false },
                { text: 'mustn’t', correct: false },
                { text: 'needn’t', correct: false },
                { text: 'don’t have', correct: true }
            ]
        },
        {
            level: 'B1',
            question: 'I _____ a lot of sports in my free time.',
            answers: [
                { text: 'play', correct: true },
                { text: 'pretend', correct: false },
                { text: 'make', correct: false },
                { text: 'exercise', correct: false }
            ]
        },
        {
            level: 'B1',
            question: '____ anywhere interesting recently?',
            answers: [
                { text: 'Did you go', correct: false },
                { text: 'Have you been', correct: true },
                { text: 'Are you going', correct: false },
                { text: 'Will you go', correct: false }
            ]
        },
        {
            level: 'B1',
            question: 'It’s Walter’s birthday on Friday. He ____ be 30, I think.',
            answers: [
                { text: 'should', correct: false },
                { text: 'can', correct: false },
                { text: 'will', correct: true },
                { text: 'shall', correct: false }
            ]
        },
        {
            level: 'B1',
            question: 'Learning the piano isn’t as difficult ____ learning the violin.',
            answers: [
                { text: 'like', correct: false },
                { text: 'so', correct: false },
                { text: 'than', correct: false },
                { text: 'as', correct: true }
            ]
        },
        {
            level: 'B1',
            question: 'If the weather ___ bad tomorrow, we can go to a museum.',
            answers: [
                { text: 'will be', correct: false },
                { text: 'was', correct: false },
                { text: 'is', correct: true },
                { text: 'would be', correct: false }
            ]
        },
        {
            level: 'B1',
            question: 'About a billion cans of pop ___ drunk around the world every day.',
            answers: [
                { text: 'is', correct: false },
                { text: 'are', correct: true },
                { text: 'was', correct: false },
                { text: 'were', correct: false }
            ]
        },
        {
            level: 'B1',
            question: 'My mum’s not very well.\n \nOh, ______.',
            answers: [
                { text: 'It doesn’t matter', correct: false },
                { text: 'I do apologise', correct: false },
                { text: 'sorry to hear that', correct: true },
                { text: 'not bad, thanks', correct: false }
            ]
        },
        {
            level: 'B1',
            question: 'Hans isn’t here. He ___ to see his grandmother. He’ll be back tomorrow.',
            answers: [
                { text: 'has gone', correct: true },
                { text: 'had been', correct: false },
                { text: 'has been', correct: false },
                { text: 'had gone', correct: false }
            ]
        },
        {
            level: 'B1',
            question: 'Would you mind changing the appointment? ___ time on Friday is fine.',
            answers: [
                { text: 'Next', correct: false },
                { text: 'All the', correct: false },
                { text: 'Every', correct: false },
                { text: 'Any', correct: true }
            ]
        },
        {
            level: 'B1',
            question: 'When I was a child, I ____ climb the wall and jump into our neighbours’ garden.',
            answers: [
                { text: 'would', correct: true },
                { text: 'did', correct: false },
                { text: 'have', correct: false },
                { text: 'used', correct: false }
            ]
        },
        {
            level: 'B1',
            question: 'Have you finished ___ the wall yet?',
            answers: [
                { text: 'paint', correct: false },
                { text: 'to paint', correct: false },
                { text: 'painting', correct: true },
                { text: 'painted', correct: false }
            ]
        },
        {
            level: 'B1',
            question: 'Can you help me? I’ve tried ____ hotel in the city and can’t find a room.',
            answers: [
                { text: 'many', correct: false },
                { text: 'every', correct: true },
                { text: 'any', correct: false },
                { text: 'all', correct: false }
            ]
        },
        {
            level: 'B1',
            question: 'Lana used to find work boring ____ she became a nurse.',
            answers: [
                { text: 'unless', correct: false },
                { text: 'until', correct: true },
                { text: 'if', correct: false },
                { text: 'since', correct: false }
            ]
        },
        {
            level: 'B1',
            question: 'If I ____ closer to my office, I could walk to work.',
            answers: [
                { text: 'lived', correct: true },
                { text: 'would live', correct: false },
                { text: 'had lived', correct: false },
                { text: 'live', correct: false }
            ]
        },
        {
            level: 'B2',
            question: 'I ____ outside the cinema when suddenly a police car arrived.',
            answers: [
                { text: 'stood', correct: false },
                { text: 'was standing', correct: true },
                { text: 'have stood', correct: false },
                { text: 'am standing', correct: false }
            ]
        },
        {
            level: 'B2',
            question: 'Shall we go to The Rosebud for dinner?\n \nIt ___ be fully booked. They’re sometimes busy on a Monday.',
            answers: [
                { text: 'will', correct: false },
                { text: 'may', correct: true },
                { text: 'can', correct: false },
                { text: 'must', correct: false }
            ]
        },
        {
            level: 'B2',
            question: 'We’ve ____ come back from a trip to India. It was amazing.',
            answers: [
                { text: 'already', correct: false },
                { text: 'yet', correct: false },
                { text: 'just', correct: true },
                { text: 'only', correct: false }
            ]
        },
        {
            level: 'B2',
            question: 'I’ve got to be at work in 5 minutes.\n \nDon’t worry. I ___ you a lift if you want.',
            answers: [
                { text: 'give', correct: false },
                { text: 'am giving', correct: false },
                { text: ' will give', correct: true },
                { text: 'am going to give', correct: false }
            ]
        },
        {
            level: 'B2',
            question: 'My doctor advised me ____ more exercise.',
            answers: [
                { text: 'take', correct: false },
                { text: 'taking', correct: false },
                { text: 'having taken', correct: false },
                { text: 'to take', correct: true }
            ]
        },
        {
            level: 'B2',
            question: 'I couldn’t ____ up with the noise in the city, so we moved to the countryside.',
            answers: [
                { text: 'put', correct: true },
                { text: 'live', correct: false },
                { text: 'set', correct: false },
                { text: 'take', correct: false }
            ]
        },
        {
            level: 'B2',
            question: 'There’s no name on this dictionary.\n \nIt ___ be mine then. Mine’s got my name on the front.',
            answers: [
                { text: 'might not', correct: false },
                { text: 'must', correct: false },
                { text: 'won’t', correct: false },
                { text: 'can’t', correct: true }
            ]
        },
        {
            level: 'B2',
            question: 'Julia ____ married since she was 20.',
            answers: [
                { text: 'is', correct: false },
                { text: 'was', correct: false },
                { text: 'has been', correct: true },
                { text: 'is being', correct: false }
            ]
        },
        {
            level: 'B2',
            question: 'Don’t worry. If I ___ late tonight, I’m going to the gym after work.',
            answers: [
                { text: 'am', correct: true },
                { text: 'will be', correct: false },
                { text: 'would be', correct: false },
                { text: 'was', correct: false }
            ]
        },
        {
            level: 'B2',
            question: 'I’ve got a terrible headache, and it won’t go away. Should I try ___ some aspirin?',
            answers: [
                { text: 'to take', correct: false },
                { text: 'take', correct: false },
                { text: 'took', correct: false },
                { text: 'taking', correct: true }
            ]
        },
        {
            level: 'B2',
            question: 'Boxing is a sport ___ requires a lot of speed and fitness.',
            answers: [
                { text: 'it', correct: false },
                { text: 'that', correct: true },
                { text: 'what', correct: false },
                { text: 'where', correct: false }
            ]
        },
        {
            level: 'B2',
            question: 'Jon ___ working on this project for a couple of months so he hasn’t made much progress yet.',
            answers: [
                { text: 'is only', correct: false },
                { text: 'has only been', correct: true },
                { text: 'was only', correct: false },
                { text: 'had only been', correct: false }
            ]
        },
        {
            level: 'B2',
            question: 'Excuse me, I was wondering ___ I could ask you some questions.',
            answers: [
                { text: 'what', correct: false },
                { text: 'if', correct: true },
                { text: 'that', correct: false },
                { text: 'how', correct: false }
            ]
        },
        {
            level: 'B2',
            question: 'What clothes should I pack for my Oslo trip? It depends ___ the time of year that you go.',
            answers: [
                { text: 'on', correct: true },
                { text: 'with', correct: false },
                { text: 'up', correct: false },
                { text: 'to', correct: false }
            ]
        },
        {
            level: 'B2',
            question: 'I’ve finished this salad and I’m still hungry. I ___ ordered something more filling.',
            answers: [
                { text: 'must have', correct: false },
                { text: 'would have', correct: false },
                { text: 'should have', correct: true },
                { text: 'may have', correct: false }
            ]
        },
        {
            level: 'B2',
            question: 'Do you ever ask your neighbours to do favours ___ you?',
            answers: [
                { text: 'for', correct: true },
                { text: 'to', correct: false },
                { text: 'with', correct: false },
                { text: 'about', correct: false }
            ]
        },
        {
            level: 'B2',
            question: 'Some married couples seem to get more ____ over time.',
            answers: [
                { text: 'alike', correct: true },
                { text: 'same', correct: false },
                { text: 'like', correct: false },
                { text: 'equal', correct: false }
            ]
        },
        {
            level: 'B2',
            question: 'I don’t know how much this card costs. The price label’s ____ off.',
            answers: [
                { text: 'gone', correct: false },
                { text: 'taken', correct: false },
                { text: 'done', correct: false },
                { text: 'come', correct: true }
            ]
        },
        {
            level: 'B2',
            question: 'Ben got the job because he ___ a very good impression at his interview.',
            answers: [
                { text: 'made', correct: true },
                { text: 'did', correct: false },
                { text: 'put', correct: false },
                { text: 'took', correct: false }
            ]
        },
        {
            level: 'B2',
            question: 'Salsa music always ___ me of my trip to Cuba.',
            answers: [
                { text: 'remembers', correct: false },
                { text: 'realizes', correct: false },
                { text: 'recognizes', correct: false },
                { text: 'reminds', correct: true }
            ]
        },
        {
            level: 'C1',
            question: 'I ___ to be picking Tom up at the station but I’ve lost my keys.',
            answers: [
                { text: 'am supposed', correct: true },
                { text: 'am requested', correct: false },
                { text: 'am intended', correct: false },
                { text: 'am obliged', correct: false }
            ]
        },
        {
            level: 'C1',
            question: 'How about going to Colours nightclub?\n \nThere’s no ___ I’m going there. It’s awful!',
            answers: [
                { text: 'hope', correct: false },
                { text: 'way', correct: true },
                { text: 'time', correct: false },
                { text: 'opportunity', correct: false }
            ]
        },
        {
            level: 'C1',
            question: 'By the age of 18, I ___ not to go to university.',
            answers: [
                { text: 'had decided', correct: true },
                { text: 'decided', correct: false },
                { text: 'have decided', correct: false },
                { text: 'was deciding', correct: false }
            ]
        },
        {
            level: 'C1',
            question: 'I’m afraid your car ____ repaired before next week.',
            answers: [
                { text: 'hasn’t been', correct: false },
                { text: 'wasn’t', correct: false },
                { text: 'wouldn’t be', correct: false },
                { text: 'can’t be', correct: true }
            ]
        },
        {
            level: 'C1',
            question: 'The amount of organically grown food on sale has enormously ____ in recent years.',
            answers: [
                { text: 'raised', correct: false },
                { text: 'lifted', correct: false },
                { text: 'increased', correct: true },
                { text: 'built', correct: false }
            ]
        },
        {
            level: 'C1',
            question: 'A woman has been ____ by police for hacking into the computer of her online virtual husband.',
            answers: [
                { text: 'accused', correct: false },
                { text: 'suspended', correct: false },
                { text: 'arrested', correct: true },
                { text: 'suspected', correct: false }
            ]
        },
        {
            level: 'C1',
            question: 'You may borrow my laptop ___ you promise to look after it.',
            answers: [
                { text: 'unless', correct: false },
                { text: 'in case', correct: false },
                { text: 'as long as', correct: true },
                { text: 'although', correct: false }
            ]
        },
        {
            level: 'C1',
            question: 'It’s a huge painting. It ___ taken ages to complete.',
            answers: [
                { text: 'must have', correct: true },
                { text: 'can’t have', correct: false },
                { text: 'should have', correct: false },
                { text: 'won’t have', correct: false }
            ]
        },
        {
            level: 'C1',
            question: 'Pierre tends to put ___ dealing with problems, rather than dealing with them immediately.',
            answers: [
                { text: 'down', correct: false },
                { text: 'off', correct: true },
                { text: 'over', correct: false },
                { text: 'away', correct: false }
            ]
        },
        {
            level: 'C1',
            question: 'If the taxi hadn’t stopped for us, we ___ standing in the rain.',
            answers: [
                { text: 'were still', correct: false },
                { text: 'would still be', correct: true },
                { text: 'are still', correct: false },
                { text: 'will still be', correct: false }
            ]
        },
        {
            level: 'C1',
            question: 'My mother’s Italian, so the language has been quite easy ____ for me.',
            answers: [
                { text: 'to learn', correct: true },
                { text: 'learn', correct: false },
                { text: 'having learned', correct: false },
                { text: 'learning', correct: false }
            ]
        },
        {
            level: 'C1',
            question: '____ I had the talent, I still wouldn’t want to be a chef.',
            answers: [
                { text: 'In case', correct: false },
                { text: 'Even if', correct: true },
                { text: 'Provided that', correct: false },
                { text: 'However much', correct: false }
            ]
        },
        {
            level: 'C1',
            question: 'The factory workers threatened ____ on strike if they didn’t get the pay rise.',
            answers: [
                { text: 'going', correct: false },
                { text: 'to go', correct: true },
                { text: 'that they go', correct: false },
                { text: 'to have gone', correct: false }
            ]
        },
        {
            level: 'C1',
            question: 'I was about to go to sleep when it ___ to me where the missing keys might be.',
            answers: [
                { text: 'remembered', correct: false },
                { text: 'happened', correct: false },
                { text: 'appeared', correct: false },
                { text: 'occurred', correct: true }
            ]
        },
        {
            level: 'C1',
            question: 'There’s going to be a new department at work. They’ve asked me to ___ it up.',
            answers: [
                { text: 'take', correct: false },
                { text: 'set', correct: true },
                { text: 'put', correct: false },
                { text: 'bring', correct: false }
            ]
        },
        {
            level: 'C1',
            question: 'If the film is a ___ success, the director will get most of the credit.',
            answers: [
                { text: 'big', correct: true },
                { text: 'high', correct: false },
                { text: 'large', correct: false },
                { text: 'good', correct: false }
            ]
        },
        {
            level: 'C1',
            question: 'By the end of today’s seminar, I will ___ to each of you individually.',
            answers: [
                { text: 'speak', correct: false },
                { text: 'have spoken', correct: true },
                { text: 'be speaking', correct: false },
                { text: 'have been speaking', correct: false }
            ]
        },
        {
            level: 'C1',
            question: 'This is a photo of my sister ___ pizza on the beach.',
            answers: [
                { text: 'eat', correct: false },
                { text: 'eating', correct: true },
                { text: 'was eating', correct: false },
                { text: 'having eaten', correct: false }
            ]
        },
        {
            level: 'C1',
            question: 'Our students take their responsibilities very _____.',
            answers: [
                { text: 'considerably', correct: false },
                { text: 'thoroughly', correct: false },
                { text: 'seriously', correct: true },
                { text: 'strongly', correct: false }
            ]
        },
        {
            level: 'C1',
            question: 'Peter was ____ delighted with the birthday present.',
            answers: [
                { text: 'very', correct: false },
                { text: 'slightly', correct: false },
                { text: 'fairly', correct: false },
                { text: 'absolutely', correct: true }
            ]
        },
        {
            level: 'C2',
            question: 'Despite her ___ efforts to finish the project on time, unforeseen delays were inevitable.',
            answers: [
                { text: 'zealous', correct: true },
                { text: 'furtive', correct: false },
                { text: 'gregarious', correct: false },
                { text: 'disingenuous', correct: false }
            ]
        },
        {
            level: 'C2',
            question: 'The loud, chaotic meeting room turned into a ___ of sounds that made it difficult to think clearly.',
            answers: [
                { text: 'conundrum', correct: false },
                { text: 'cacophony', correct: true },
                { text: 'coalition', correct: false },
                { text: 'complexity', correct: false }
            ]
        },
        {
            level: 'C2',
            question: 'Known for his ___ speaking style, the politician often attracted both admiration and criticism.',
            answers: [
                { text: 'bombastic', correct: true },
                { text: 'subservient', correct: false },
                { text: 'ubiquitous', correct: false },
                { text: 'furtive', correct: false }
            ]
        },
        {
            level: 'C2',
            question: 'Many were ___ by the professor’s lecture, finding his points complex and difficult to decipher.',
            answers: [
                { text: 'fascinated', correct: false },
                { text: 'nonplussed', correct: true },
                { text: 'underwhelmed', correct: false },
                { text: 'indoctrinated', correct: false }
            ]
        },
        {
            level: 'C2',
            question: 'In his art, the artist would often ___ vibrant colors with muted tones to create an intense visual effect.',
            answers: [
                { text: 'genuflect', correct: false },
                { text: 'juxtapose', correct: true },
                { text: 'suspire', correct: false },
                { text: 'flummox', correct: false }
            ]
        },
        {
            level: 'C2',
            question: 'His sudden kindness was an ___ from his usual distant demeanor.',
            answers: [
                { text: 'aberration', correct: true },
                { text: 'overindulgence', correct: false },
                { text: 'incognito', correct: false },
                { text: 'enticement', correct: false }
            ]
        },
        {
            level: 'C2',
            question: 'The detective regarded the case as a complete ___, with no obvious clues or leads.',
            answers: [
                { text: 'encroachment', correct: false },
                { text: 'enigma', correct: true },
                { text: 'foundry', correct: false },
                { text: 'myriad', correct: false }
            ]
        },
        {
            level: 'C2',
            question: 'It is ___ that such matters should be handled with utmost care, as they involve significant privacy concerns.',
            answers: [
                { text: 'gregarious', correct: false },
                { text: 'ubiquitous', correct: false },
                { text: 'axiomatic', correct: true },
                { text: 'salient', correct: false }
            ]
        },
        {
            level: 'C2',
            question: 'His ___ presence at every event was noted by everyone.',
            answers: [
                { text: 'ubiquitous', correct: true },
                { text: 'furtive', correct: false },
                { text: 'nonplussed', correct: false },
                { text: 'bombastic', correct: false }
            ]
        },
        {
            level: 'C2',
            question: 'The scientist considered the phenomena to be a ___ idea that challenged existing theories.',
            answers: [
                { text: 'revolutionary', correct: true },
                { text: 'conspicuous', correct: false },
                { text: 'palpable', correct: false },
                { text: 'disparage', correct: false }
            ]
        },
        {
            level: 'C2',
            question: 'She was the fabled ____ of doom.',
            answers: [
                { text: 'harbinger', correct: true },
                { text: 'paradigm', correct: false },
                { text: 'cacophony', correct: false },
                { text: 'specimen', correct: false }
            ]
        },
        {
            level: 'C2',
            question: 'The boss was ___, so I had to focus carefully on every detail to understand.',
            answers: [
                { text: 'wrathful', correct: false },
                { text: 'somber', correct: false },
                { text: 'inscrutable', correct: true },
                { text: 'destitute', correct: false }
            ]
        },
        {
            level: 'C2',
            question: 'The CEO’s ___ commentary on the competitor’s products led to a series of public relations issues.',
            answers: [
                { text: 'intrigued', correct: false },
                { text: 'disparaging', correct: true },
                { text: 'excruciating', correct: false },
                { text: 'sanguine', correct: false }
            ]
        },
        {
            level: 'C2',
            question: 'In his transformation from student to leader, he underwent a complete ___.',
            answers: [
                { text: 'exacerbation', correct: false },
                { text: 'metamorphosis', correct: true },
                { text: 'aberration', correct: false },
                { text: 'hypothesis', correct: false }
            ]
        },
        {
            level: 'C2',
            question: ' "____ show some respect down on one knee" - Disney reference.',
            answers: [
                { text: 'evolve', correct: false },
                { text: 'dwindle', correct: false },
                { text: 'genuflect', correct: true },
                { text: 'manipulate', correct: false }
            ]
        },
        {
            level: 'C2',
            question: 'His actions were similar to mine, but with a few _____ differences.',
            answers: [
                { text: 'jinxed', correct: false },
                { text: 'reticent', correct: false },
                { text: 'salient', correct: true },
                { text: 'zealous', correct: false }
            ]
        },
        {
            level: 'C2',
            question: 'The scientist was left pondering the ___ properties of the new material, as they defied easy explanation.',
            answers: [
                { text: 'myriad', correct: false },
                { text: 'inscrutable', correct: true },
                { text: 'witty', correct: false },
                { text: 'dogmatic', correct: false }
            ]
        },
        {
            level: 'C2',
            question: 'They faced quite the ______ after his actions caught the attention of the media.',
            answers: [
                { text: 'awe', correct: false },
                { text: 'ambiguity', correct: false },
                { text: 'whereabouts', correct: false },
                { text: 'conundrum', correct: true }
            ]
        },
        {
            level: 'C2',
            question: 'She had a ____ of ideas to tackle the issues the company faced.',
            answers: [
                { text: 'myriad', correct: true },
                { text: 'perseverance', correct: false },
                { text: 'bias', correct: false },
                { text: 'remorse', correct: false }
            ]
        },
        {
            level: 'C2',
            question: 'The decision to close the company seemed an ___ in an otherwise stable industry.',
            answers: [
                { text: 'aberration', correct: true },
                { text: 'exile', correct: false },
                { text: 'influx', correct: false },
                { text: 'onus', correct: false }
            ]
        }
    ];
