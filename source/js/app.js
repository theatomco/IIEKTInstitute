var backgrounds = ['//iiekt.kbsu.ru/wp-content/uploads/2017/04/1.png', '//iiekt.kbsu.ru/wp-content/uploads/2017/04/9.png', '//iiekt.kbsu.ru/wp-content/uploads/2017/04/14.png', '//iiekt.kbsu.ru/wp-content/uploads/2017/04/2.png', '//iiekt.kbsu.ru/wp-content/uploads/2017/04/3.png'];

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

var background = document.getElementsByClassName('background')[0];

background.style.backgroundImage = 'url(' + backgrounds[getRandom(0, backgrounds.length)] + ')';
