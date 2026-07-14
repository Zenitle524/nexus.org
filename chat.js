import { initializeApp } from "firebase-app";
import { getDatabase, ref, push, onChildAdded } from "firebase-database";

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
const database = getDatabase(app);
const messagesRef = ref(database, 'messages');

const messagesContainer = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const logoutBtn = document.getElementById('logoutBtn');

const username = localStorage.getItem('nexus-username') || 'Аноним';

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    push(messagesRef, { author: username, text, time })
        .then(() => chatInput.value = '')
        .catch(() => alert('Ошибка отправки. Проверь интернет или Firebase.'));
}

onChildAdded(messagesRef, (data) => {
    const msg = data.val();
    const el = document.createElement('div');
    el.className = 'chat-message';
    el.innerHTML = `<span class="author">${msg.author}</span><span class="time">${msg.time}</span><span>${msg.text}</span>`;
    messagesContainer.appendChild(el);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

sendBtn.addEventListener('click', (e) => { e.preventDefault(); sendMessage(); });
chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } });
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('nexus-session');
    window.location.href = 'sign.html';
});

console.log('🔥 Nexus Chat — подключён к Firebase');
