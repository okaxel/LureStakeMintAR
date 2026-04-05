class Alien {

    static Mintling = '#ADFF2F';
    static Gasoid = '#ffa107';
    static Contracteur = '#198754';
    static Droppee = '#0d6efd';
    static Vivido = '#d63384';
    static Hidee = '#6c757d';
    static Gamblet = '#ffe000';
    static Omno = '#6f42c1';


    constructor (type = null, position = null, nodeId = null) {

        this.type = type;
        switch (type) {
            case 'Mintling':
                this.skinColor = Alien.Mintling;
                break;
            case 'Gasoid':
                this.skinColor = Alien.Gasoid;
                break;
            case 'Contracteur':
                this.skinColor = Alien.Contracteur;
                break;
            case 'Droppee':
                this.skinColor = Alien.Droppee;
                break;
            case 'Vivido':
                this.skinColor = Alien.Vivido;
                break;
            case 'Hidee':
                this.skinColor = Alien.Hidee;
                break;
            case 'Gamblet':
                this.skinColor = Alien.Gamblet;
                break;
            case 'Omno':
                this.skinColor = Alien.Omno;
                break;
            case null:
                this.type = 'Unknown'
                this.skinColor = '#6fe0a6';
                break;
            default:
                this.type = 'Unknown'
                this.skinColor = type;
                break;
        }
        this.nodeId = nodeId ? nodeId : randomId();
        this.position = position ? position : { x: randomFloat(-3, 3),
                                                y: randomFloat(0, 5),
                                                z: randomFloat(-5, -1)};
        this.make();
        AppState.scene.appendChild(this.node);
        this.scale(randomFloat(0.3, 0.7));
        this.node.addEventListener('click', () => {
            AppState.scene.removeChild(this.node);
        });

    }
 
    angry() {
      animateOnce(this.body, 'material.color', '#ff0000', 300, 'easeInOutQuad', 'material.color');
      animateOnce(this.node, 'position', '0 1.25 -1', 300, 'easeInOutQuad', 'position');
      animateOnce(this.eyeLeftWhite, 'scale', '1 0.5 1', 160, 'easeInOutQuad');
      animateOnce(this.eyeRightWhite, 'scale', '1 0.5 1', 160, 'easeInOutQuad');
      animateOnce(this.pupilLeft, 'scale', '1 0.5 1', 160, 'easeInOutQuad');
      animateOnce(this.pupilRight, 'scale', '1 0.5 1', 160, 'easeInOutQuad');
      animateOnce(this.mouthTorus, 'rotation', '90 0 0', 220, 'easeInOutQuad', 'rotation');
      animateOnce(this.mouthTorus, 'scale', '1 0.12 1', 220, 'easeInOutQuad');
      setTimeout(() => {
        animateOnce(this.node, 'position', '0.03 1.25 -1', 80, 'easeInOutQuad', 'position');
        setTimeout(() => animateOnce(this.node, 'position', '-0.03 1.25 -1', 80, 'easeInOutQuad', 'position'), 90);
        setTimeout(() => animateOnce(this.node, 'position', '0 1.25 -1', 80, 'easeInOutQuad', 'position'), 180);
      }, 320);
    }


    autoBlink() {

        const randomTime = randomFloat(100, 300);
        this.blink();
        setTimeout(() => {
            this.autoBlink();
        }, randomFloat);

    }


    blink() {
      animateOnce(this.eyeLeftWhite, 'scale', '1 0.05 1', 120, 'easeInQuad');
      animateOnce(this.eyeRightWhite, 'scale', '1 0.05 1', 120, 'easeInQuad');
      animateOnce(this.pupilLeft, 'scale', '1 0.05 1', 120, 'easeInQuad');
      animateOnce(this.pupilRight, 'scale', '1 0.05 1', 120, 'easeInQuad');
      setTimeout(() => {
        animateOnce(this.eyeLeftWhite, 'scale', '1 1 1', 140, 'easeOutQuad');
        animateOnce(this.eyeRightWhite, 'scale', '1 1 1', 140, 'easeOutQuad');
        animateOnce(this.pupilLeft, 'scale', '1 1 1', 140, 'easeOutQuad');
        animateOnce(this.pupilRight, 'scale', '1 1 1', 140, 'easeOutQuad');
      }, 140);
    }

    make() {

        this.node = document.createElement('a-entity');
        this.node.setAttribute('id', this.nodeId);
        this.node.setAttribute('position', `${this.position.x} ${this.position.y} ${this.position.z}`);
        this.body = document.createElement('a-sphere');
        this.body.setAttribute('id', `${this.nodeId}_Body`);
        this.body.setAttribute('radius', 0.6);
        this.body.setAttribute('color', this.skinColor);
        this.body.setAttribute('segments-width', 32);
        this.body.setAttribute('segments-height', 32);
        this.body.setAttribute('material', 'shader: standard; roughness: 0.6');
        this.node.appendChild(this.body);
        this.eyeLeft = this.makeEye('L', -0.22);
        this.eyeRight = this.makeEye('R', 0.22);
        this.node.appendChild(this.eyeLeft);
        this.node.appendChild(this.eyeRight);
        this.mouth = document.createElement('a-entity');
        this.mouth.setAttribute('id', `${this.nodeId}_Mouth`);
        this.mouth.setAttribute('position', '0 -0.12 0.52');
        this.mouthTorus = document.createElement('a-torus');
        this.mouthTorus.setAttribute('id', `${this.nodeId}_MouthTorus`);
        this.mouthTorus.setAttribute('radius', 0.18);
        this.mouthTorus.setAttribute('radius-tubular', 0.03);
        this.mouthTorus.setAttribute('color', '#2b2b2b');
        this.mouthTorus.setAttribute('rotation', '90 0 0');
        this.mouth.appendChild(this.mouthTorus);
        this.node.appendChild(this.mouth);

    }

    makeEye(side, x) {

        const eyeGroup = document.createElement('a-entity');
        const sideId = side === 'L' ? 'eyeLeft' : 'eyeRight';
        eyeGroup.setAttribute('id', `${this.nodeId}_${sideId}`);
        eyeGroup.setAttribute('position', `${x} 0.18 0.52`);
        const white = document.createElement('a-sphere');
        white.setAttribute('id', `${this.nodeId}_${sideId}White`);
        white.setAttribute('radius', 0.12);
        white.setAttribute('color', '#fff');
        const pupil = document.createElement('a-sphere');
        pupil.setAttribute('id', `${this.nodeId}_${sideId}Pupil`);
        pupil.setAttribute('radius', 0.055);
        pupil.setAttribute('color', '#000');
        pupil.setAttribute('position', '0 0 0.08');
        eyeGroup.appendChild(white);
        eyeGroup.appendChild(pupil);
        if (side === 'L') {
            this.eyeLeftWhite = white;
            this.pupilLeft = pupil;
        } else {
            this.eyeRightWhite = white;
            this.pupilRight = pupil;
        }
        return eyeGroup;

    }

    randomFly() {
        this.node.setAttribute('random-fly', '');
    }

    scale(value) {
        this.node.setAttribute('scale', `${value} ${value} ${value}`);
    }

}

function animateOnce(el, attr, to, dur = 200, easing = 'easeInOutQuad', property = null) {

    const animId = 'anim-' + attr + '-' + Math.random().toString(36).slice(2,8);
    el.setAttribute('animation__' + animId, {
    property: property || attr,
    to: to,
    dur: dur,
    easing: easing,
    autoplay: true
    });
    setTimeout(() => el.removeAttribute('animation__' + animId), dur + 20);

}


function randomFloat(min, max) {

    return Math.random() * (max - min) + min;

}

function randomId() {

    return Math.random().toString(36).slice(2);

}

document.querySelector('a-scene').addEventListener('loaded', () => {
  let a = new Alien('Mintling');
});