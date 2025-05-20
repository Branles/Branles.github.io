window.addEventListener('DOMContentLoaded', () => {
    // ——————————————————————————————————————————
    // 1) Grab all DOM elements
    // ——————————————————————————————————————————
    const hueSlider   = document.getElementById('hueSlider');
    const shadeBoard  = document.getElementById('shadeBoard');
    const colorHex    = document.getElementById('colorHex');
    const copyBtn     = document.getElementById('copyBtn');
  
    const imgLoader   = document.getElementById('imgLoader');
    const imageCanvas = document.getElementById('imageCanvas');
    const imgColorHex = document.getElementById('imgColorHex');
    const copyImgBtn  = document.getElementById('copyImgBtn');
  
    const hueCtx   = hueSlider   .getContext('2d');
    const shadeCtx = shadeBoard  .getContext('2d');
    const imgCtx   = imageCanvas .getContext('2d');
  
    // ——————————————————————————————————————————
    // 2) Render the hue slider gradient
    // ——————————————————————————————————————————
    const hueGradient = hueCtx.createLinearGradient(0, 0, 0, hueSlider.height);
    ['red','yellow','lime','cyan','blue','magenta','red']
      .forEach((color, i, arr) => {
        hueGradient.addColorStop(i / (arr.length - 1), color);
      });
    hueCtx.fillStyle = hueGradient;
    hueCtx.fillRect(0, 0, hueSlider.width, hueSlider.height);
  
    // ——————————————————————————————————————————
    // 3) Shade-board drawing helper
    // ——————————————————————————————————————————
    function drawShadeBoard(hue) {
      // base hue fill
      shadeCtx.fillStyle = hue;
      shadeCtx.fillRect(0, 0, shadeBoard.width, shadeBoard.height);
  
      // white → transparent (left→right)
      const whiteGrad = shadeCtx.createLinearGradient(0, 0, shadeBoard.width, 0);
      whiteGrad.addColorStop(0, '#fff');
      whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');
      shadeCtx.fillStyle = whiteGrad;
      shadeCtx.fillRect(0, 0, shadeBoard.width, shadeBoard.height);
  
      // transparent → black (top→bottom)
      const blackGrad = shadeCtx.createLinearGradient(0, 0, 0, shadeBoard.height);
      blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
      blackGrad.addColorStop(1, '#000');
      shadeCtx.fillStyle = blackGrad;
      shadeCtx.fillRect(0, 0, shadeBoard.width, shadeBoard.height);
    }
  
    // Initial shade board with red hue
    let currentHue = 'rgb(255, 0, 0)';
    drawShadeBoard(currentHue);
  
    // ——————————————————————————————————————————
    // 4) Utility to pick color & format
    // ——————————————————————————————————————————
    function pickColor(evt, ctx) {
      const {offsetX: x, offsetY: y} = evt;
      const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
      const hex = '#' + [r, g, b]
        .map(v => v.toString(16).padStart(2, '0'))
        .join('');
      const rgb = `rgb(${r}, ${g}, ${b})`;
      return { hex, rgb };
    }
  
    // ——————————————————————————————————————————
    // 5) Event listeners: Standard mode
    // ——————————————————————————————————————————
    // When user clicks on the hue slider, update currentHue & redraw shadeBoard
    hueSlider.addEventListener('click', e => {
      const {hex} = pickColor(e, hueCtx);
      currentHue = hex;
      drawShadeBoard(currentHue);
    });
  
    shadeBoard.addEventListener('click', e => {
      const {hex, rgb} = pickColor(e, shadeCtx);
      colorHex.value = hex;
    });
  
    copyBtn.addEventListener('click', () => {
      if (colorHex.value) {
        navigator.clipboard.writeText(colorHex.value)
          .then(() => alert('Copied ' + colorHex.value))
          .catch(() => alert('Copy failed'));
      }
    });
  
    // ——————————————————————————————————————————
    // 6) Event listeners: Image mode
    // ——————————————————————————————————————————
    imgLoader.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
  
      const img = new Image();
      img.onload = () => {
        // Resize canvas to image dimensions
        imageCanvas.width  = img.width;
        imageCanvas.height = img.height;
        imgCtx.drawImage(img, 0, 0);
      };
      img.src = URL.createObjectURL(file);
    });
  
    imageCanvas.addEventListener('click', e => {
      const {hex, rgb} = pickColor(e, imgCtx);
      imgColorHex.value = hex;
    });
  
    copyImgBtn.addEventListener('click', () => {
      if (imgColorHex.value) {
        navigator.clipboard.writeText(imgColorHex.value)
          .then(() => alert('Copied ' + imgColorHex.value))
          .catch(() => alert('Copy failed'));
      }
    });
  });
  