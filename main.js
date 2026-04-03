const EVENT_OPTIONS = {passive: true, capture: true, useCapture: true};

const AppState = {
    alien: null,
    initialized: false,
    isARSupported: false,
    isVRSupported: false,
    modeBtn: null,
    scene: null,
}


class ControllerState {

  constructor () {

    this.triggerTouching = false;
    this.triggerPressed = false;
    this.gripTouching = false;
    this.gripPressed = false;
    this.btnATouching = false;
    this.btnAPressed = false;
    this.btnBTouching = false;
    this.btnBPressed = false;
    this.btnXTouching = false;
    this.btnXPressed = false;
    this.btnYTouching = false;
    this.btnYPressed = false;
    this.thumbStickTouching = false;
    this.thumbStickPressed = false;
    this.thumbStickX = 0;
    this.thumbStickY = 0;
    this.SurfaceTouching = false;
    this.SurfacePressed = false;
    this.position = { x: 0, y: 0, z: 0 };
    this.rotation = { x: 0, y: 0, z: 0, w: 1 };
  }

}

class HeadState {

  constructor () {

    this.position = { x: 0, y: 0, z: 0 };
    this.rotation = { isEuler: true, _x: 0, _y: 0, _z: 0, order: 'XYZ' };

  }

}


class UserState {

  static head = new HeadState();
  static left = new ControllerState();
  static right = new ControllerState();

}

class Alien {

    constructor (position, radius, color) {

        this.position = position;
        this.radius = radius;
        this.color = color;

    }

}

async function handleModeBtnClick () {

    AppState.modeBtn.disabled = true;
    AppState.modeBtn.textContent = 'Starting...';
    setTimeout(() => {
      newAlien('0 1.88 -0.5', 0.1, '#ff0000');
      newAlien('0 1.78 -0.75', 0.1, '#ffFF00');
      newAlien('0 1.68 -1', 0.1, '#00ff00');
      newAlien('0 1.58 -1.25', 0.1, '#00ffff');
      AppState.alien = newAlien('0 1.48 -1.5', 0.1, '#0000ff');
      setTimeout(moveElement, 1000);
    }, 20000);
    try {
        if (AppState.isARSupported) {
            const session =await navigator.xr.requestSession('immersive-ar',
                { requiredFeatures: ['hit-test','local-floor'] });
            AppState.scene.renderer.xr.setSession(session);
        } else if (AppState.isVRSupported) {
            const session = await navigator.xr.requestSession('immersive-vr');
            AppState.scene.renderer.xr.setSession(session);
        }
    } catch (err) {
        console.error(err);
        AppState.modeBtn.textContent = 'Failed to start XR: ' + err.message;
    } finally {
        AppState.modeBtn.disabled = false;
    }

}

async function initPage() {

    window.removeEventListener('DOMContentLoaded', initPage);
    AppState.scene = document.querySelector('a-scene');
    AppState.modeBtn = document.getElementById('modeBtn');
    if (AppState.modeBtn == null) {
        console.error('modeBtn not found');
        return;
    }
    AppState.modeBtn.textContent = 'Initializing...';
    if (typeof navigator.xr !== 'undefined') {
        AppState.isARSupported = await navigator.xr.isSessionSupported('immersive-ar').catch(()=>false);
        AppState.isVRSupported = await navigator.xr.isSessionSupported('immersive-vr').catch(()=>false);
    }
    AppState.modeBtn.textContent = AppState.isARSupported ? 'Enter AR!' : (AppState.isVRSupported ? 'Enter VR (AR not supported)' : 'No immersive XR supported');
    // AppState.modeBtn.addEventListener('click', handleModeBtnClick, EVENT_OPTIONS);
    /*
    if (AppState.isARSupported || AppState.isVRSupported) {
        AppState.modeBtn.addEventListener('click', handleModeBtnClick, EVENT_OPTIONS);
    } else {
         AppState.modeBtn.disabled = true;
    }
    */
    AppState.initialized = true;
    setInterval(() => {LOG_CONTAINER.push(new Date().toISOString());}, 1000);

}

async function moveElement() {

    if (AppState.alien === null) return
    await moveAFrameElementTo(AppState.alien, '0.2 1.88 -0.5');
    await moveAFrameElementTo(AppState.alien, '-0.2 1.48 -0.5');
    await moveAFrameElementTo(AppState.alien, '0 0.1 -1');

}

