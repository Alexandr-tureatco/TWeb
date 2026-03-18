

      fetch("./news_fragment.html")
        .then((r) => r.text())
        .then((html) => (document.getElementById("news-container").innerHTML = html))
        .catch(() => {
          document.getElementById("news-container").innerHTML =
            '<div class="card simple-card"><p>Не удалось загрузить новости.</p></div>';
        });
