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

AFRAME.registerComponent('thick-raycaster', {
  schema: {
    objects: { type: 'string', default: '' }, // selector for targets, e.g. '.collidable'
    radius: { type: 'number', default: 0.05 }, // beam radius in meters
    far: { type: 'number', default: 10 },
    interval: { type: 'number', default: 0 } // ms between checks; 0 = every frame
  },

  init: function () {
    this._lastCheck = 0;
    this._intersected = [];
    this.rayOrigin = new THREE.Vector3();
    this.rayDir = new THREE.Vector3(0, 0, -1);
    this.ray = new THREE.Ray();
    this.tmpVec = new THREE.Vector3();
    this.targets = [];
    this.updateTargets();
  },

  updateTargets: function () {
    if (!this.data.objects) {
      this.targets = [];
      return;
    }
    this.targets = Array.from(document.querySelectorAll(this.data.objects))
      .map(el => el.object3D).filter(o => o);
  },

  tick: function (time, dt) {
    if (this.data.interval > 0) {
      if (time - this._lastCheck < this.data.interval) return;
      this._lastCheck = time;
    }

    this.el.object3D.getWorldPosition(this.rayOrigin);
    this.tmpVec.set(0, 0, -1).applyQuaternion(this.el.object3D.getWorldQuaternion(new THREE.Quaternion()));
    this.ray.set(this.rayOrigin, this.tmpVec);

    const hits = [];
    const far = this.data.far;
    const beamR = this.data.radius;

    for (let obj3D of this.targets) {
      let mesh = obj3D;
      // if group, try to find first mesh child
      if (!mesh.geometry && mesh.children.length) {
        mesh = mesh.children.find(c => c.geometry) || mesh;
      }
      if (!mesh.geometry) continue;
      if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere();
      const center = mesh.geometry.boundingSphere.center.clone().applyMatrix4(mesh.matrixWorld);
      const objRadius = mesh.geometry.boundingSphere.radius * mesh.scale.x; // approximate
      const distToRay = this.ray.distanceToPoint(center);
      const v = center.clone().sub(this.rayOrigin);
      const proj = v.dot(this.ray.direction);
      if (proj < 0 || proj > far) continue; // out of range
      if (distToRay <= (beamR + objRadius)) {
        hits.push({
          distance: proj,
          point: this.ray.at(proj, new THREE.Vector3()).clone(),
          object: obj3D.el || obj3D // keep reference to element if available
        });
      }
    }

    hits.sort((a, b) => a.distance - b.distance);
    if (hits.length) {
      this.el.emit('raycaster-intersection', { intersections: hits }, false);
      this._intersected = hits;
    } else if (this._intersected.length) {
      this.el.emit('raycaster-intersection-cleared', {});
      this._intersected = [];
    }
  },

  update: function (oldData) {
    if (oldData.objects !== this.data.objects) this.updateTargets();
  }

});