/**
 * Animate an A-Frame element to a target position.
 *
 * @param {Element} el - The A-Frame entity (e.g., <a-entity>, <a-sphere>).
 * @param {string|Array|Object} targetPos - Target position as "x y z" string, [x,y,z], or {x,y,z}.
 * @param {number} timeFactor - Multiplier for base duration. (1 = baseDuration)
 * @param {Object} [opts] - Optional settings.
 * @param {number} [opts.baseDuration=800] - Base duration in ms before applying timeFactor.
 * @param {function} [opts.easing] - Easing function f(t) where t in [0,1]. Default easeInOutQuad.
 * @returns {Promise} Resolves when animation completes.
 */

function moveAFrameElementTo(el, targetPos, timeFactor = 1, opts = {}) {
  if (!el || !(el instanceof Element)) {
    return Promise.reject(new Error('First argument must be a DOM element'));
  }

  // Respect reduced motion preference
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const baseDuration = typeof opts.baseDuration === 'number' ? opts.baseDuration : 800;
  const duration = Math.max(0, baseDuration * (typeof timeFactor === 'number' ? timeFactor : 1));

  // Default easing
  const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  const easing = typeof opts.easing === 'function' ? opts.easing : easeInOutQuad;

  // Parse target position into THREE.Vector3-like object
  function parsePos(p) {
    if (typeof p === 'string') {
      const parts = p.trim().split(/\s+/).map(Number);
      return { x: parts[0] || 0, y: parts[1] || 0, z: parts[2] || 0 };
    }
    if (Array.isArray(p)) {
      return { x: p[0] || 0, y: p[1] || 0, z: p[2] || 0 };
    }
    if (typeof p === 'object' && p !== null) {
      return { x: p.x || 0, y: p.y || 0, z: p.z || 0 };
    }
    return { x: 0, y: 0, z: 0 };
  }

  const target = parsePos(targetPos);

  // If object3D not ready yet, wait for loaded
  function whenReady() {
    return new Promise((resolve) => {
      if (el.object3D && el.object3D.position) return resolve();
      el.addEventListener('loaded', () => resolve(), { once: true });
    });
  }

  // Cancel any previous animation on this element
  if (el._moveAFRameCancel) {
    el._moveAFRameCancel(); // call cancel function if present
    el._moveAFRameCancel = null;
  }

  return whenReady().then(() => {
    const pos = el.object3D.position;
    const start = pos.clone ? pos.clone() : { x: pos.x, y: pos.y, z: pos.z };
    const end = { x: target.x, y: target.y, z: target.z };

    // If reduced motion or zero duration, jump immediately
    if (reduceMotion || duration <= 0) {
      el.setAttribute('position', `${end.x} ${end.y} ${end.z}`);
      return Promise.resolve();
    }

    let rafId = null;
    let startTime = null;
    let cancelled = false;

    // Provide cancel function
    el._moveAFRameCancel = () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      el._moveAFRameCancel = null;
    };

    return new Promise((resolve) => {
      function step(ts) {
        if (cancelled) return resolve({ cancelled: true });
        if (!startTime) startTime = ts;
        const elapsed = ts - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = easing(t);

        // Interpolate
        const nx = start.x + (end.x - start.x) * eased;
        const ny = start.y + (end.y - start.y) * eased;
        const nz = start.z + (end.z - start.z) * eased;

        // Apply to object3D for smoothness
        if (el.object3D && el.object3D.position) {
          el.object3D.position.set(nx, ny, nz);
          // Also update A-Frame attribute so DOM reflects final values
          if (t === 1) el.setAttribute('position', `${end.x} ${end.y} ${end.z}`);
        } else {
          // Fallback to setAttribute
          el.setAttribute('position', `${nx} ${ny} ${nz}`);
        }

        if (t < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          el._moveAFRameCancel = null;
          resolve({ cancelled: false });
        }
      }

      rafId = requestAnimationFrame(step);
    });
  });
}


function newAlien(position, radius, color) {

    const alien = document.createElement('a-sphere');
    alien.setAttribute('id', randomId());
    alien.setAttribute('position', position);
    alien.setAttribute('radius', radius);
    alien.setAttribute('color', color);
    alien.setAttribute('shadow', 'cast: true; receive: true');
    AppState.scene.appendChild(alien);
    return alien;

}

function randomId() {
    return Math.random().toString(36).slice(2);
}


window.addEventListener('DOMContentLoaded', initPage);
