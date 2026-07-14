import { initializeApp } from "firebase-app";
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase-auth";

const firebaseConfig = {
    apiKey: "AIzaSyCL1VI4bmYpb7GTwnDE1zKH6IGExS8edLI",
    authDomain: "zeta-chat-1e907.firebaseapp.com",
    databaseURL: "https://zeta-chat-1e907-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "zeta-chat-1e907",
    storageBucket: "zeta-chat-1e907.firebasestorage.app",
    messagingSenderId: "3672822289",
    appId: "1:3672822289:web:ac2d329e54d0ce420c97b0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ——— ЭЛЕМЕНТЫ ———
const usernameInput = document.getElementById('reg-username');
const emailInput = document.getElementById('reg-email');
const passwordInput = document.getElementById('reg-password');
const password2Input = document.getElementById('reg-password2');
const registerBtn = document.getElementById('registerBtn');
const verifyBtn = document.getElementById('verifyBtn');
const registerForm = document.getElementById('registerForm');
const codeVerification = document.getElementById('codeVerification');
const messageDiv = document.getElementById('registerMessage');
const codeInput = document.getElementById('verification-code');

let tempUserData = {};

function showMessage(text, isError = false) {
    messageDiv.textContent = text;
    messageDiv.style.display = 'block';
    messageDiv.style.color = isError ? '#ff4444' : '#4caf50';
}

registerBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const password2 = password2Input.value.trim();

    if (!username || !email || !password || !password2) {
        showMessage('Заполни все поля.', true);
        return;
    }

    if (password !== password2) {
        showMessage('Пароли не совпадают.', true);
        return;
    }

    if (password.length < 8) {
        showMessage('Пароль должен быть не менее 8 символов.', true);
        return;
    }

    const users = JSON.parse(localStorage.getItem('nexus-users') || '{}');
    if (users[username]) {
        showMessage('Пользователь с таким именем уже существует.', true);
        return;
    }

    for (let key in users) {
        if (users[key].email && users[key].email === email) {
            showMessage('Эта почта уже используется.', true);
            return;
        }
    }

    // Сохраняем данные пользователя временно
    tempUserData = { username, email, password };

    // Отправляем письмо с подтверждением через Firebase
    const actionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true,
    };

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
            window.localStorage.setItem('emailForSignIn', email);
            registerForm.classList.add('hidden');
            codeVerification.classList.remove('hidden');
            showMessage('Письмо с кодом отправлено на твою почту!', false);
        })
        .catch((error) => {
            console.error('Ошибка отправки письма:', error);
            showMessage('Не удалось отправить письмо. Попробуй позже.', true);
        });
});

// Подтверждение кода
verifyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const code = codeInput.value.trim();
    if (!code) {
        showMessage('Введи код из письма.', true);
        return;
    }

    const email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
        showMessage('Ошибка: почта не найдена.', true);
        return;
    }

    signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
            // Код подтверждён — сохраняем пользователя
            const users = JSON.parse(localStorage.getItem('nexus-users') || '{}');
            const { username, password, email: userEmail } = tempUserData;
            users[username] = { password, email: userEmail, confirmed: true };
            localStorage.setItem('nexus-users', JSON.stringify(users));
            localStorage.setItem('nexus-remember-username', username);
            showMessage('Регистрация успешно завершена! Теперь войди.', false);
            setTimeout(() => {
                window.location.href = 'sign.html';
            }, 1500);
        })
        .catch((error) => {
            console.error('Ошибка подтверждения:', error);
            showMessage('Неверный код или ссылка. Попробуй снова.', true);
        });
});

// Если мы вернулись после перехода по ссылке из письма
if (isSignInWithEmailLink(auth, window.location.href)) {
    const email = window.localStorage.getItem('emailForSignIn');
    if (email) {
        signInWithEmailLink(auth, email, window.location.href)
            .then(() => {
                // Автоматически подтверждаем пользователя
                const users = JSON.parse(localStorage.getItem('nexus-users') || '{}');
                const { username, password, email: userEmail } = tempUserData;
                users[username] = { password, email: userEmail, confirmed: true };
                localStorage.setItem('nexus-users', JSON.stringify(users));
                localStorage.setItem('nexus-remember-username', username);
                showMessage('Регистрация успешно завершена!', false);
                setTimeout(() => window.location.href = 'sign.html', 1500);
            })
            .catch((error) => {
                console.error('Ошибка входа по ссылке:', error);
            });
    }
}
