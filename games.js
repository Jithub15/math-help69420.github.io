const container = document.getElementById("search");
let linksData;
let overlay;
fetch("/html/games/links.json")
  .then((response) => response.json())
  .then((data) => createGames(data));
function createGames(data) {
  let tileCount = 0;
  for (gamesList of data.links) {
    section = document.createElement("section");
    section.className = "flex-container";
    for (game of gamesList.games) {
      const link = document.createElement("a");
      const cdn = localStorage.getItem("cdn") || 2;
      window.cdn = parseInt(cdn);
      link.href = game[window.cdn];
      console.log("CDN:", window.cdn);
      link.className = "game-link container";
      const gameTile = document.createElement("div");
      gameTile.className = "game-tile";
      const icon = document.createElement("img");
      icon.className = "game-icon";
      icon.src = game[1];
      icon.loading = "lazy";
      const title = document.createElement("h1");
      title.className = "game-title";
      title.innerHTML = game[0];
      const gameDesc = document.createElement("p");
      gameDesc.className = "game-desc";
      gameDesc.innerHTML = game[3];
      gameTile.appendChild(icon);
      gameTile.appendChild(title);
      gameTile.appendChild(gameDesc);
      link.appendChild(gameTile);
      section.appendChild(link);
      tileCount++;

      link.addEventListener("click", (event) => {
        event.preventDefault();

        const url = link.href;
        if (url.startsWith("http://") || url.startsWith("https://")) {
          // Check if there is an existing iframe and remove it along with the overlay
          const existingIframe = document.querySelector("iframe");
          if (existingIframe) {
            document.body.removeChild(overlay);
            document.body.removeChild(existingIframe.parentNode);
          }
      
          // Create the new iframe and container div
          const container = document.createElement("div");
          container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 75%;
            height: 75%;
            z-index: 10000;
          `;
          const iframe = document.createElement("iframe");
          iframe.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          `;
          iframe.src = url;
          const fullscreenButton = document.createElement("img");
          fullscreenButton.src = "/img/full.png";
          fullscreenButton.style.cssText = `
            position: absolute;
            bottom: 1px;
            right: 1px;
            width: 32px;
            height: 32px;
            z-index: 10001;
            cursor: pointer;
          `;
          const newTabButton = document.createElement("img");
          newTabButton.src = "/img/new.png";
          newTabButton.style.cssText = `
          position: absolute;
          top: 2px;
          right: 1px;
          width: 32px;
          height: 32px;
          z-index: 10001;
          cursor: pointer;
        `;
          fullscreenButton.setAttribute("title", "Fullscreen");
          newTabButton.setAttribute("title", "Open in New Tab");
          container.appendChild(iframe);
          container.appendChild(fullscreenButton);
          container.appendChild(newTabButton);
          document.body.appendChild(container);
      
          overlay = document.createElement("div");
          overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            backdrop-filter: blur(20px);
          `;
          overlay.addEventListener("click", (event) => {
            event.preventDefault();
            document.body.removeChild(overlay);
            document.body.removeChild(container);
          });
          document.body.appendChild(overlay);
          fullscreenButton.addEventListener("click", () => {
            if (container.requestFullscreen) {
              container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) { /* Safari */
              container.webkitRequestFullscreen();
            } else if (container.msRequestFullscreen) { /* IE11 */
              iframe.msRequestFullscreen();
            }
          });
          newTabButton.addEventListener("click", function () {
            window.open(iframe.src, '_blank');
          });
        } else {
          // The URL is not valid, so display an error message
          alert("Invalid URL: " + url);
        }
      });
      
    }
    const sectiontitle = document.createElement("h2");
    const sectiontitlec = document.createElement("span");
    sectiontitlec.innerHTML = gamesList.title;
    sectiontitle.appendChild(sectiontitlec);
    container.appendChild(sectiontitle);
    container.appendChild(section);
  }
  console.log("Generated " + tileCount + " game tiles.");
}
