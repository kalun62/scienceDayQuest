'use strict'

const app = document.querySelector('.app'),
	wrap = document.createElement('div'),
	step = document.createElement('span'),
	button = document.createElement('button'),
	errorLabel = document.createElement('label')

let i = 1
let p = 3
let quests

wrap.classList.add('app__wrapper')
step.classList.add('step')
button.innerText = 'Далее'

app.append(step, wrap)

function firstScreen() {
	wrap.innerHTML = `
		<div class="fl">
			<div class="quest txt">
				Внимательно прочитайте вопрос, <br>
				введите ответ в текстовое поле. <br>
				У вас есть 3 подсказки на каждый вопрос, <br>
				необходимо правильно записать ответ, проверьте опечатки
			</div>
		</div>
	`;
	button.innerText = 'начать'
	document.querySelector('.fl').append(button)
	fetchQuests()
	button.addEventListener('click', questAppend)
}

function fetchQuests() {
	fetch('https://script.google.com/macros/s/AKfycbwZhmLmaU5PojWJKZPmqbSJZ4FNiiaT8d70-7rCGHtzFwaidZH9_uW3b6H7E9_sS4vY/exec')
		.then((response) => {
			return response.json();
		})
		.then((response) => {
			quests = response.questions
		})
}

const questAppend = () => {
	if(quests.length < 1){
		return
	}
	button.removeEventListener('click', questAppend)
	button.addEventListener('click', validate)
	i <= quests.length ? questTextOrImage() : finale()
}

function questTextOrImage() {
	if (quests[i - 1].quest.includes('http')) {
		p = 3
		wrap.innerHTML = `
			<div class="fl">
				<div class="quest txt">
					<div class="hint" title="Подсказка"><img src="image/hint.png" alt="hint"></div>
					<div class="hint-length">${p}</div>
					<img class="quest-img" src="${quests[i-1].quest}" type="image/jpeg">
					
					<div class="descr" id="descr">${quests[i-1].description}</div>
					<input name="ansver" type="text" autocomplete="off" placeholder="Ваш ответ"></input>
				</div>
			</div>
			`
		step.innerText = `Вопрос ${i} из ${quests.length}`
		button.innerText = 'Далее'
		app.append(button)
	} else {
		p = 3
		wrap.innerHTML = `
			<div class="fl">
				<div class="quest txt">
					<div class="hint" title="Подсказка"><img src="image/hint.png" alt="hint"></div>
					<div class="hint-length">${p}</div>
					${quests[i-1].quest}
					<div class="descr">${quests[i-1].description}</div>
					<input name="ansver" type="text" autocomplete="off" placeholder="Ваш ответ"></input>				
				</div>
			</div>
			`;
			step.innerText = `Вопрос ${i} из ${quests.length}`,
			button.innerText = 'Далее'
			document.querySelector('.fl').append(button)
	}
	clickEnter()
	activeHint()
}

function errorLabels(input) {
	if (input.classList.contains('error')) {
		errorLabel.setAttribute('for', 'ansver')
		errorLabel.classList.add('label')
		errorLabel.innerHTML = `Неверно, Проверь опечатки и попробуй еще`
		input.after(errorLabel)
	} else {
		errorLabel.remove()
	}
}

function validate() {
	const input = document.querySelector('input')

	input.addEventListener('focus', () => {
		errorLabel.remove()
		input.classList.remove('error')
	})

	input.value.toLowerCase().trim() != quests[i - 1].answer.toLowerCase().trim() ?
		(input.classList.add('error'), errorLabels(input)) :
		(input.classList.remove('error'), i++, questAppend())
}

function finale() {
	app.innerHTML = `<div class="final">Верно !!!<br> Ваше слово КОЛЫБЕЛИ</div>`
	button.removeEventListener('click', validate)
}

function clickEnter() {
	const input = document.querySelector('input')
	input.addEventListener('keydown', (e) => {
		if (e.keyCode === 13) {
			button.click()
		}
	})
}

function activeHint() {
	const hint = document.querySelector('.hint')
	const hintLength = document.querySelector('.hint-length')
	const descr = document.querySelector('.descr')

	setTimeout(() => {
		hint.classList.add('active')
		hintLength.classList.add('active')
	},30000)

	hint.addEventListener('click', () => {
		descrHintImg()
		descr.classList.add('active')
		hint.classList.remove('active')
		hintLength.classList.remove('active')
		
		if(p > 1){
			p--
			hintLength.innerText = p
		}else{
			hint.style.display = 'none'
			hintLength.style.display = 'none'
		}

		setTimeout(() => {
			descr.classList.remove('active')
			hint.classList.add('active')
			hintLength.classList.add('active')
		},10000)
	})
}

function descrHintImg () {
	const descr = document.getElementById('descr')
	if(descr){
		switch(p){
			case 2: return descr.textContent = 'Попробуй с другой стороны'
			case 1: return descr.textContent = 'Может все-таки посмотреть слева?'	
		}
	}
}
firstScreen()
