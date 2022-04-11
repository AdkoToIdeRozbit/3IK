import { Mesh as t, ConeGeometry as i, MeshBasicMaterial as e, LineLoop as n, Vector3 as s, Group as a, BufferGeometry as o, Float32BufferAttribute as h, OctahedronBufferGeometry as r, DoubleSide as l, PlaneGeometry as c, Quaternion as d, MathUtils as p, Raycaster as u, Vector2 as m, Plane as v, PlaneHelper as P, Object3D as g } from "https://threejs.org/build/three.module.js"; var b; !function (t) { t[t.ACTIVE = .75] = "ACTIVE", t[t.INACTIVE = .3] = "INACTIVE" }(b || (b = {})); class w extends t { constructor(t) { super(), this.geometry = new i(.3, .75, 32), this.material = new e({ color: t, depthTest: !1 }), this.material.transparent = !0, this.material.opacity = 1 } } class f extends n { constructor(t, i) { super(), this.geometry = i, this.material = new e({ color: t, depthTest: !0 }), this.material.transparent = !0, this.material.opacity = 1 } } var y, S; !function (t) { t.XPT = "xpt_handle", t.YPT = "ypt_handle", t.ZPT = "zpt_handle", t.XNT = "xnt_handle", t.YNT = "ynt_handle", t.ZNT = "znt_handle", t.XR = "xr_handle", t.YR = "yr_handle", t.ZR = "zr_handle", t.ER = "er_handle", t.PICK = "pick_handle", t.PICK_PLANE_XY = "pick_plane_xy_handle", t.PICK_PLANE_YZ = "pick_plane_yz_handle", t.PICK_PLANE_ZX = "pick_plane_zx_handle" }(y || (y = {})); class R extends a { } class T extends R { constructor() { super(...arguments), this.up = new s } } class A extends R { constructor() { super(...arguments), this.up = new s } } class D extends R { } class H extends R { constructor() { super(...arguments), this.up = new s } } class E extends T { constructor(t = "#f0ff00") { super(), this.parallel = new s(0, 1, 0), this.getInteractiveObjects = () => [this.cone], this.setColor = t => { const i = this.cone.material, e = this.line.material; i.color.set(t), e.color.set(t) }, this.cone = new w(t); const i = new o; i.setAttribute("position", new h([0, 0, 0, 0, 1, 0], 3)), this.line = new f(t, i), this.cone.geometry.scale(.3, .75, .3), this.cone.translateY(1), this.add(this.cone), this.add(this.line) } } class j extends t { constructor(t) { super(), this.geometry = new r(.1, 0), this.material = new e({ color: t, depthTest: !1, transparent: !0, side: l }) } } class x extends A { constructor(t = "#f0ff00", i = 1) { super(), this.getInteractiveObjects = () => [this.handlebar], this.setColor = t => { const i = this.ring.material, e = this.handlebar.material; i.color.set(t), e.color.set(t) }; const e = new o, n = 2 * Math.PI / 64, s = []; for (let t = 1; t < 65; t++)s.push(i * Math.cos(t * n), i * Math.sin(t * n), 0); e.setAttribute("position", new h(s, 3)), this.ring = new f(t, e), this.handlebar = new j(t), this.handlebar.position.y = i, this.add(this.ring), this.add(this.handlebar) } } class I extends D { constructor() { super(), this.getInteractiveObjects = () => [this.octahedron], this.setColor = t => { this.octahedron.material.color.set(t) }, this.octahedron = new j("white"), this.add(this.octahedron) } } class X extends t { constructor(t = "#f0ff00", i = .75, n = .75) { super(), this.geometry = new c(i, n, 32), this.material = new e({ color: t, depthTest: !1, side: l, transparent: !0 }), this.material.opacity = b.INACTIVE } } class _ extends H { constructor(t = "#f0ff00", i = .75, e = .75) { super(), this.getInteractiveObjects = () => [this.plane], this.setColor = t => { const i = this.plane.material, e = this.boundary.material; i.color.set(t), e.color.set(t) }; const n = new o, s = new o, a = new o, r = i / 2, l = e / 2; n.setAttribute("position", new h([r, l, 0, r, -l, 0, -r, -l, 0, -r, l, 0], 3)), s.setAttribute("position", new h([0, l, 0, 0, -l, 0], 3)), a.setAttribute("position", new h([-r, 0, 0, r, 0, 0], 3)), this.boundary = new f(t, n), this.crossX = new f("black", s), this.crossY = new f("black", a), this.plane = new X(t, i, e), this.add(this.plane), this.add(this.boundary), this.add(this.crossX), this.add(this.crossY) } } class Y extends x { constructor(t = "#f0ff00", i = 1) { super(t, i), this.camera = null, this.controlsWorldOrientation = new d, this._temp1 = new s, this._temp2 = new s, this._temp3 = new d, this.worldPosition = new s } updateMatrixWorld(t) { var i; null !== this.camera && (null === (i = this.parent) || void 0 === i || i.matrixWorld.decompose(this._temp1, this.controlsWorldOrientation, this._temp2), this.matrixWorld.decompose(this.worldPosition, this._temp3, this._temp2), this.camera.getWorldQuaternion(this.quaternion).premultiply(this.controlsWorldOrientation.invert()), this.camera.getWorldPosition(this.up).sub(this.worldPosition)), super.updateMatrixWorld(t) } } !function (t) { t.FIXED = "fixed", t.INHERIT = "inherit" }(S || (S = {})); class C extends a { constructor(t, i, e) { var n, a, o, h, r, l, c, u, m, v, P, g, b, w, f, R, j, X, C, L, O, N, Z, k, W, M; if (super(), this.object = t, this.camera = i, this.handleTargetQuaternion = new d, this.objectWorldPosition = new s, this.objectTargetPosition = new s, this.objectTargetQuaternion = new d, this.objectParentWorldPosition = new s, this.objectParentWorldQuaternion = new d, this.objectParentWorldScale = new s, this.deltaPosition = new s, this.normalizedHandleParallelVectorCache = new s, this.touch1 = new s, this.touch2 = new s, this.boundingSphereRadius = 0, this.dragStartPoint = new s, this.dragIncrementalStartPoint = new s, this.handles = new Set, this.isBeingDraggedTranslation = !1, this.isBeingDraggedRotation = !1, this.dampingFactor = .8, this.initialSelfQuaternion = new d, this.minTranslationCache = new s, this.maxTranslationCache = new s, this.translationLimit = !1, this.translationAnchor = null, this.setupDefaultPickPlane = () => { this.pickPlaneXY.name = y.PICK_PLANE_XY, this.pickPlaneYZ.name = y.PICK_PLANE_YZ, this.pickPlaneZX.name = y.PICK_PLANE_ZX, this.pickPlaneYZ.up = new s(1, 0, 0), this.pickPlaneZX.up = new s(0, 1, 0), this.pickPlaneXY.up = new s(0, 0, 1), this.pickPlaneYZ.rotateY(Math.PI / 2), this.pickPlaneZX.rotateX(Math.PI / 2), this.setupHandle(this.pickPlaneXY), this.setupHandle(this.pickPlaneYZ), this.setupHandle(this.pickPlaneZX) }, this.setupHandle = t => { this.handles.add(t), this.add(t) }, this.setupDefaultPick = () => { this.pick.name = y.PICK, this.setupHandle(this.pick) }, this.setupDefaultEyeRotation = () => { this.rotationEye.name = y.ER, this.rotationEye.camera = this.camera, this.setupHandle(this.rotationEye) }, this.setupDefaultTranslation = () => { this.translationXP.name = y.XPT, this.translationYP.name = y.YPT, this.translationZP.name = y.ZPT, this.translationXN.name = y.XNT, this.translationYN.name = y.YNT, this.translationZN.name = y.ZNT, this.translationXP.translateX(this.boundingSphereRadius * this.translationDistanceScale), this.translationYP.translateY(this.boundingSphereRadius * this.translationDistanceScale), this.translationZP.translateZ(this.boundingSphereRadius * this.translationDistanceScale), this.translationXN.translateX(-this.boundingSphereRadius * this.translationDistanceScale), this.translationYN.translateY(-this.boundingSphereRadius * this.translationDistanceScale), this.translationZN.translateZ(-this.boundingSphereRadius * this.translationDistanceScale), this.translationXP.rotateZ(-Math.PI / 2), this.translationZP.rotateX(Math.PI / 2), this.translationXN.rotateZ(Math.PI / 2), this.translationYN.rotateX(Math.PI), this.translationZN.rotateX(-Math.PI / 2), this.translationXP.up = new s(0, 1, 0), this.translationYP.up = new s(0, 0, 1), this.translationZP.up = new s(0, 1, 0), this.translationXN.up = new s(0, -1, 0), this.translationYN.up = new s(0, 0, -1), this.translationZN.up = new s(0, -1, 0), this.translationXP.parallel = new s(1, 0, 0), this.translationYP.parallel = new s(0, 1, 0), this.translationZP.parallel = new s(0, 0, 1), this.translationXN.parallel = new s(-1, 0, 0), this.translationYN.parallel = new s(0, -1, 0), this.translationZN.parallel = new s(0, 0, -1), this.setupHandle(this.translationXP), this.setupHandle(this.translationYP), this.setupHandle(this.translationZP), this.setupHandle(this.translationXN), this.setupHandle(this.translationYN), this.setupHandle(this.translationZN) }, this.setupDefaultRotation = () => { this.rotationX.name = y.XR, this.rotationY.name = y.YR, this.rotationZ.name = y.ZR, this.rotationX.up = new s(1, 0, 0), this.rotationY.up = new s(0, 1, 0), this.rotationZ.up = new s(0, 0, 1), this.rotationY.rotateX(Math.PI / 2), this.rotationX.rotateY(Math.PI / 2), this.rotationX.rotateZ(Math.PI), this.setupHandle(this.rotationX), this.setupHandle(this.rotationY), this.setupHandle(this.rotationZ) }, this.computeObjectBounds = () => { var t; if (this.useComputedBounds) { if ("Mesh" === this.object.type) { const i = this.object.geometry; i.computeBoundingSphere(); const { boundingSphere: e } = i, n = null !== (t = null == e ? void 0 : e.radius) && void 0 !== t ? t : 0; return void (this.boundingSphereRadius = n / 2 + this.separation) } console.warn(`Bounds can only be computed for object of type THREE.Mesh,\n          received object with type: ${this.object.type}. Falling back to using\n          default separation.\n        `) } this.boundingSphereRadius = this.separation }, this.setTranslationLimit = t => { this.translationLimit = t, this.translationAnchor = t ? this.position.clone() : null }, this.processDragStart = t => { const { point: i, handle: e } = t; this.dragStartPoint.copy(i), this.dragIncrementalStartPoint.copy(i), this.isBeingDraggedTranslation = e instanceof T || e instanceof D || e instanceof H, this.isBeingDraggedRotation = e instanceof A }, this.processDragEnd = t => { const { handle: i } = t, { x: e, y: n, z: s } = this.snapTranslation, a = [e, n, s]; if (i instanceof T || i instanceof H || i instanceof D) { const t = this.object.position.toArray(), i = t.map(Math.floor), e = t.map(Math.ceil), n = t.map(((t, n) => e[n] - t >= t - i[n])), s = t.map(((t, s) => a[s] ? n[s] ? i[s] : e[s] : t)); this.object.position.fromArray(s) } this.isBeingDraggedTranslation = !1, this.isBeingDraggedRotation = !1 }, this.setDampingFactor = (t = 0) => this.dampingFactor = p.clamp(t, 0, 1), this.processDrag = t => { const { point: i, handle: e, dragRatio: n = 1 } = t, s = Math.exp(-this.dampingFactor * Math.abs(Math.pow(n, 3))); if (e instanceof T) { this.deltaPosition.copy(i).sub(this.dragIncrementalStartPoint), this.normalizedHandleParallelVectorCache.copy(e.parallel.normalize()).applyQuaternion(this.quaternion); const t = this.deltaPosition.dot(this.normalizedHandleParallelVectorCache); this.deltaPosition.copy(this.normalizedHandleParallelVectorCache).multiplyScalar(this.isDampingEnabled ? s * t : t), this.position.copy(this.getLimitedTranslation(this.deltaPosition)) } else e instanceof D || e instanceof H ? (this.deltaPosition.copy(i).sub(this.dragIncrementalStartPoint).multiplyScalar(this.isDampingEnabled ? s : 1), this.position.copy(this.getLimitedTranslation(this.deltaPosition))) : (this.touch1.copy(this.dragIncrementalStartPoint).sub(this.objectWorldPosition).normalize(), this.touch2.copy(i).sub(this.objectWorldPosition).normalize(), this.handleTargetQuaternion.setFromUnitVectors(this.touch1, this.touch2), this.mode === S.FIXED && this.detachHandleUpdateQuaternionAttach(e, this.handleTargetQuaternion)); this.objectTargetQuaternion.premultiply(this.handleTargetQuaternion), this.dragIncrementalStartPoint.copy(i) }, this.getLimitedTranslation = t => { const i = t.add(this.position); if (!this.translationAnchor || !this.translationLimit) return i; const { x: e, y: n, z: s } = this.translationLimit, { x: a, y: o, z: h } = this.translationAnchor, { x: r, y: l, z: c } = i; return this.minTranslationCache.set(e ? a + e[0] : r, n ? o + n[0] : l, s ? h + s[0] : c), this.maxTranslationCache.set(e ? a + e[1] : r, n ? o + n[1] : l, s ? h + s[1] : c), i.clamp(this.minTranslationCache, this.maxTranslationCache) }, this.detachObjectUpdatePositionAttach = (t, i) => { if (null !== t && null !== this.parent && null !== this.parent.parent) { const e = this.parent.parent; if ("Scene" !== e.type) throw new Error("freeform controls must be attached to the scene"); e.attach(i), i.position.copy(this.objectTargetPosition), t.attach(i) } }, this.detachHandleUpdateQuaternionAttach = (t, i) => { if (null !== this.parent && this.parent.parent) { const e = this.parent.parent; if ("Scene" !== e.type) throw new Error("freeform controls must be attached to the scene"); e.attach(t), t.applyQuaternion(i), this.attach(t) } }, this.showByNames = (t, i = !0) => { const e = {}; this.handles.forEach((t => { e[t.name] = t })), t.map((t => { const n = e[t]; if (void 0 === n) throw new Error(`handle: ${t} not found`); n.visible = i })) }, this.showAll = (t = !0) => { this.handles.forEach((i => { i.visible = t })) }, this.updateMatrixWorld = t => { this.object.updateMatrixWorld(t), this.object.getWorldPosition(this.objectWorldPosition); const i = this.object.parent; null !== i && i.matrixWorld.decompose(this.objectParentWorldPosition, this.objectParentWorldQuaternion, this.objectParentWorldScale), this.objectParentWorldQuaternion.invert(), this.objectTargetPosition.copy(this.position), this.objectTargetQuaternion.premultiply(this.objectParentWorldQuaternion), this.isBeingDraggedTranslation ? this.detachObjectUpdatePositionAttach(i, this.object) : this.isBeingDraggedRotation ? (this.object.quaternion.copy(this.objectTargetQuaternion), this.detachObjectUpdatePositionAttach(i, this.object)) : this.position.copy(this.objectWorldPosition), this.object.getWorldQuaternion(this.objectTargetQuaternion), this.mode !== S.INHERIT || this.isBeingDraggedTranslation || this.quaternion.copy(this.initialSelfQuaternion).premultiply(this.objectTargetQuaternion), super.updateMatrixWorld(t) }, this.options = e || {}, this.mode = null !== (a = null === (n = this.options) || void 0 === n ? void 0 : n.mode) && void 0 !== a ? a : S.FIXED, this.hideOtherHandlesOnDrag = null === (h = null === (o = this.options) || void 0 === o ? void 0 : o.hideOtherHandlesOnDrag) || void 0 === h || h, this.hideOtherControlsInstancesOnDrag = null === (l = null === (r = this.options) || void 0 === r ? void 0 : r.hideOtherControlsInstancesOnDrag) || void 0 === l || l, this.showHelperPlane = null !== (u = null === (c = this.options) || void 0 === c ? void 0 : c.showHelperPlane) && void 0 !== u && u, this.highlightAxis = null === (v = null === (m = this.options) || void 0 === m ? void 0 : m.highlightAxis) || void 0 === v || v, this.useComputedBounds = null !== (g = null === (P = this.options) || void 0 === P ? void 0 : P.useComputedBounds) && void 0 !== g && g, this.snapTranslation = null !== (w = null === (b = this.options) || void 0 === b ? void 0 : b.snapTranslation) && void 0 !== w ? w : { x: !1, y: !1, z: !1 }, this.separation = null !== (R = null === (f = this.options) || void 0 === f ? void 0 : f.separation) && void 0 !== R ? R : 1, this.isDampingEnabled = null === (X = null === (j = this.options) || void 0 === j ? void 0 : j.isDampingEnabled) || void 0 === X || X, this.rotationRadiusScale = null !== (L = null === (C = this.options) || void 0 === C ? void 0 : C.rotationRadiusScale) && void 0 !== L ? L : 1, this.eyeRotationRadiusScale = null !== (N = null === (O = this.options) || void 0 === O ? void 0 : O.eyeRotationRadiusScale) && void 0 !== N ? N : 1.25, this.pickPlaneSizeScale = null !== (k = null === (Z = this.options) || void 0 === Z ? void 0 : Z.pickPlaneSizeScale) && void 0 !== k ? k : .75, this.translationDistanceScale = null !== (M = null === (W = this.options) || void 0 === W ? void 0 : W.translationDistanceScale) && void 0 !== M ? M : 1, void 0 !== this.options.orientation) { const { x: t, y: i, z: e, w: n } = this.options.orientation; this.initialSelfQuaternion.set(t, i, e, n).normalize(), this.quaternion.copy(this.initialSelfQuaternion) } this.computeObjectBounds(), this.pick = new I, this.pickPlaneXY = new _("yellow", this.boundingSphereRadius * this.pickPlaneSizeScale, this.boundingSphereRadius * this.pickPlaneSizeScale), this.pickPlaneYZ = new _("cyan", this.boundingSphereRadius * this.pickPlaneSizeScale, this.boundingSphereRadius * this.pickPlaneSizeScale), this.pickPlaneZX = new _("pink", this.boundingSphereRadius * this.pickPlaneSizeScale, this.boundingSphereRadius * this.pickPlaneSizeScale), this.translationXP = new E("red"), this.translationYP = new E("green"), this.translationZP = new E("blue"), this.translationXN = new E("red"), this.translationYN = new E("green"), this.translationZN = new E("blue"), this.rotationX = new x("red", this.boundingSphereRadius * this.rotationRadiusScale), this.rotationY = new x("green", this.boundingSphereRadius * this.rotationRadiusScale), this.rotationZ = new x("blue", this.boundingSphereRadius * this.rotationRadiusScale), this.rotationEye = new Y("yellow", this.boundingSphereRadius * this.eyeRotationRadiusScale), this.setupDefaultTranslation(), this.setupDefaultRotation(), this.setupDefaultEyeRotation(), this.setupDefaultPickPlane(), this.setupDefaultPick() } getInteractiveObjects() { const t = []; return this.handles.forEach((i => { i.visible && t.push(...i.getInteractiveObjects()) })), t } } var L, O, N = (L = function (t) { (t.exports = function () { this.events = {} }).prototype = { emit: function (t) { var i = [].slice.call(arguments, 1);[].slice.call(this.events[t] || []).filter((function (t) { t.apply(null, i) })) }, on: function (t, i) { return (this.events[t] = this.events[t] || []).push(i), function () { this.events[t] = this.events[t].filter((function (t) { return t !== i })) }.bind(this) } } }, L(O = { exports: {} }, O.exports), O.exports); var Z = function (t) { t.events = {} }; const k = new N, W = t => { let i = 0, e = 0; if (t instanceof MouseEvent) i = t.clientX, e = t.clientY; else if (t instanceof TouchEvent) { if (0 === t.touches.length) return null; i = t.touches[0].clientX, e = t.touches[0].clientY } return { clientX: i, clientY: e } }, M = (t, i, e, n = !1) => { i.forEach((i => { t.addEventListener(i, e, n) })) }, Q = (t, i, e, n = !1) => { i.forEach((i => { t.removeEventListener(i, e, n) })) }; var z; !function (t) { t.DRAG_START = "DRAG_START", t.DRAG = "DRAG", t.DRAG_STOP = "DRAG_STOP" }(z || (z = {})); class G extends u { constructor(t, i, e) { super(), this.camera = t, this.domElement = i, this.controls = e, this.mouse = new m, this.cameraPosition = new s, this.activeHandle = null, this.activePlane = null, this.point = new s, this.normal = new s, this.visibleHandles = [], this.visibleControls = [], this.helperPlane = null, this.controlsWorldQuaternion = new d, this.clientDiagonalLength = 1, this.previousScreenPoint = new m, this.currentScreenPoint = new m, this.isActivePlaneFlipped = !1, this.createAxisLine = () => { const t = new o; return t.setAttribute("position", new h([0, 0, -100, 0, 0, 100], 3)), new f("white", t) }, this.pointerDownListener = t => { var i; const e = W(t); if (!e) return; const { clientX: n, clientY: a } = e; this.setRayDirection(n, a), this.clientDiagonalLength = Math.sqrt(Math.pow(t.target.clientWidth, 2) + Math.pow(t.target.clientHeight, 2)), this.previousScreenPoint.set(n, a); const o = []; if (Object.values(this.controls).map((t => { o.push(...t.getInteractiveObjects()) })), this.activeHandle = this.resolveHandleGroup(this.intersectObjects(o, !0)[0]), null === (i = this.activeHandle) || void 0 === i ? void 0 : i.parent) { const t = this.activeHandle.parent; t.hideOtherControlsInstancesOnDrag && (Object.values(this.controls).forEach((t => { t.visible && this.visibleControls.push(t), t.visible = !1 })), t.visible = !0), t.hideOtherHandlesOnDrag && (t.children.map((t => { t.visible && this.visibleHandles.push(t), t.visible = !1 })), this.activeHandle.visible = !0), this.activeHandle instanceof _ && this.setPickPlaneOpacity(b.ACTIVE), this.activePlane = new v; const i = this.getEyePlaneNormal(this.activeHandle); if (t.getWorldQuaternion(this.controlsWorldQuaternion), this.normal.copy(this.activeHandle instanceof D ? i : this.activeHandle.up), this.activeHandle instanceof Y || this.activeHandle instanceof D || this.normal.applyQuaternion(this.controlsWorldQuaternion), this.activeHandle instanceof T) { const t = i.dot(this.normal) / i.length(); this.isActivePlaneFlipped = Math.abs(t) < .25, this.isActivePlaneFlipped && (this.isActivePlaneFlipped = !0, this.normal.applyAxisAngle(this.activeHandle.parallel, Math.PI / 2)) } this.activeHandle instanceof T ? this.activePlane.setFromNormalAndCoplanarPoint(this.normal, this.activeHandle.position) : this.activePlane.setFromNormalAndCoplanarPoint(this.normal, t.position); const e = new s; this.activeHandle instanceof D ? this.activeHandle.getWorldPosition(e) : this.ray.intersectPlane(this.activePlane, e); const n = t.parent; if (!t.showHelperPlane || !(this.activeHandle instanceof T || this.activeHandle instanceof A) || this.activeHandle instanceof Y || (this.helperPlane = new P(this.activePlane, 1), n.add(this.helperPlane)), t.highlightAxis && (this.activeHandle instanceof T || this.activeHandle instanceof A) && !(this.activeHandle instanceof Y)) { this.activeHandle.getWorldPosition(this.highlightAxisLine.position); const t = this.highlightAxisLine.position.clone(); this.activeHandle instanceof T ? t.add(this.activeHandle.parallel) : t.add(this.activeHandle.up), this.highlightAxisLine.lookAt(t), n.add(this.highlightAxisLine) } Q(this.domElement, ["pointerdown", "touchstart"], this.pointerDownListener, { capture: !0 }), k.emit(z.DRAG_START, { point: e, handle: this.activeHandle }), M(this.domElement, ["pointermove", "touchmove"], this.pointerMoveListener, { passive: !1, capture: !0 }) } else this.activePlane = null }, this.getEyePlaneNormal = t => (this.cameraPosition.copy(this.camera.position), this.cameraPosition.sub(t.position)), this.setRayDirection = (t, i) => { const e = this.domElement.getBoundingClientRect(), { clientHeight: n, clientWidth: s } = this.domElement; this.mouse.x = (t - e.left) / s * 2 - 1, this.mouse.y = -(i - e.top) / n * 2 + 1, this.setFromCamera(this.mouse, this.camera) }, this.pointerMoveListener = t => { if (null === this.activeHandle || null === this.activePlane) return; const i = W(t); if (!i) return; const { clientX: e, clientY: n } = i; this.setRayDirection(e, n), this.ray.intersectPlane(this.activePlane, this.point), this.currentScreenPoint.set(e, n); const s = this.currentScreenPoint.distanceTo(this.previousScreenPoint) / (this.clientDiagonalLength || 1); k.emit(z.DRAG, { point: this.point, handle: this.activeHandle, dragRatio: s }), this.previousScreenPoint.set(e, n) }, this.pointerUpListener = () => { var t, i, e, n; Q(this.domElement, ["pointermove", "touchmove"], this.pointerMoveListener, { capture: !0 }), M(this.domElement, ["pointerdown", "touchstart"], this.pointerDownListener, { passive: !1, capture: !0 }), k.emit(z.DRAG_STOP, { point: this.point, handle: this.activeHandle }), (null === (t = this.activeHandle) || void 0 === t ? void 0 : t.parent) && this.activeHandle.parent.hideOtherControlsInstancesOnDrag && (this.visibleControls.forEach((t => { t.visible = !0 })), this.visibleControls = []), (null === (i = this.activeHandle) || void 0 === i ? void 0 : i.parent) && this.activeHandle.parent.hideOtherHandlesOnDrag && (this.visibleHandles.forEach((t => { t.visible = !0 })), this.visibleHandles = []), this.activeHandle instanceof _ && this.setPickPlaneOpacity(b.INACTIVE); const s = null === (n = null === (e = this.activeHandle) || void 0 === e ? void 0 : e.parent) || void 0 === n ? void 0 : n.parent; s && (this.helperPlane && s.remove(this.helperPlane), s.remove(this.highlightAxisLine)), this.activeHandle = null, this.activePlane = null }, this.resolveHandleGroup = t => void 0 === t ? null : t.object.parent, this.destroy = () => { this.activePlane = null, this.activeHandle = null, Q(this.domElement, ["pointerdown", "touchstart"], this.pointerDownListener, { capture: !0 }), Q(this.domElement, ["pointermove", "touchmove"], this.pointerMoveListener, { capture: !0 }), Q(this.domElement, ["pointerup", "touchend"], this.pointerUpListener, { capture: !0 }) }, this.highlightAxisLine = this.createAxisLine(), M(this.domElement, ["pointerdown", "touchstart"], this.pointerDownListener, { passive: !1, capture: !0 }), M(this.domElement, ["pointerup", "touchend"], this.pointerUpListener, { passive: !1, capture: !0 }) } setPickPlaneOpacity(t) { if (!(this.activeHandle instanceof _)) return; const i = this.activeHandle.plane.material; Array.isArray(i) ? i.map((i => { i.opacity = t, i.needsUpdate = !0 })) : (i.opacity = t, i.needsUpdate = !0) } } class B extends g { constructor(i, e) { super(), this.camera = i, this.domElement = e, this.objects = {}, this.controls = {}, this.eventListeners = { [z.DRAG_START]: [], [z.DRAG]: [], [z.DRAG_STOP]: [] }, this.listenToEvents = () => { k.on(z.DRAG_START, (({ point: t, handle: i }) => { if (null === i) return; const e = i.parent; null !== e && (e.processDragStart({ point: t, handle: i }), this.eventListeners[z.DRAG_START].map((t => { t(e.object, i.name) }))) })), k.on(z.DRAG, (({ point: t, handle: i, dragRatio: e }) => { if (null === i) return; const n = i.parent; null !== n && (n.processDrag({ point: t, handle: i, dragRatio: e }), this.eventListeners[z.DRAG].map((t => { t(n.object, i.name) }))) })), k.on(z.DRAG_STOP, (({ handle: t }) => { if (null === t) return; const i = t.parent; null !== i && (i.processDragEnd({ handle: t }), this.eventListeners[z.DRAG_STOP].map((e => { e(i.object, t.name) }))) })) }, this.anchor = (t, i) => { const e = this.addControls(t, i); return this.objects[t.id] = t, e }, this.detach = (t, i) => { if (!Object.prototype.hasOwnProperty.call(this.objects, t.id)) throw new Error("object should be attached first"); this.remove(i), this.dispose(i), delete this.objects[t.id], delete this.controls[i.id] }, this.addControls = (t, i) => { const e = new C(t, this.camera, i); return this.controls[e.id] = e, this.add(e), e }, this.listen = (t, i) => { this.eventListeners[t].push(i) }, this.removeListen = (t, i) => { const e = this.eventListeners[t].findIndex((t => t === i)); -1 !== e && this.eventListeners[t].splice(e, 1) }, this.dispose = i => { for (i instanceof t && (i.geometry.dispose(), Array.isArray(i.material) ? i.material.map((t => t.dispose())) : i.material.dispose()); i.children.length > 0;)i.children.map((t => { this.dispose(t), i.remove(t) })) }, this.destroy = () => { Z(k); const t = this.parent; null !== t && t.remove(this), this.dispose(this), Object.values(this.controls).map((t => { this.dispose(t) })), this.rayCaster.destroy(), this.objects = {}, this.controls = {}, this.eventListeners = { [z.DRAG_START]: [], [z.DRAG]: [], [z.DRAG_STOP]: [] } }, this.rayCaster = new G(this.camera, this.domElement, this.controls), this.listenToEvents() } } export { S as ANCHOR_MODE, B as ControlsManager, y as DEFAULT_HANDLE_GROUP_NAME, z as EVENTS, I as Pick, _ as PickPlane, H as PickPlaneGroup, x as Rotation, A as RotationGroup, E as Translation, T as TranslationGroup };
//# sourceMappingURL=three-freeform-controls.js.map
