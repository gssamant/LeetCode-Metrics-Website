function func() {
	let tex = document.getElementById('user-input');
	alert('I am working ' + tex.textContent)
}

let button = document.getElementById('search');
button.addEventListener('click', func)