(function() {
    const vars = ['--c0','--c1','--c2','--c3','--c4'];
    const root = document.documentElement;
    const btn  = document.getElementById('themeBtn');
  
    // Base palette snapshot
    const base = vars.map(v =>
      getComputedStyle(root).getPropertyValue(v).trim()
    );
  
    // Icon mapping: 0 = brightest, 1 = mid, 2 = darkest
    const icons = {
      0: 'none.png',
      1: 'half.png',
      2: 'full.png',
    };
  
    // State vars
    let offset    = 0;
    let direction = 1;
    let stepCount = 0;
  
    // --- 1) Load saved state (if any) ---
    const savedOffset    = localStorage.getItem('paletteOffset');
    const savedDir       = localStorage.getItem('paletteDirection');
    const savedStepCount = localStorage.getItem('paletteStepCount');
  
    if (savedOffset !== null)    offset    = parseInt(savedOffset, 10);
    if (savedDir !== null)       direction = parseInt(savedDir, 10);
    if (savedStepCount !== null) stepCount = parseInt(savedStepCount, 10);
  
    // Apply loaded state to CSS vars and icon:
    function applyState() {
      // Colours
      vars.forEach((v,i) => {
        const idx = (i + offset + base.length) % base.length;
        root.style.setProperty(v, base[idx]);
      });
      // Icon level
      const iconLevel = Math.max(0, Math.min(2, offset));
      btn.innerHTML = `<img src="${icons[iconLevel]}" alt="">`;
    }
    applyState();
  
    // --- 2) Bounce logic + save state ---
    function bouncePalette() {
      offset    += direction;
      stepCount += 1;
      if (stepCount === 2) {
        direction = -direction;
        stepCount = 0;
      }
  
      applyState();
  
      // Save all three pieces of state
      localStorage.setItem('paletteOffset',    offset);
      localStorage.setItem('paletteDirection', direction);
      localStorage.setItem('paletteStepCount', stepCount);
    }
  
    // Wire up button
    btn.addEventListener('click', bouncePalette);
  })();
  
