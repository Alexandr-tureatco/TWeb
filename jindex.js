
    function niceName(file) {
      // anti_mage.png -> Anti Mage
      const base = file.replace(/\.[^.]+$/, '');
      return base
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    function waitNextFrame() {
      return new Promise(r => requestAnimationFrame(() => r()));
    }

    async function buildHeroes() {
      const track = document.getElementById('heroTrack');

      // ⚠️ если heroes.json рядом с html — './heroes.json'
      // если в корне сайта — '/heroes.json'
      const res = await fetch('./heroes.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Не найден heroes.json');

      const files = await res.json();

      // 1) создаём оригинальные карточки (без дублей в HTML)
      const originals = [];
      for (const file of files) {
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
      }

      // даём браузеру отрисовать, чтобы размеры были корректные
      await waitNextFrame();

      // 2) считаем ширину оригинального набора
      const gap = 16; // должно совпадать с CSS gap
      let originalWidth = 0;
      for (const el of originals) {
        originalWidth += el.getBoundingClientRect().width;
      }
      originalWidth += (originals.length - 1) * gap;

      // Если мало карточек и ширина меньше экрана — доклоним, чтобы лента не выглядела пусто
      // (но всё равно без ручного дубля — это JS)
      const marquee = document.querySelector('.hero-marquee');
      const needWidth = marquee.getBoundingClientRect().width * 2;

      while (originalWidth < needWidth) {
        for (const el of originals) {
          const clone = el.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          clone.style.pointerEvents = 'none';
          track.appendChild(clone);
          originalWidth += el.getBoundingClientRect().width + gap;
          if (originalWidth >= needWidth) break;
        }
      }

      // 3) теперь делаем “хвост” для бесшовности: клон первого набора
      originals.forEach(el => {
        const clone = el.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.style.pointerEvents = 'none';
        track.appendChild(clone);
      });

      await waitNextFrame();

      // 4) запускаем бесконечный скролл
      // скорость в px/сек (меняй как хочешь)
      const SPEED = 140;

      // путь прокрутки = ширина оригинального набора (самого первого списка, без хвоста)
      // пересчитаем точнее по первым N оригиналам:
      let loopWidth = 0;
      for (const el of originals) loopWidth += el.getBoundingClientRect().width;
      loopWidth += (originals.length - 1) * gap;

      const durationMs = (loopWidth / SPEED) * 1000;

      // анимация через Web Animations API (не требует keyframes в CSS)
      const anim = track.animate(
        [
          { transform: 'translateX(0)' },
          { transform: `translateX(-${loopWidth}px)` }
        ],
        { duration: durationMs, iterations: Infinity, easing: 'linear' }
      );

      // пауза/плей при наведении именно на область marquee
      marquee.addEventListener('mouseenter', () => anim.pause());
      marquee.addEventListener('mouseleave', () => anim.play());
    }

    buildHeroes().catch(err => {
      console.error(err);
      alert('Ошибка: ' + err.message + '\\nПроверь, что heroes.json лежит рядом с HTML, а картинки в img/heroes/');
    });
