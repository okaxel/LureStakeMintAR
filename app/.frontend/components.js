AFRAME.registerComponent('vr-log', {
	
	init: function()
	{
		this.text = "";
	},

	tick: function()
	{
        this.text = `LEFT : x ${UserState.left.position.x.toFixed(2)} y ${UserState.left.position.y.toFixed(2)} z ${UserState.left.position.z.toFixed(2)}\n`;
        this.text += `RIGHT : x ${UserState.right.position.x.toFixed(2)} y ${UserState.right.position.y.toFixed(2)} z ${UserState.right.position.z.toFixed(2)}\n`;
        this.text += `HEAD : x ${UserState.head.position.x.toFixed(2)} y ${UserState.head.position.y.toFixed(2)} z ${UserState.head.position.z.toFixed(2)}\n`;
        this.text += `Count of aliens : ${AppState.aliens.length}\n`;
        this.el.setAttribute( "text", "value", this.text );
	},
	
});

AFRAME.registerComponent('controller-listener', {
    schema:
    {
        hand: {type: 'string', default: 'left'},
    },
    init: function()
    {
        switch (this.data.hand) {
            case 'left':
                this.el.addEventListener('triggerdown', function(e) {
                    UserState.left.triggerPressed = true;
                    const node = document.getElementById('rayCasterLeft');
                    createRandomAlien();
                    if (node === null) return;
                    node.setAttribute('raycaster', 'lineColor', '#ffffff');
                    node.setAttribute('raycaster', 'lineOpacity', 0.9);
                    node.setAttribute('raycaster', 'showLine', true);
                });
                this.el.addEventListener('triggerup', function(e) {
                    UserState.left.triggerPressed = false;
                    const node = document.getElementById('rayCasterLeft');
                    if (node === null) return;
                    node.setAttribute('raycaster', 'lineColor', '#ff00a0');
                    node.setAttribute('raycaster', 'lineOpacity', 0.9);
                    node.setAttribute('raycaster', 'showLine', true);
                });
                this.el.addEventListener('triggertouchstart', function(e) {
                    UserState.left.triggerTouching = true;
                });
                this.el.addEventListener('triggertouchend', function(e) {
                    UserState.left.triggerTouching = false;
                });
                this.el.addEventListener('thumbstickdown', function(e) {
                    UserState.left.thumbstickPressed = true;
                });
                this.el.addEventListener('thumbstickup', function(e) {
                    UserState.left.thumbstickPressed = false;
                });
                this.el.addEventListener('thumbsticktouchstart', function(e) {
                    UserState.left.thumbstickTouching = true;
                });
                this.el.addEventListener('thumbsticktouchend', function(e) {
                    UserState.left.thumbstickTouching = false;
                });
                this.el.addEventListener('thumbstickmoved', function(e) {
                    UserState.left.thumbstickX = e.detail.x;
                    UserState.left.thumbstickY = e.detail.y;
                });
                this.el.addEventListener('gripdown', function(e) {
                    UserState.left.gripPressed = true;
                });
                this.el.addEventListener('gripup', function(e) {
                    UserState.left.gripPressed = false;
                });
                this.el.addEventListener('griptouchstart', function(e) {
                    UserState.left.gripTouching = true;
                });
                this.el.addEventListener('griptouchend', function(e) {
                    UserState.left.gripTouching = false;
                });
                this.el.addEventListener('abuttondown', function(e) {
                    UserState.left.btnAPressed = true;
                });
                this.el.addEventListener('abuttonup', function(e) {
                    UserState.left.btnAPressed = false;
                });
                this.el.addEventListener('abuttontouchstart', function(e) {
                    UserState.left.btnATouching = true;
                });
                this.el.addEventListener('abuttontouchend', function(e) {
                    UserState.left.btnATouching = false;
                });
                this.el.addEventListener('bbuttondown', function(e) {
                    UserState.left.btnBPressed = true;
                });
                this.el.addEventListener('bbuttonup', function(e) {
                    UserState.left.btnBPressed = false;
                });
                this.el.addEventListener('bbuttontouchstart', function(e) {
                    UserState.left.btnBTouching = true;
                });
                this.el.addEventListener('bbuttontouchend', function(e) {
                    UserState.left.btnBTouching = false;
                });
                this.el.addEventListener('ybuttondown', function(e) {
                    UserState.left.btnYPressed = true;
                });
                this.el.addEventListener('ybuttonup', function(e) {
                    UserState.left.btnYPressed = false;
                });
                this.el.addEventListener('ybuttontouchstart', function(e) {
                    UserState.left.btnYTouching = true;
                });
                this.el.addEventListener('ybuttontouchend', function(e) {
                    UserState.left.btnYTouching = false;
                });
                this.el.addEventListener('xbuttondown', function(e) {
                    UserState.left.btnXPressed = true;
                });
                this.el.addEventListener('xbuttonup', function(e) {
                    UserState.left.btnXPressed = false;
                });
                this.el.addEventListener('xbuttontouchstart', function(e) {
                    UserState.left.btnXTouching = true;
                });
                this.el.addEventListener('xbuttontouchend', function(e) {
                    UserState.left.btnXTouching = false;
                });
                this.el.addEventListener('surfacedown', function(e) {
                    UserState.left.surfacePressed = true;
                });
                this.el.addEventListener('surfaceup', function(e) {
                    UserState.left.surfacePressed = false;
                });
                this.el.addEventListener('surfacetouchstart', function(e) {
                    UserState.left.surfaceTouching = true;
                });
                this.el.addEventListener('surfacetouchend', function(e) {
                    UserState.left.surfaceTouching = false;
                });
                break;
            case 'right':
                this.el.addEventListener('triggerdown', function(e) {
                    UserState.right.triggerPressed = true;
                    const node = document.getElementById('rayCasterRight');
                    if (node === null) return;
                    node.setAttribute('raycaster', 'lineColor', '#ffffff');
                    node.setAttribute('raycaster', 'lineOpacity', 0.9);
                    node.setAttribute('raycaster', 'showLine', true);
                });
                this.el.addEventListener('triggerup', function(e) {
                    const node = document.getElementById('rayCasterRight');
                    if (node === null) return;
                    node.setAttribute('raycaster', 'lineColor', '#a000ff');
                    node.setAttribute('raycaster', 'lineOpacity', 0.9);
                    node.setAttribute('raycaster', 'showLine', true);
                    UserState.right.triggerPressed = false;
                });
                this.el.addEventListener('triggertouchstart', function(e) {
                    UserState.right.triggerTouching = true;
                });
                this.el.addEventListener('triggertouchend', function(e) {
                    UserState.right.triggerTouching = false;
                });
                this.el.addEventListener('thumbstickdown', function(e) {
                    UserState.right.thumbstickPressed = true;
                });
                this.el.addEventListener('thumbstickup', function(e) {
                    UserState.right.thumbstickPressed = false;
                });
                this.el.addEventListener('thumbsticktouchstart', function(e) {
                    UserState.right.thumbstickTouching = true;
                });
                this.el.addEventListener('thumbsticktouchend', function(e) {
                    UserState.right.thumbstickTouching = false;
                });
                this.el.addEventListener('thumbstickmoved', function(e) {
                    UserState.right.thumbstickX = e.detail.x;
                    UserState.right.thumbstickY = e.detail.y;
                });
                this.el.addEventListener('gripdown', function(e) {
                    UserState.right.gripPressed = true;
                });
                this.el.addEventListener('gripup', function(e) {
                    UserState.right.gripPressed = false;
                });
                this.el.addEventListener('griptouchstart', function(e) {
                    UserState.right.gripTouching = true;
                });
                this.el.addEventListener('griptouchend', function(e) {
                    UserState.right.gripTouching = false;
                });
                this.el.addEventListener('abuttondown', function(e) {
                    UserState.right.btnAPressed = true;
                });
                this.el.addEventListener('abuttonup', function(e) {
                    UserState.right.btnAPressed = false;
                });
                this.el.addEventListener('abuttontouchstart', function(e) {
                    UserState.right.btnATouching = true;
                });
                this.el.addEventListener('abuttontouchend', function(e) {
                    UserState.right.btnATouching = false;
                });
                this.el.addEventListener('bbuttondown', function(e) {
                    UserState.right.btnBPressed = true;
                });
                this.el.addEventListener('bbuttonup', function(e) {
                    UserState.right.btnBPressed = false;
                });
                this.el.addEventListener('bbuttontouchstart', function(e) {
                    UserState.right.btnBTouching = true;
                });
                this.el.addEventListener('bbuttontouchend', function(e) {
                    UserState.right.btnBTouching = false;
                });
                this.el.addEventListener('ybuttondown', function(e) {
                    UserState.right.btnYPressed = true;
                });
                this.el.addEventListener('ybuttonup', function(e) {
                    UserState.right.btnYPressed = false;
                });
                this.el.addEventListener('ybuttontouchstart', function(e) {
                    UserState.right.btnYTouching = true;
                });
                this.el.addEventListener('ybuttontouchend', function(e) {
                    UserState.right.btnYTouching = false;
                });
                this.el.addEventListener('xbuttondown', function(e) {
                    UserState.right.btnXPressed = true;
                });
                this.el.addEventListener('xbuttonup', function(e) {
                    UserState.right.btnXPressed = false;
                });
                this.el.addEventListener('xbuttontouchstart', function(e) {
                    UserState.right.btnXTouching = true;
                });
                this.el.addEventListener('xbuttontouchend', function(e) {
                    UserState.right.btnXTouching = false;
                });
                this.el.addEventListener('surfacedown', function(e) {
                    UserState.right.surfacePressed = true;
                });
                this.el.addEventListener('surfaceup', function(e) {
                    UserState.right.surfacePressed = false;
                });
                this.el.addEventListener('surfacetouchstart', function(e) {
                    UserState.right.surfaceTouching = true;
                });
                this.el.addEventListener('surfacetouchend', function(e) {
                    UserState.right.surfaceTouching = false;
                });
                break;
        }
    }
});


