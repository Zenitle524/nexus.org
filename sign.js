const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');

function startSession(username) {
    localStorage.setItem('nexus-username', username);
    localStorage.setItem('nexus-session', 'true');
    localStorage.setItem('nexus-remember-username', username);
    window.location.href = 'chat.html';
}

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        alert('Заполни все поля.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('nexus-users') || '{}');
    if (users[username] && users[username].password === password) {
        startSession(username);
    } else {
        alert('Неверный ник или пароль.');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        loginBtn.click();
    }
});
