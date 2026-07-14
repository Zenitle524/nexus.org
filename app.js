// ——— АНИМАЦИЯ СТАТУСА ———
const statusText = document.getElementById('statusText');
let dots = 0;
setInterval(() => {
    dots = (dots + 1) % 4;
    statusText.textContent = 'Строим свободу' + '.'.repeat(dots);
}, 1000);

// ——— ПЕРЕКЛЮЧЕНИЕ ТЕМЫ ———
const toggleBtn = document.getElementById('themeToggle');

// Применяем сохранённую тему при загрузке
if (localStorage.getItem('nexus-theme') === 'dark') {
    document.documentElement.classList.add('dark');
}

toggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('nexus-theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});

console.log('%cNEXUS Build 0.1.0', 'font-size:20px;font-weight:bold;color:#4caf50;');
console.log('Boot sequence...');
setTimeout(() => console.log('Loading network...'), 100);
setTimeout(() => console.log('Loading encryption...'), 200);
setTimeout(() => console.log('Loading interface...'), 300);
setTimeout(() => console.log('%cDone.', 'font-weight:bold;color:#4caf50;'), 400);
setTimeout(() => console.log('%cFreedom initialized.', 'font-style:italic;color:#888;'), 500);