AFRAME.registerComponent('random-fly', {
    schema: {
    width: { type: 'number', default: 6 },          // X span (meters)
    depth: { type: 'number', default: 6 },          // Z span (meters)
    height: { type: 'number', default: 3 },         // Y span (meters)
    baseSpeed: { type: 'number', default: 1.2 },    // baseline horizontal speed (m/s)
    accel: { type: 'number', default: 3.0 },        // acceleration toward target (m/s^2)
    gravity: { type: 'number', default: 2.5 },      // gravity-like downward accel (m/s^2)
    ascendSlow: { type: 'number', default: 0.5 },   // fraction to slow when ascending (0..1)
    descendBoost: { type: 'number', default: 0.3 }, // extra speed fraction when descending
    changeInterval: { type: 'number', default: 2000 } // ms between picking new targets
    },
    init: function () {
    // Bounds centered on origin; flyer will orbit within these extents around scene origin
    this.halfW = this.data.width / 2;
    this.halfD = this.data.depth / 2;
    this.maxY = this.data.height;
    this.minY = 0;

    // State
    this.velocity = new THREE.Vector3(); // current velocity in world space
    this.target = new THREE.Vector3();   // current target position in world space
    this.tempVec = new THREE.Vector3();
    this.lastChange = 0;
    this.el.object3D.getWorldPosition(this.tempVec);
    // Initialize position if not set
    if (!this.el.getAttribute('position')) {
        this.el.setAttribute('position', `${0} ${1.2} ${0}`);
    }
    // Pick initial random target
    this._pickNewTarget();

    // Small random initial velocity
    this.velocity.set((Math.random()-0.5)*0.4, (Math.random()-0.5)*0.2, (Math.random()-0.5)*0.4);
    },
    _pickNewTarget: function () {
    // Choose a random point inside the box bounds relative to world origin
    const x = (Math.random() * this.data.width) - this.halfW;
    const z = (Math.random() * this.data.depth) - this.halfD;
    const y = this.minY + Math.random() * (this.maxY - this.minY);
    this.target.set(x, y, z);
    this.lastChange = performance.now();
    },
    tick: function (time, delta) {
    const dt = Math.min(delta, 50) / 1000; // seconds, clamp dt for stability
    if (dt <= 0) return;

    // Occasionally pick a new target if close or interval passed
    const worldPos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(worldPos);
    const toTarget = this.target.clone().sub(worldPos);
    const distToTarget = toTarget.length();
    if (distToTarget < 0.35 || (performance.now() - this.lastChange) > this.data.changeInterval) {
        this._pickNewTarget();
    }

    // Compute desired acceleration toward target (simple steering)
    const desiredDir = this.target.clone().sub(worldPos).normalize();
    const accelVec = desiredDir.multiplyScalar(this.data.accel);

    // Gravity-like downward acceleration
    const gravityVec = new THREE.Vector3(0, -this.data.gravity, 0);

    // Combine accelerations
    const totalAccel = accelVec.add(gravityVec);

    // Update velocity: v = v + a * dt
    this.velocity.addScaledVector(totalAccel, dt);

    // Apply speed modulation based on vertical motion to mimic gravity effect:
    // When ascending (vy > 0) reduce horizontal speed; when descending (vy < 0) boost it.
    const vy = this.velocity.y;
    // Compute horizontal speed factor
    let horizFactor = 1.0;
    if (vy > 0.001) {
        // ascending: slow down proportionally to ascendSlow
        horizFactor = 1.0 - this.data.ascendSlow * Math.min(1, vy / 2.0);
    } else if (vy < -0.001) {
        // descending: speed up proportionally to descendBoost
        horizFactor = 1.0 + this.data.descendBoost * Math.min(1, -vy / 2.0);
    }
    // Apply horizontal factor to x and z components of velocity
    this.velocity.x *= horizFactor;
    this.velocity.z *= horizFactor;

    // Limit overall horizontal speed to a reasonable cap based on baseSpeed
    const horizSpeed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);
    const maxHoriz = Math.max(0.2, this.data.baseSpeed * 1.8);
    if (horizSpeed > maxHoriz) {
        const scale = maxHoriz / horizSpeed;
        this.velocity.x *= scale;
        this.velocity.z *= scale;
    }

    // Integrate position: p = p + v * dt
    const newPos = worldPos.clone().addScaledVector(this.velocity, dt);

    // Boundary handling: keep inside the box; bounce with damping
    // X bounds
    if (newPos.x < -this.halfW) {
        newPos.x = -this.halfW;
        this.velocity.x *= -0.6;
    } else if (newPos.x > this.halfW) {
        newPos.x = this.halfW;
        this.velocity.x *= -0.6;
    }
    // Z bounds
    if (newPos.z < -this.halfD) {
        newPos.z = -this.halfD;
        this.velocity.z *= -0.6;
    } else if (newPos.z > this.halfD) {
        newPos.z = this.halfD;
        this.velocity.z *= -0.6;
    }
    // Y bounds
    if (newPos.y < this.minY) {
        newPos.y = this.minY;
        this.velocity.y *= -0.45; // bounce and lose energy
        // small random upward kick so it doesn't stick to floor
        this.velocity.y += 0.6 + Math.random() * 0.6;
    } else if (newPos.y > this.maxY) {
        newPos.y = this.maxY;
        this.velocity.y *= -0.5;
    }

    // Apply a small damping to velocity to avoid runaway
    this.velocity.multiplyScalar(0.995);

    // Set world position; convert to local if parent exists
    const finalPos = newPos;
    if (this.el.parentEl && this.el.parentEl.object3D) {
        this.el.parentEl.object3D.worldToLocal(finalPos);
    }
    this.el.setAttribute('position', `${finalPos.x} ${finalPos.y} ${finalPos.z}`);

    // Optional: make the entity face its velocity direction for visual feedback
    const velDir = this.velocity.clone();
    if (velDir.lengthSq() > 0.0001) {
        // compute lookAt target slightly ahead along velocity
        const lookTarget = newPos.clone().add(velDir.clone().normalize().multiplyScalar(0.5));
        if (this.el.parentEl && this.el.parentEl.object3D) {
        this.el.parentEl.object3D.worldToLocal(lookTarget);
        }
        this.el.object3D.lookAt(lookTarget);
        // Add a small tilt based on vertical velocity for liveliness
        const currentRot = this.el.getAttribute('rotation') || { x: 0, y: 0, z: 0 };
        const roll = THREE.MathUtils.clamp(-this.velocity.y * 6, -12, 12);
        this.el.setAttribute('rotation', `${currentRot.x} ${currentRot.y} ${roll}`);
    }
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