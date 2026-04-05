/* INFO BOX */
(function () {

    const canvas = document.getElementById('infoCanvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ADFF2F';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('LureStakeMint - Demo', 40, 70);
    ctx.strokeStyle = '#ADFF2F';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(40, 90);
    ctx.lineTo(canvas.width - 40, 90);
    ctx.stroke();
    ctx.fillStyle = '#ADFF2F';
    ctx.font = '20px sans-serif';
    const text = "This demo scene delivers a highly immersive gaming experience. Please try it only in that case if you are prepared to get scarred. Trying the game or watching its demo is entirely your responsibility. This game is made for the ETHGlobal Cannes 2026 out of scratch by one single person as a team. It's not too much, but the aliens are here to get the power of our decentralized community. Defend yourself, defend us!";
    const x = 40;
    let y = 150;
    const maxWidth = canvas.width - 80;
    const lineHeight = 28;

    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
    const dataURL = canvas.toDataURL();
    const assetImg = document.getElementById('infoCanvasTexture');
    assetImg.src = dataURL;

})();
AFRAME.registerComponent('dismiss-on-click', {
    init: function () {
    const el = this.el;
    const ok = document.querySelector('#okBox');
    ok.addEventListener('click', function (evt) {
        el.setAttribute('animation__fade', {
        property: 'scale',
        to: '0.01 0.01 0.01',
        dur: 300,
        easing: 'easeInQuad'
        });
        setTimeout(() => {
        el.setAttribute('visible', 'false');
        }, 320);
        for (const thisId of ['p_cannes', 'p_eth', 'p_ens', 'p_world', 'p_walletconnect']) {
            const element = document.getElementById(thisId);
            if (element) {
                element.setAttribute('visible', 'false');
            };
        }
        startDemo();
    });
    }
});

addEventListener('DOMContentLoaded', function () {

    const infoBox = document.getElementById('infoBox');
    infoBox.setAttribute('dismiss-on-click', '');
    const okBox = document.getElementById('okBox');
    okBox.classList.add('clickable');
    const assetImg = document.getElementById('infoCanvasTexture');
    assetImg.addEventListener('load', function () {
    const front = document.getElementById('frontCanvas');
    front.setAttribute('material', 'src', '#infoCanvasTexture');
    });

});
/* END INFO BOX */
