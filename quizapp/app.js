
const start = document.querySelector('#start');
const submit = document.querySelector('#submit');
const question = document.querySelector('#questions');
const feedback = document.querySelector('#feedback');
const quiz = document.querySelector('#quiz');
const back = document.querySelector('#back');
const heading = document.querySelector('#heading')

let questionsData = [];

start.addEventListener('click', async function(e){
    start.style.display = 'none';
    quiz.style.display = 'block'
    submit.style.display = 'block';
    heading.style.marginTop = '0'
    back.style.display = 'none';  // Hide "Back" button initially
    e.preventDefault();
    
    const res = await axios.get('https://opentdb.com/api.php?amount=10');
    questionsData = res.data.results.map(item => ({
        question: item.question,
        correctAnswer: item.correct_answer,
        allOptions: [item.correct_answer, ...item.incorrect_answers]
    }));

    questionsData.forEach((data, index) => {
        makeOptions(data.question, data.allOptions, index);
    });
})

const makeOptions = (q, options, index) => {
    let div = document.createElement('div');
    div.classList.add('question');
    let p = document.createElement('P');
    p.innerHTML = `Q${index + 1}: ${q}`;

    div.appendChild(p);
    for (let j = 0; j < options.length; j++) {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `question${index}`;  
        radio.value = options[j];
        radio.id = `option${index}-${j}`;

        const label = document.createElement('label');
        label.htmlFor = `option${index}-${j}`;
        label.textContent = options[j];
        div.appendChild(radio);
        div.appendChild(label);
        div.appendChild(document.createElement('br'));
    }
    question.appendChild(div);
};
submit.addEventListener('click', function (e) {
    e.preventDefault();
      

    let score = 0;
    const radioButtons = document.querySelectorAll('input[type="radio"]');  // Select all radio buttons dynamically
console.log(radioButtons);
    questionsData.forEach((data, index) => {
        const selectedOption = Array.from(document.querySelectorAll(`input[name="question${index}"]`))
            .find(radio => radio.checked);  // Check if any radio button is selected for this question
        
        if (selectedOption) {
            const userAnswer = selectedOption.value;
            const correctAnswer = data.correctAnswer;

            const isCorrect = userAnswer === correctAnswer;
            const resultText = isCorrect ? 'Correct!' : `Incorrect! Correct answer: ${correctAnswer}`;
            score += isCorrect ? 1 : 0;

            const resultDiv = document.createElement('div');
            resultDiv.innerHTML = `Q${index + 1}: ${resultText}`;
            feedback.appendChild(resultDiv);
        } else {
            const resultDiv = document.createElement('div');
            resultDiv.innerHTML = `Q${index + 1}: You didn't answer this question.`;
            feedback.appendChild(resultDiv);
        }
    });

    const scoreDiv = document.createElement('div');
    scoreDiv.innerHTML = `Your score: ${score} / ${questionsData.length}`;
    scoreDiv.id = 'score'
    if (score === 0){
        scoreDiv.style.color = 'red'
    }
    feedback.appendChild(scoreDiv);

    feedback.style.display = 'block'; // Show feedback
    radioButtons.forEach(radio => radio.disabled = true); // Disable all radio buttons
    
    back.style.display = 'block'; // Show back button
    quiz.innerHTML = '';

});

back.addEventListener('click', function () {
    feedback.innerHTML = '';
    feedback.style.display = 'none';
    back.style.display = 'none';
    start.style.display = 'block';
    question.innerHTML = '';
    heading.style.marginTop = '5em'
    start.addEventListener('click', async function (e) {
        start.style.display = 'none';
        submit.style.display = 'block';
        e.preventDefault();
        
        const res = await axios.get('https://opentdb.com/api.php?amount=10');
        questionsData = res.data.results.map(item => ({
            question: item.question,
            correctAnswer: item.correct_answer,
            allOptions: [item.correct_answer, ...item.incorrect_answers]
        }));
        
        questionsData.forEach((data, index) => {
            makeOptions(data.question, data.allOptions, index);
        });
        
    });
});
