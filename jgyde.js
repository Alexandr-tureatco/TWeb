
      // Папки для линий (подстрой под свой проект)
      const FOLDERS = {
        bot: "img/lanes/bot/"
      };

      // Данные (name - отображение, file - имя файла в папке)
      const LANES = [
        {
          key: "bot",
          title: "Hard",
          direction: "right",
          speed: 32,
          heroes: [
            { name: "Марси", file: "marci.png" },
            { name: "Лев", file: "lion.png" },
            { name: "Драконий рыцарь", file: "dragon_knight.png" },
            { name: "Кристальная дева", file: "crystal_maiden.png" },
            { name: "Арбуз", file: "tidehunter.png" },
            { name: "Нига", file: "dark_seer.png" },
            { name: "Ночной сталкер", file: "night_stalker.png" },
            { name: "Ёжик", file: "bristleback.png" },
            { name: "Удильщик", file: "slardar.png" },
            { name: "Управленец", file: "beastmaster.png" },
            { name: "Солнце", file: "dawnbreaker.png" },
            { name: "Подпивас", file: "brewmaster.png" },
            { name: "Воительница", file: "legion_commander.png" },
            { name: "Динозавр", file: "primal_beast.png" },
            { name: "Бара", file: "spirit_breaker.png" },
            { name: "Жук-Убивец", file: "nyx_assassin.png" },
            { name: "Космик", file:"enigma.png"},
            { name: "Землетряс", file:"earthshaker.png"},
            { name: "Феникс", file:"phoenix.png"},
            { name: "Титан", file:"elder_titan.png"},
            { name: "Белка", file:"hoodwink.png"},
            { name: "Неубиваемый", file:"undying.png"},
            { name: "Охотник(Вор в законе)", file:"bounty_hunter.png"},
            { name: "Таскич", file:"tusk.png"},
            { name: "Минёр", file:"techies.png"},
            { name: "Мирана", file:"mirana.png"},
            { name: "Бабка", file:"snapfire.png"},
            { name: "Фугас", file:"pangolier.png"},
            { name: "Марс", file: "mars.png" }
            

          ]
        },
        {
          key: "bot",
          title: "Mid",
          direction: "left",
          speed: 30,
          heroes: [
            { name: "Инвокер", file: "invoker.png" },
            { name: "Штормовой дух", file: "storm_spirit.png" },
            { name: "Пак", file: "puck.png" },
            { name: "Темплар-ассасин", file: "templar_assassin.png" },
            { name: "Лина", file: "lina.png" },
            { name: "Тинкер", file:"tinker.png"},
            { name: "Пустотный дух", file:"void_spirit.png"},
            { name: "Дух огня", file:"ember_spirit.png"},
            { name: "Самасть", file:"arc_warden.png"},
            { name: "Мипо", file:"meepo.png"},
            { name: "Леший", file:"leshrac.png"},
            { name: "Хускич", file:"huskar.png"},
            { name: "Мать пауков", file:"broodmother.png"},
            { name: "Снайпер", file: "sniper.png" },
            { name: "Проводительница душ", file:"death_prophet.png"},
            { name: "Бабка", file:"snapfire.png"}
          ]
        },
        {
          key: "bot",
          title: "Cerry",
          direction: "right",
          speed: 34,
          heroes: [
            { name: "Джаггернаут", file: "juggernaut.png" },
            { name: "Фантомка", file: "phantom_assassin.png" },
            { name: "Тень-шаман", file: "shadow_shaman.png" },
            { name: "Лев", file: "lion.png" },
            { name: "Снайпер", file: "sniper.png" },
            { name: "Джаггернаут", file: "juggernaut.png" },
            { name: "Фантомка", file: "phantom_assassin.png" },
            { name: "Тень-шаман", file: "shadow_shaman.png" },
            { name: "Лев", file: "lion.png" },
            { name: "Снайпер", file: "sniper.png" },
            { name: "Джаггернаут", file: "juggernaut.png" },
            { name: "Фантомка", file: "phantom_assassin.png" },
            { name: "Тень-шаман", file: "shadow_shaman.png" },
            { name: "Лев", file: "lion.png" },
            { name: "Снайпер", file: "sniper.png" }
          ]
        }
      ];

      const root = document.getElementById("lanes-root");

      function escapeHtml(str){
        return String(str)
          .replaceAll("&","&amp;")
          .replaceAll("<","&lt;")
          .replaceAll(">","&gt;")
          .replaceAll('"',"&quot;")
          .replaceAll("'","&#039;");
      }

      function heroCardHTML(hero, laneKey, laneTitle) {
        const src = (FOLDERS[laneKey] || "") + hero.file;
        const tagText = laneTitle.replace(" линия", "");
        return `
          <div class="hero-card" data-hero="${escapeHtml(hero.name)}" data-lane="${escapeHtml(laneTitle)}">
            <img src="${src}" alt="${escapeHtml(hero.name)}">
            <div class="hero-overlay"></div>
            <div class="hero-tag">${escapeHtml(tagText)}</div>
            <p class="hero-name">${escapeHtml(hero.name)}</p>
          </div>
        `;
      }

      function laneSectionHTML(lane, index) {
        const dirClass = lane.direction === "left" ? "to-left" : "to-right";

        // Дублируем список, чтобы анимация -50% работала бесконечно
        const doubled = lane.heroes.concat(lane.heroes);

        const cards = doubled.map(h => heroCardHTML(h, lane.key, lane.title)).join("");

        return `
          <section class="lane">
            <div class="lane-title">
              <h2>${escapeHtml(lane.title)}</h2>
              <span class="hint">движение ${lane.direction === "left" ? "влево" : "вправо"}</span>
            </div>

            <div class="ticker ${dirClass}">
              <div class="track" style="--speed:${lane.speed || 32}s;">
                ${cards}
              </div>
            </div>
          </section>
        `;
      }

      root.innerHTML = LANES.map(laneSectionHTML).join("");

      // Клик по герою (пока заглушка)
      document.addEventListener("click", (e) => {
        const card = e.target.closest(".hero-card");
        if (!card) return;

        const hero = card.dataset.hero || "Герой";
        const lane = card.dataset.lane || "";
        alert(`Гайд по герою: ${hero}\nЛиния: ${lane}`);
        // Потом можно заменить на переход:
        // window.location.href = `hero.html?name=${encodeURIComponent(hero)}`;
      });
