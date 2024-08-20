const quizScreen = document.querySelector(".question-screen");
const passScreen = document.querySelector(".pass-screen");
const failScreen = document.querySelector(".fail-screen");

const quizForm = document.querySelector(".quiz-question");

const API_URL =
	"https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple";

let quizData = [];
let currentQuestionIndex = 0;
let correctAnswer = "";
let score = 0;
const currentQuestion = ""


// FUNCTION TO START THE QUIZ WITH API DATA
async function fetchQuizData() {
	try {
		const response = await fetch(API_URL);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();

		// console.log(data);

		quizData = data.results;
		console.log(quizData);

		// once you get the data from API, use the data to update the Quiz
		updateQuiz();
	} catch (error) {
		console.error(`Error fetching quiz data: ${error.message}`);
	}
}

// once you get the data from API, use the data to update the Quiz
// get the question and answers from API
// populate the HTML with correct question and answer options

function updateQuiz() {
	if (currentQuestionIndex >= quizData.length) {
		alert("Quiz completed! Refresh again.");
		return;
	}

	// SETTING CURRENT QUESTION NUMBER FOR QUIZ, IE. 1
	const currentQuestion = quizData[currentQuestionIndex];

	// GETTING THE QUESTION FROM API
	question = currentQuestion.question;

	// GETTING THE ANSWERS FROM API - BOTH CORRECT AND INCORRECT
	// correctAnswer is declared in global variable
	correctAnswer = currentQuestion.correct_answer;
	let incorrectAnswers = currentQuestion.incorrect_answers;
	console.log(`correct answer first : ${correctAnswer}, ${incorrectAnswers}`);

	// GETTING BOTH THE SETS OF ANSWERS IN ONE ARRAY
	let answerChoices = [correctAnswer, ...incorrectAnswers];
	console.log(answerChoices);

	// call the function to shuffle the answer choices array
	let shuffledAnswerChoices = shuffleChoices([...answerChoices]);
	console.log(`shuffled : ${shuffledAnswerChoices}`);

	// get the question from the API and populate it in the HTML element
	document.getElementById("legend-question").innerHTML = question;

	// USE forEach to loop through the four choices and get their index
	// and use the ID from HTML to populate it with API information
	shuffledAnswerChoices.forEach((answer, index) => {
		const labelId = `label-answer-${index + 1}`;
		const inputId = `answer-${index + 1}`;

		console.log(answer, index);
		console.log(labelId, inputId);

		const label = (document.getElementById(labelId).textContent = answer);
		const input = (document.getElementById(inputId).value = answer);
	});
}


// function to shuffle the incorrectAnswer choices and correctAnswer using Fisher-Yates (Knuth) shuffle

function shuffleChoices(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));

		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
}

// to stop it from refreshing
// if no option is reselected then send an alert message
//  check if selected answer is the correct answer as per the API
// if the first answer is correct, update the score, show the pass screen, go to the next question
// if the answer is wrong, show the fail screen, the correct answer and go to the next question
function handleSubmit(event) {
	event.preventDefault();

	const selectedInput = document.querySelector('input[name="answer"]:checked');

	console.log(selectedInput);

	if (!selectedInput) {
		alert("Enter input to play. Restart!");
		return;
	}

	const answer = selectedInput.value;

	if (answer === correctAnswer) {
		pass();
		score++;
		updateScore();
		let gotItRight = document.getElementById('got-it-right');
		gotItRight.innerHTML += `<p>${question} <br> ${correctAnswer}</p>`;
		// nextQuestion();
	} else {
		fail();
		updateScore();
		let correctAnswerForYou = document.getElementById("correct-answer-for-you");
		correctAnswerForYou.innerHTML += `<p>${question} <br> ${correctAnswer}</p>`;
		// nextQuestion();
	}
}

function pass() {
	// hide the quiz screen
	quizScreen.classList.remove("show");
	quizScreen.classList.add("hide");
	failScreen.classList.remove("show");
	failScreen.classList.add("hide");

	// show the pass screen
	passScreen.classList.remove("hide");
	passScreen.classList.add("show");
}

function fail() {
	// hide the quiz screen
	quizScreen.classList.remove("show");
	quizScreen.classList.add("hide");
	passScreen.classList.remove("show");
	passScreen.classList.add("hide");

	// show the fail screen
	failScreen.classList.remove("hide");
	failScreen.classList.add("show");
}



// update the score on Pass and Fail screens
// it will have a div with id="score"

function updateScore() {
	const totalScore = document.getElementById("score");
	totalScore.textContent = `You scored ${score} out of ${quizData.length}`;
	// totalScore.innerHTML += "<h3>All answers</h3>";

	// quizData.forEach((el, index) => {
	// 	totalScore.innerHTML += `<p>${index + 1}. ${el.correct_answer}</p>`;
	// });
}

// go to next question till it reaches end of the 10 question or whatever API length is specified
function nextQuestion() {
	if (currentQuestionIndex < quizData.length - 1) {
		currentQuestionIndex++;
		updateQuiz();
	} else {
		updateScore();
	}
}

document
	.getElementById("next-question-pass")
	.addEventListener("click", function () {
		passScreen.classList.remove("show");
		passScreen.classList.add("hide");
		quizScreen.classList.remove("hide");
		quizScreen.classList.add("show");
		currentQuestionIndex++;
		updateQuiz();
	});

document
	.getElementById("next-question-fail")
	.addEventListener("click", function () {
		failScreen.classList.remove("show");
		failScreen.classList.add("hide");
		quizScreen.classList.remove("hide");
		quizScreen.classList.add("show");
		currentQuestionIndex++;
		updateQuiz();
	});

quizForm.addEventListener("submit", handleSubmit);

document.addEventListener("DOMContentLoaded", fetchQuizData);

// issues I got into while running this file
// 1. GET https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple 429 (Too Many Requests)

// 2.how to sort an array
// use Fisher-Yates algorithm

// 3. Error fetching quiz data: Cannot set properties of null (setting 'value')
//  had to keep adjusting the div, label, inputs to see the 4 answer options finally, but it is unable to select the correct answers and the radio buttons are out of the label

// 4. not able to corelate the correct answer with the players selected input

// 5. not able to get the Next Question button to show the next question.

// the quiz skips some questions in between

// the fail screen is not showing the correct answer.
