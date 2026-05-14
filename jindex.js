
    function niceName(file) {
    const base = file.replace(/\.[^.]+$/, '');
    return base
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

// Ждем отрисовки кадра, чтобы браузер успел посчитать ширину элементов
function waitNextFrame() {
    return new Promise(r => requestAnimationFrame(() => r()));
}

/**
 * 2. ЛОГИКА АВТОРИЗАЦИИ И НИКА
 */
async function checkAuthAndLoadUser() {
    try {
        const res = await fetch('/api/me');
        if (res.ok) {
            const data = await res.json();
            // Ищем кнопку ника в дропдауне (по тексту или классу)
            const userNameBtn = document.querySelector('.dropbtn');
            if (userNameBtn && data.username) {
                // Если это кнопка "ГЛАВНАЯ", не трогаем её, ищем именно ту, где был "НИК"
                // В твоем HTML это последний элемент nav
                const dropdowns = document.querySelectorAll('.dropbtn');
                const lastBtn = dropdowns[dropdowns.length - 1];
                lastBtn.innerText = data.username.toUpperCase() + " ▾";
            }
        } else {
            // Если сервер сказал "401 Unauthorized" — на выход
            window.location.href = "/login.html";
        }
    } catch (err) {
        console.error("Ошибка проверки сессии:", err);
    }
}

/**
 * 3. ПОСТРОЕНИЕ ЛЕНТЫ ГЕРОЕВ
 */
async function buildHeroes() {
    const track = document.getElementById('heroTrack');
    const marquee = document.querySelector('.hero-marquee');
    if (!track || !marquee) return;

    // Загружаем список имен файлов из JSON
    const res = await fetch('./heroes.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Не найден heroes.json');

    const files = await res.json();
    const originals = [];

    // 1) Создаём оригинальные карточки
    files.forEach(file => {
        const name = niceName(file);

        const a = document.createElement('a');
        a.className = 'hero-card';
        a.href = `./img/heroes/${file}`;
        a.style.backgroundImage = `url('./img/heroes/${file}')`;

        const title = document.createElement('div');
        title.className = 'hero-name';
        title.textContent = name;

        a.appendChild(title);
        track.appendChild(a);
        originals.push(a);
    });

    await waitNextFrame();

    // 2) Рассчитываем ширину для бесконечного скролла
    const gap = 16; // Должно совпадать с CSS gap в .hero-track
    let loopWidth = 0;
    originals.forEach(el => {
        loopWidth += el.getBoundingClientRect().width;
    });
    loopWidth += (originals.length - 1) * gap;

    // 3) Создаём "хвост" (клоны) для бесшовности
    originals.forEach(el => {
        const clone = el.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.style.pointerEvents = 'none';
        track.appendChild(clone);
    });

    // 4) Запуск анимации через Web Animations API
    const SPEED = 100; // пикселей в секунду
    const durationMs = (loopWidth / SPEED) * 1000;

    const anim = track.animate(
        [
            { transform: 'translateX(0)' },
            { transform: `translateX(-${loopWidth + gap}px)` }
        ],
        {
            duration: durationMs,
            iterations: Infinity,
            easing: 'linear'
        }
    );

    // Пауза при наведении
    marquee.addEventListener('mouseenter', () => anim.pause());
    marquee.addEventListener('mouseleave', () => anim.play());
}

/**
 * 4. ОБРАБОТКА ВЫХОДА
 */
function setupLogout() {
    // Ищем ссылку "выход" внутри dropdown-content
    const logoutLinks = document.querySelectorAll('.dropdown-content a');
    logoutLinks.forEach(link => {
        if (link.textContent.toLowerCase().includes('выход')) {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const res = await fetch('/logout');
                if (res.ok) {
                    window.location.href = "/login.html";
                }
            });
        }
    });
}

/**
 * ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
 */
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthAndLoadUser(); // Сначала безопасность
    buildHeroes().catch(console.error); // Затем визуал
    setupLogout(); // Затем кнопки
});