'use strict'

const app = document.querySelector('.app'),
	wrap = document.createElement('div'),
	background = document.createElement('div'),
	step = document.createElement('span'),
	button = document.createElement('button'),
	errorLabel = document.createElement('label')

let i = 1
let p = 3
let quests, errorText

wrap.classList.add('app__wrapper')
background.classList.add('background')
step.classList.add('step')
button.innerText = 'Далее'

app.append(background, step, wrap)

function firstScreen() {
	wrap.innerHTML = `
			<div class="quest txt">
				Внимательно прочитайте вопрос, <br>
				введите ответ в текстовое поле. <br>
				У вас есть 3 подсказки на каждый вопрос, <br>
				необходимо правильно записать ответ, проверьте опечатки
			</div>
			`;
	app.append(button)
	button.innerHTML = `<img class="loaderBtn" src="image/loaderButton.gif" alt="loader"><span>загрузка...</span>`
	button.setAttribute('disabled', 'disabled')

	fetchQuests()
	paralax()

	button.addEventListener('click', questAppend)
}

function fetchQuests() {
	fetch('https://script.google.com/macros/s/AKfycbwVcEEAYuHauNXQF7z7WJIh-jcF9pgq_MKYThm7rYOJtQenxjsXNlwsI7gHtff3i6WJ/exec')
		.then((response) => {
			return response.json();
		})
		.then((response) => {
			quests = response.questions
			button.removeAttribute('disabled')

			button.innerText = 'начать'
		})
}

const questAppend = () => {
	if(quests.length < 1){
		return
	}
	button.removeEventListener('click', questAppend)
	button.addEventListener('click', validate)
	i <= quests.length ? questTextOrImage() : final()
}

function questTextOrImage() {
	if (quests[i - 1].quest.includes('http')) {
		p = 3
		wrap.innerHTML = `
				<div class="quest txt">
					<div class="hint" title="Подсказка"><img src="image/hint.png" alt="hint"></div>
					<div class="hint-length">${p}</div>
					<img class="quest-img" src="${quests[i-1].quest}" type="image/jpeg">
					
					<div class="descr" id="descr">${quests[i-1].description}</div>
					<input name="ansver" type="text" autocomplete="off" placeholder="Ваш ответ"></input>
				</div>
			`
		step.innerText = `Вопрос ${i} из ${quests.length}`
		button.innerText = 'Далее'
		app.append(button)
	} else {
		p = 3
		wrap.innerHTML = `
				<div class="quest txt">
					<div class="hint" title="Подсказка"><img src="image/hint.png" alt="hint"></div>
					<div class="hint-length">${p}</div>
					${quests[i-1].quest}
					<div class="descr">${quests[i-1].description}</div>
					<input name="ansver" type="text" autocomplete="off" placeholder="Ваш ответ"></input>				
				</div>
			`;
			step.innerText = `Вопрос ${i} из ${quests.length}`,
			button.innerText = 'Далее'
			app.append(button)
	}
	clickEnter()
	activeHint()
}

function errorLabels(input) {
	if (input.classList.contains('error')) {
		errorLabel.setAttribute('for', 'ansver')
		errorLabel.classList.add('label')
		input.value === '' ? errorText = 'Введите ответ выше' : errorText = 'Проверьте ответ или опечатки'
		errorLabel.innerHTML = errorText
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

function final() {
	app.innerHTML = `<div class="background"></div><div class="final">Все верно !!!<br><br> Получите Ваше слово !!!</div>`
	button.removeEventListener('click', validate)
	audio()
	paralax()
}

function audio() {
	const audio = new Audio
	audio.src = 'audio/alarm.mp3'
	audio.autoplay = true
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
	},15000)

	hint.addEventListener('click', () => {
		descrHintImg()
		descr.classList.add('active')
		setTimeout(() => {
			hint.classList.remove('active')
			hintLength.classList.remove('active')
		},200)
		
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
		},5000)
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

function paralax() {
	let bg = document.querySelector('.background');
	
	window.addEventListener('mousemove', function(e) {
		let x = e.clientX / window.innerWidth;
		let y = e.clientY / window.innerHeight;  
		bg.style.transform = 'translate(-' + x * 20 + 'px, -' + y * 20 + 'px)';
	});
}
firstScreen()
