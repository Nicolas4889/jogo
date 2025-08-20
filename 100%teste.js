<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Desempacote — Tela Inicial</title>
  <style>
    :root{
      --bg: #fff8f2;
      --ink: #4a3f3a;
      --accent: #e7c8a0;
      --accent-2: #f3dfc8;
      --btn: #d8b692;
      --btn-hover: #caa57d;
      --focus: #6a4f3b;
      --shadow: 0 6px 20px rgba(0,0,0,.08);
    }

    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
      color: var(--ink);
      background: url('foto.png') no-repeat center center fixed;
      background-size: cover;
      overflow: hidden;
    }

    .frame {
      position: relative;
      height: 100%;
      display: grid;
      place-items: center;
      padding: 24px;
    }

    .panel {
      width: min(92vw, 720px);
      background: rgba(255,255,255, .75);
      backdrop-filter: blur(6px);
      border: 2px solid #e9d9c7;
      border-radius: 18px;
      box-shadow: var(--shadow);
      padding: clamp(24px, 5vw, 48px);
      text-align: center;
    }

    h1 {
      margin: 0 0 12px;
      font-size: clamp(40px, 6.5vw, 80px);
      line-height: 1;
      letter-spacing: .5px;
      text-shadow: 0 2px 0 rgba(0,0,0,.05);
    }

    .subtitle {
      margin: 0 0 28px;
      font-size: clamp(14px, 2.6vw, 18px);
      opacity: .8;
    }

    .actions {
      display: grid;
      gap: 14px;
      justify-content: center;
      grid-template-columns: repeat(2, minmax(140px, 200px));
    }

    button {
      appearance: none;
      border: 0;
      border-radius: 12px;
      padding: 14px 18px;
      font-size: 18px;
      font-weight: 600;
      color: #2f251f;
      background: var(--btn);
      cursor: pointer;
      box-shadow: 0 3px 0 rgba(0,0,0,.08), var(--shadow);
      transition: transform .06s ease, filter .15s ease, background .15s ease;
    }
    button:hover { background: var(--btn-hover); transform: translateY(-1px); }
    button:active { transform: translateY(1px) scale(.99); }
    button:focus-visible {
      outline: 3px solid var(--focus);
      outline-offset: 3px;
    }

    .sticker {
      position: absolute;
      right: clamp(8px, 4vw, 32px);
      bottom: clamp(8px, 4vw, 24px);
      width: clamp(80px, 18vw, 160px);
      opacity: .9;
      transform: rotate(-3deg);
      filter: drop-shadow(0 10px 12px rgba(0,0,0,.12));
      user-select: none;
      pointer-events: none;
    }

    dialog {
      border: 0;
      border-radius: 16px;
      padding: 0;
      width: min(92vw, 520px);
      box-shadow: var(--shadow);
      background: #fff7ef;
    }
    dialog::backdrop {
      background: rgba(0,0,0,.25);
      backdrop-filter: blur(2px);
    }
    .modal-body {
      padding: 24px 24px 8px;
    }
    .modal-title {
      margin: 0 0 8px;
      font-size: 26px;
    }
    .credits-list {
      margin: 0 0 8px;
      padding-left: 18px;
      line-height: 1.7;
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 0 16px 16px;
    }
    .linklike {
      border: 0;
      background: transparent;
      color: #5a4639;
      font-weight: 700;
      text-decoration: underline;
      cursor: pointer;
      padding: 10px 14px;
      border-radius: 10px;
    }
    .linklike:focus-visible {
      outline: 3px solid var(--focus);
      outline-offset: 3px;
    }

    .footer {
      position: absolute;
      left: 0; right: 0; bottom: 8px;
      text-align: center;
      font-size: 12px;
      opacity: .7;
      pointer-events: none;
      user-select: none;
    }

    @media (max-width: 480px) {
      .actions { grid-template-columns: 1fr; }
    }

    .falling-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10;
      overflow: hidden;
    }

    .falling-image {
      position: absolute;
      user-select: none;
      pointer-events: auto;
      cursor: grab;
    }
  </style>