AFRAME.registerComponent('hover-color-change', {
    schema: {
        type: 'string', default: '#ffffff'
    },
    init: function () {
        const originalColor = this.el.getAttribute('material').color;
        this.el.addEventListener('mouseenter', function () {
            this.el.setAttribute('color', this.data);
        }.bind(this));
        this.el.addEventListener('mouseleave', function () {
            this.el.setAttribute('color', originalColor);
        }.bind(this));
    }

})

AFRAME.registerComponent('six-dimension-tracker', {
    schema: {
        tag: {type: 'string', default: 'left'},
    },
    init: function () {
        switch (this.data.tag) {
            case 'head':
                this.tickFunction = () => {
                    UserState.head.position = this.el.object3D.position;
                    UserState.head.rotation = this.el.object3D.rotation;
                }
                break;
            case 'left':
                this.tickFunction = () => {
                    UserState.left.position = this.el.object3D.position;
                    UserState.left.rotation = this.el.object3D.rotation;
                }
                break;
            case 'right':
                this.tickFunction = () => {
                    UserState.right.position = this.el.object3D.position;
                    UserState.right.rotation = this.el.object3D.rotation;
                }
                break;
            default:
                this.tickFunction = () => {
                    console.warn('Unhandled six-dimension-tracker tag: ' + this.data.tag);
                }
                break;
        }
    },
    tick: function () {
        this.tickFunction();
    }
});

/*
triggerchanged 	Trigger changed.
thumbstickchanged 	Thumbstick changed.
gripchanged 	Grip button changed.
abuttonchanged 	A button changed.
bbuttonchanged 	B button changed.
xbuttonchanged 	X button changed.
ybuttonchanged 	Y button changed.
surfacechanged 	Surface button changed.
*/