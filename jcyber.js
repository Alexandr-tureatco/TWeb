
          fetch("./esports.html")
  .then((r) => r.text())
  .then((html) => {
    document.getElementById("matches-container").innerHTML = html;
  })
  .catch(() => {
    document.getElementById("matches-container").innerHTML =
      '<div class="d2-news-card"><p>Не удалось загрузить новости.</p></div>';
  });