</head>
<body>
  <div class="falling-container"></div>

  <div class="frame" aria-label="Tela inicial">
    <main class="panel" role="dialog" aria-labelledby="title">
      <h1 id="title">Desempacote</h1>
      <p class="subtitle" id="tagline">Organize e Desempacote</p>

      <div class="actions" role="group" aria-label="Ações principais">
        <button id="playBtn" aria-label="Jogar">Jogar</button>
        <button id="creditsBtn" aria-haspopup="dialog" aria-controls="credits">Créditos</button>
      </div>
    </main>

    <img class="sticker" src="caixa.png" alt="Caixa de mudança decorativa" />

    <div class="footer">Pressione Enter para Jogar • Esc fecha janelas</div>
  </div>

  <dialog id="credits" aria-labelledby="creditsTitle">
    <div class="modal-body">
      <h2 class="modal-title" id="creditsTitle">Créditos</h2>
      <ul class="credits-list">
        <li>Nicolas Oliveira — Desenvolvimento</li>
        <li>Davisson Cavalcante — Desenvolvimento</li>
        <li>Bruno Danton — Desenvolivmento</li>
      </ul>
    </div>
    <div class="modal-actions">
      <button class="linklike" id="closeCredits">Fechar</button>
    </div>
  </dialog>

  <script>
    // ===============================================
    // LÓGICA FUNCIONAL (PURA - NÃO INTERAGE COM O DOM)
    // ===============================================
    const imageProperties = {
      'manipulavel1.png': { size: 'clamp(40px, 9vw, 120px)', rotation: -3, speed: 1.0 },
      'manipulavel2.png': { size: 'clamp(30px, 10vw, 50px)', rotation: 5, speed: 1.0 },
      'manipulavel3.png': { size: 'clamp(45px, 10vw, 80px)', rotation: -7, speed: 1.0 },
    };

    const createRandomImageProps = (images) => {
      const randomImageSrc = images[Math.floor(Math.random() * images.length)];
      const props = imageProperties[randomImageSrc];

      return {
        src: randomImageSrc,
        size: props.size,
        rotation: props.rotation,
        opacity: Math.random() * 0.4 + 0.6,
        fallSpeed: props.speed * (Math.random() * 0.5 + 0.75)
      };
    };


    // ==================================================
    // LÓGICA DE INTERAÇÃO COM O DOM (SIDE EFFECTS)
    // ==================================================
    const playBtn = document.getElementById('playBtn');
    const creditsBtn = document.getElementById('creditsBtn');
    const creditsDlg = document.getElementById('credits');
    const closeCredits = document.getElementById('closeCredits');
    const fallingContainer = document.querySelector('.falling-container');
    const images = ['manipulavel1.png', 'manipulavel2.png', 'manipulavel3.png'];

    const maxImages = 15;
    const fallingImages = [];
    let draggedImage = null;

    const startFall = (element) => {
      const fallLoop = () => {
        const currentTop = parseFloat(element.style.top);
        const fallSpeed = parseFloat(element.dataset.fallSpeed);
        const newTop = currentTop + fallSpeed;
        element.style.top = `${newTop}px`;
        if (element.dataset.animationId) {
          requestAnimationFrame(fallLoop);
        }
      };
      element.dataset.animationId = requestAnimationFrame(fallLoop);
    };

    const stopFall = (element) => {
      if (element.dataset.animationId) {
        cancelAnimationFrame(element.dataset.animationId);
        element.dataset.animationId = '';
      }
    };
    
    const createAndAppendImage = (props) => {
      const img = document.createElement('img');
      img.src = props.src;
      img.className = 'falling-image draggable';
      img.style.width = props.size;
      img.style.height = 'auto';
      img.style.left = `${Math.random() * 100}vw`;
      img.style.top = '-150px';
      img.style.transform = `rotate(${props.rotation}deg)`;
      img.style.opacity = props.opacity;
      img.dataset.fallSpeed = props.fallSpeed;
      return img;
    };

    const recycleImage = (imgToRecycle) => {
      stopFall(imgToRecycle);
      const newProps = createRandomImageProps(images);
      imgToRecycle.src = newProps.src;
      imgToRecycle.style.width = newProps.size;
      imgToRecycle.style.opacity = newProps.opacity;
      imgToRecycle.style.left = `${Math.random() * 100}vw`;
      imgToRecycle.style.top = '-150px';
      imgToRecycle.style.transform = `rotate(${newProps.rotation}deg)`;
      imgToRecycle.dataset.fallSpeed = newProps.fallSpeed;
      startFall(imgToRecycle);
    };

    const onMouseDownOnImage = (e) => {
      draggedImage = e.currentTarget;
      draggedImage.style.cursor = 'grabbing';
      stopFall(draggedImage);
      draggedImage.style.zIndex = '100';

      const rect = draggedImage.getBoundingClientRect();
      const offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      
      const onMouseMove = (e) => {
        const parentRect = fallingContainer.getBoundingClientRect();
        const newX = e.clientX - parentRect.left - offset.x;
        const newY = e.clientY - parentRect.top - offset.y;
        draggedImage.style.left = `${newX}px`;
        draggedImage.style.top = `${newY}px`;
      };

      const onMouseUp = () => {
        draggedImage.style.cursor = 'grab';
        draggedImage.style.zIndex = '';
        startFall(draggedImage);
        draggedImage = null;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    // Inicialização das imagens
    for (let i = 0; i < 5; i++) {
      const props = createRandomImageProps(images);
      const newImage = createAndAppendImage(props);
      newImage.addEventListener('mousedown', onMouseDownOnImage);
      fallingContainer.appendChild(newImage);
      fallingImages.push(newImage);
      startFall(newImage);
    }
    
    // Loop de controle de imagens
    setInterval(() => {
      const imageToRecycle = fallingImages.find(img => img.getBoundingClientRect().top > window.innerHeight);
      if (imageToRecycle) {
        recycleImage(imageToRecycle);
      } else if (fallingImages.length < maxImages) {
        const props = createRandomImageProps(images);
        const newImage = createAndAppendImage(props);
        newImage.addEventListener('mousedown', onMouseDownOnImage);
        fallingContainer.appendChild(newImage);
        fallingImages.push(newImage);
        startFall(newImage);
      }
    }, 2000);

    // Event listeners para a interface
    playBtn.addEventListener('click', () => {
      window.location.href = 'Arrastar.html';
    });

    creditsBtn.addEventListener('click', () => creditsDlg.showModal());
    closeCredits.addEventListener('click', () => creditsDlg.close());

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !creditsDlg.open) playBtn.click();
      if (e.key === 'Escape' && creditsDlg.open) creditsDlg.close();
    });

    creditsDlg.addEventListener('click', (e) => {
      const rect = creditsDlg.getBoundingClientRect();
      const inDialog =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inDialog) creditsDlg.close();
    });
  </script>
</body>
</html>
