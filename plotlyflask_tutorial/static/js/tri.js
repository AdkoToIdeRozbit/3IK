import * as THREE from "https://threejs.org/build/three.module.js"
import { GUI } from "./modules//dat.gui/build/dat.gui.module.js"
import { TransformControls } from "./modules/TransformControls.js"
import { OrbitControls } from "./modules/OrbitControls.js"
import { GLTFLoader } from "./modules/GLTFLoader.js"
import { FontLoader } from "./modules/FontLoader.js"
import { CSS3DRenderer, CSS3DObject } from './modules/CSS3DRenderer.js'

var scene, renderer, camera;
var cube;
var controls;
var JOINTS = []
var X = [0]
var Y = [0]
var Z = [0]
var xpos = 0
var ypos = 0
var zpos = 0
var THETAS = []
var ALFAS = []
var Rs = []
var Ds = []
var hom_from_0 = []
var dis_from_0 = []
var HOMOGENEOUSES = []
var UHLY = []
var SIN = []
var COS = []
var DH
var ROTATIONS = []
var TRAJECTORY = []
var speed_mode = 1
var UHLY_zaciatok = []
var POS_X_zaciatok
var POS_Y_zaciatok
var POS_Z_zaciatok
var SPEED_UP_VECTORS = []
var precision = 25
var negative_angle_exception = false
var output_type
var FOR_USER_ANGLES = []
var FOR_USER_ANGLES2 = []
var MAX_ANGLES = []
const x = new THREE.Vector3(1, 0, 0);
const y = new THREE.Vector3(0, 0, 1);
const z = new THREE.Vector3(0, 1, 0);
var LINES = []
var active_counter = 0
var Types = []
var AXIS = []
var PREV = []
var orbit
var target
var envelope, obalka
var record = true
var showtraj = true
var pos = new THREE.Vector3()
const gui = new GUI({ width: 300, autoPlace: false })

$("#gui").append($(gui.domElement));

init();
animate();
function init() {
  var canvas = document.getElementById("bg")
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
  var Width;
  var Height = window.innerHeight * 0.8;
  var mq = window.matchMedia("(max-width: 1000px)");
  if (mq.matches) {
    Width = window.innerWidth * 0.85;
  }
  else {
    Width = window.innerWidth * 0.65;
    renderer.setSize(Width, Height);
  }
  renderer.setPixelRatio(window.devicePixelRatio);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x3E3E3E);
  camera = new THREE.PerspectiveCamera(45, Width / Height, 1, 10000);
  camera.position.y = 160;
  camera.position.z = 400;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  orbit = new OrbitControls(camera, renderer.domElement);
  var gridXZ = new THREE.GridHelper(100, 10, new THREE.Color(0xff0000), new THREE.Color(0xffffff));
  scene.add(gridXZ);
  /*const light = new THREE.PointLight(0xfffff0, 1, 100);
  light.position.set(50, 50, 50);
  scene.add(light);*/
  // ambient light
  let hemiLight = new THREE.AmbientLight(0xffffff, 0.20);
  hemiLight.userData.notDestroy = true
  scene.add(hemiLight);

  //Add directional light
  let dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(30, 50, 30);
  scene.add(dirLight);
  dirLight.userData.notDestroy = true
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.left = -70;
  dirLight.shadow.camera.right = 70;
  dirLight.shadow.camera.top = 70;
  dirLight.shadow.camera.bottom = -70;


  DH = JSON.parse(localStorage.getItem("DH"))
  //DH = [[0, -90, 0, 29], [-90, 0, 27, 0], [0, -90, 7, 0], [0, 90, 0, 30], [0, -90, 0, 0], [0, 0, 0, 7]]
  Types = [1, 2, 2, 4]
  //Types = [1, 2, 2, 3, 2, 3, 4]

  for (let i = 0; i < DH.length; i++) {
    THETAS.push(DH[i][0] * 0.0174532925)
    ALFAS.push(DH[i][1] * 0.0174532925)
    Rs.push(DH[i][2])
    Ds.push(DH[i][3])
    FOR_USER_ANGLES2.push([])
    UHLY.push(0)
    PREV.push(0)
    MAX_ANGLES.push(Infinity)
    AXIS.push(new THREE.Vector3(0, 1, 0))
  }

  calculate_matricies()
  make_robot()
  make_target()
  make_envelope()
  make_trajectory()
}

function make_trajectory() {
  const abba = gui.addFolder('TRAJECTORY')
  var settings = {
    checkbox: true,
    record: true,
    show: true
  }

  abba.add(settings, 'record').onChange(function () {
    record = settings.record
  })
    .name("Record Trajectory")

  abba.add(settings, 'show').onChange(function () {
    showtraj = settings.show
    if (!showtraj)
      TRAJECTORY.forEach(point => {
        point.visible = false
      });
    else TRAJECTORY.forEach(point => {
      point.visible = true
    });
  })
    .name("Show trajectory")

  var objaa = {
    add: function () {
      TRAJECTORY.forEach(point => {
        scene.remove(point)
      });
    }
  };
  var a = abba.add(objaa, 'add');
  a.name("Dispose trajectory")
  abba.open()

}

function get_constant_jacobian() {
  if (obalka.containsPoint(target.position)) {
    $(".close").click() //closes not in read alert
    calculate_matricies()
    JOINTS[JOINTS.length - 1].getWorldPosition(pos)
    var xpos = target.position.x
    var ypos = target.position.y
    var zpos = target.position.z
    var xBodka = (xpos - pos.x) / 30
    var yBodka = (ypos - pos.y) / 30
    var zBodka = (zpos - pos.z) / 30

    for (let i = 0; i < 1000; i++) {
      calculate_matricies()
      var jed_matica = [[0], [0], [1]]
      var prvy_element = math.cross(jed_matica, dis_from_0[dis_from_0.length - 1])
      var JACOBIAN = [[prvy_element[0][0], prvy_element[0][1], prvy_element[0][2]]]

      for (let i = 0; i < hom_from_0.length - 1; i++) {
        var rotx = hom_from_0[i][0][2]
        var roty = hom_from_0[i][1][2]
        var rotz = hom_from_0[i][2][2]
        var rot = [rotx, roty, rotz]
        var displacement = math.subtract(dis_from_0[dis_from_0.length - 1], dis_from_0[i])
        var col = math.cross(rot, displacement)
        JACOBIAN.push(col)
      }
      var Jt = math.transpose(JACOBIAN)
      var JJt = math.multiply(JACOBIAN, Jt)
      var JJtinv = math.inv(JJt)
      var JtJJtinv = math.multiply(Jt, JJtinv)

      var docasne = []
      for (let i = 0; i < UHLY.length; i++) {
        var ThetaBodka = (JtJJtinv[0][i] * xBodka + JtJJtinv[2][i] * yBodka + JtJJtinv[1][i] * -zBodka) * 10
        var uhol = UHLY[i] + ThetaBodka
        //FOR_USER_ANGLES2[i].push(Math.round(uhol * 100) / 100)
        UHLY.splice(i, 1)
        UHLY.splice(i, 0, uhol)
        /*if (negative_angle_exception && uhol < 0) {
          alerts("Negative angle has been calculated, if you wish to continue with this trajectory, disable negative angle exception.")
          update_robot
          return
        }
        if (uhol > MAX_ANGLES[i]) {
          alerts("Maximum angle of some of your joint has been preceeded. Choose different trajectory.")
          update_robot
          return
        }
        docasne.push(Math.round(uhol * 100) / 100)*/
      }
      //FOR_USER_ANGLES.push(docasne)
      //console.log(UHLY)
      var rozdiel = Math.sqrt((xpos - X[X.length - 1]) ** 2 + (ypos - Y[X.length - 1]) ** 2 + (zpos - Z[X.length - 1]) ** 2)
      if (record) {
        const geometry = new THREE.SphereGeometry(0.1, 32, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const dad = new THREE.Mesh(geometry, material);
        dad.position.set(X[X.length - 1], Y[X.length - 1], Z[X.length - 1])
        scene.add(dad);
        if (!showtraj) dad.visible = false
        TRAJECTORY.push(dad)
      }


      /*let geometry = new THREE.SphereGeometry(0.4, 32, 16);
      let material = new THREE.PointsMaterial({ color: 0x888888 });
      let point = new THREE.Points(geometry, material);
      point.position.set(X[X.length - 1], Y[X.length - 1], Z[X.length - 1])
      scene.add(point)*/


      if (rozdiel < 0.5) {
        for (let v = 0; v < UHLY.length; v++) {
          JOINTS[v].rotateY(UHLY[v] * 0.0174532925 - ROTATIONS[v].prev)
          ROTATIONS[v].prev = UHLY[v] * 0.0174532925
          ROTATIONS[v].rotation = UHLY[v]
        }
        for (var ci = 0; ci < Object.keys(gui.__folders).length; ci++) {
          var key = Object.keys(gui.__folders)[ci];
          for (var jc = 0; jc < gui.__folders[key].__controllers.length; jc++) {
            gui.__folders[key].__controllers[jc].updateDisplay();
          }
        }
        return
      }
      if (i == 999) {
        for (let v = 0; v < UHLY.length; v++) {
          JOINTS[v].rotateY(UHLY[v] * 0.0174532925 - ROTATIONS[v].prev)
          ROTATIONS[v].prev = UHLY[v] * 0.0174532925
          ROTATIONS[v].rotation = UHLY[v]
        }
        for (var ci = 0; ci < Object.keys(gui.__folders).length; ci++) {
          var key = Object.keys(gui.__folders)[ci];
          for (var jc = 0; jc < gui.__folders[key].__controllers.length; jc++) {
            gui.__folders[key].__controllers[jc].updateDisplay();
          }
        }
        return
      }

    }
  }
  else alerts("Your point is outside of reach for your robot.")
}

function make_target() {
  let geometry = new THREE.SphereGeometry(0.8, 32, 16);
  let material = new THREE.MeshPhongMaterial({ color: 0x90ee90 });
  target = new THREE.Mesh(geometry, material);
  target.position.set(10, 10, 10)
  scene.add(target)
  const axesHelper = new THREE.AxesHelper(10);
  target.add(axesHelper);
  const controls = new TransformControls(camera, renderer.domElement)
  controls.setSize(controls.size - 0.3)
  controls.attach(target)
  controls.visible = false
  controls.enabled = false
  scene.add(controls)

  var obj = {
    add: function () {
      get_constant_jacobian()
    }
  };
  var a = gui.add(obj, 'add');
  a.name("Compute IK")

  var objj = {
    add: function () {
      if (active_counter % 2 != 0) {
        target.children[0].visible = true
        controls.visible = false
        controls.enabled = false
      }
      else {
        controls.visible = true
        controls.enabled = true
        target.children[0].visible = false
      }
      active_counter++

      controls.addEventListener('dragging-changed', function (event) {
        orbit.enabled = !event.value;
        get_constant_jacobian()
      });

    }
  };
  var b = gui.add(objj, 'add');
  b.name("Active IK")



  var controlsx = {
    rotation: 0,
  };
  var controlsy = {
    rotation: 0,
  };
  var controlsz = {
    rotation: 0,
  };

  const targetFolder = gui.addFolder('TARGET')
  const Position = targetFolder.addFolder('Position')
  const Rotation = targetFolder.addFolder('Rotation')

  var prevx, prevz, prevy

  Position.add(target.position, 'x', -50, 50)
    .name("X position")
  Position.add(target.position, 'y', -50, 50)
    .name("Y position")
  Position.add(target.position, 'z', -50, 50)
    .name("Z position")

  /*Rotation.add(controlsx, 'rotation', -90, 90)
    .name("X rotation")
    .onChange(function () {
      var a
      var b = controlsx.rotation * 0.0174532925
      if (typeof (prevx) == "number") a = prevx
      else a = 0
      console.log(prevx)
      sphere.rotateX(b - a)
      prevx = b
    });
 
  Rotation.add(controlsy, 'rotation', -90, 90)
    .name("Y rotation")
    .onChange(function () {
      var a
      var b = controlsy.rotation * 0.0174532925
      if (typeof (prevy) == "number") a = prevy
      else a = 0
      console.log(prevy)
      sphere.rotateY(b - a)
      prevy = b
    });
 
  Rotation.add(controlsz, 'rotation', -90, 90)
    .name("Z rotation")
    .onChange(function () {
      var a
      var b = controlsz.rotation * 0.0174532925
      if (typeof (prevz) == "number") a = prevz
      else a = 0
      console.log(prevz)
      sphere.rotateZ(b - a)
      prevz = b
    });*/

  targetFolder.open()
  Position.open()
  //Rotation.open()
}

function make_joint() {
  let radius = 2;
  let height = 4
  let cylinder = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, radius, height, 32), new THREE.MeshPhongMaterial({ color: 0x90ee90 }))
  return cylinder
}

function make_sphere() {
  let geometry = new THREE.SphereGeometry(2, 32, 16);
  let material = new THREE.MeshPhongMaterial({ color: 0x90ee90 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.receiveShadow = true
  sphere.castShadow = true
  sphere.userData.sphere = true
  sphere.userData.notDestroy = true
  return sphere
}


function make_robot() {
  var controls = {
    rotation: 0,
    prev: 0
  };
  ROTATIONS.push(controls)
  const cubeFolder = gui.addFolder('JOINT ANGLES')
  var cylinder = make_joint()
  scene.add(cylinder)
  cylinder.userData.name = `0`
  cylinder.position.set(0, 0, 0)
  JOINTS.push(cylinder)
  const axesHelper = new THREE.AxesHelper(10);
  cylinder.add(axesHelper);
  cubeFolder.add(controls, 'rotation', -180, 180)
    .name(`Joint 1`)
    .onChange(function () {
      var k = parseInt(cylinder.userData.name)
      var a = ROTATIONS[0].prev
      var b = ROTATIONS[0].rotation * 0.0174532925
      UHLY[0] = ROTATIONS[0].rotation
      JOINTS[0].rotateY(b - a)
      ROTATIONS[0].prev = ROTATIONS[0].rotation * 0.0174532925
    });

  var i = 1
  dis_from_0.forEach(e => {
    var controls = {
      rotation: 0,
      prev: 0
    };
    ROTATIONS.push(controls)
    if (Types[i] == 4) {
      var cylinder = make_sphere()
      const axesHelper = new THREE.AxesHelper(10);
      cylinder.add(axesHelper);
    }
    else var cylinder = make_joint()

    scene.add(cylinder)
    cylinder.userData.name = `${i}`

    if (Types[i] == 3) {
      cylinder.rotateZ(Math.PI / 2)
      AXIS[i].applyAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2)
    }
    else if (Types[i] == 2) {
      cylinder.rotateX(Math.PI / 2)
      AXIS[i].applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2)
    }

    cylinder.position.set(e[0], e[2], e[1])
    JOINTS.push(cylinder)
    if (i < dis_from_0.length) {
      cubeFolder.add(controls, 'rotation', -180, 180)
        .name(`Joint ${i}`)
        .onChange(function () {
          var k = parseInt(cylinder.userData.name)
          var a = ROTATIONS[k].prev
          var b = ROTATIONS[k].rotation * 0.0174532925
          UHLY[k] = ROTATIONS[k].rotation
          JOINTS[k].rotateY(b - a)
          ROTATIONS[k].prev = ROTATIONS[k].rotation * 0.0174532925
        });
    }
    i++
  });

  cubeFolder.open()

  for (let i = 0; i < JOINTS.length - 1; i++) {
    var lineMaterial = new THREE.MeshStandardMaterial({ opacity: 0 });
    let endVector = new THREE.Vector3(JOINTS[i].position.x, JOINTS[i].position.y, JOINTS[i].position.z);
    let startVector = new THREE.Vector3(JOINTS[i + 1].position.x, JOINTS[i + 1].position.y, JOINTS[i + 1].position.z);
    var linePoints = []
    linePoints.push(startVector, endVector);

    var tubeGeometry = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(linePoints),
      512,// path segments
      1,// THICKNESS
      6, //Roundness of Tube
      false //closed
    );
    let line = new THREE.Line(tubeGeometry, lineMaterial);
    //line.rotation.x = Math.PI / 2
    line.receiveLight = false
    scene.add(line)
    LINES.push(line)
  }

  for (let i = 0; i < JOINTS.length; i++) {
    for (let j = 0; j < JOINTS.length; j++) {
      if (j > i) JOINTS[i].attach(JOINTS[j])
    }
    for (let j = 0; j < LINES.length; j++) {
      if (j >= i) JOINTS[i].attach(LINES[j])
    }
  }
}

function make_envelope() {
  var r = 0
  for (let i = 0; i < JOINTS.length - 1; i++) {
    if (Types[i] != 1) {
      JOINTS[i].getWorldPosition(pos)
      var x1 = pos.x
      var y1 = pos.y
      var z1 = pos.z
      JOINTS[i + 1].getWorldPosition(pos)
      var x2 = pos.x
      var y2 = pos.y
      var z2 = pos.z
      console.log(r)
      r = r + Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2)
    }
  }
  console.log(r)
  let geometry = new THREE.SphereGeometry(r, 32, 16);
  let material = new THREE.PointsMaterial({ color: 0x90ee90 });
  envelope = new THREE.Points(geometry, material);

  for (let i = 0; i < JOINTS.length - 1; i++) {
    if (Types[i] != 1) {
      JOINTS[i].getWorldPosition(pos)
      break
    }
  }


  envelope.position.set(pos.x, pos.y, pos.z)
  scene.add(envelope)
  envelope.visible = false
  let pozicia = new THREE.Vector3(pos.x, pos.y, pos.z)
  obalka = new THREE.Sphere(pozicia, r)

  var a = gui.add(envelope, 'visible');
  a.name("Working envelope")
}


function animate() {
  orbit.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function calculate_matricies() {
  hom_from_0 = []
  dis_from_0 = []
  HOMOGENEOUSES = []
  X = []
  Y = []
  Z = []
  for (let i = 0; i < UHLY.length; i++) {

    SIN = Math.sin((UHLY[i] * 0.0174532925) + THETAS[i])
    COS = Math.cos((UHLY[i] * 0.0174532925) + THETAS[i])

    var a = [COS, -SIN * math.cos(ALFAS[i]), SIN * math.sin(ALFAS[i]), COS * Rs[i]]
    var b = [SIN, COS * math.cos(ALFAS[i]), -COS * math.sin(ALFAS[i]), SIN * Rs[i]]
    var c = [0, math.sin(ALFAS[i]), math.cos(ALFAS[i]), Ds[i]]
    var d = [0, 0, 0, 1]

    HOMOGENEOUSES.push([a, b, c, d])
  }

  var H0x = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]
  var xStart = 0
  var yStart = 0
  var zStart = 0

  HOMOGENEOUSES.forEach(i => {
    H0x = math.multiply(H0x, i)
    hom_from_0.push(H0x)

    X.push(H0x[0][3])
    Z.push(-H0x[1][3])
    Y.push(H0x[2][3])

    xStart = H0x[0][3]
    yStart = H0x[1][3]
    zStart = H0x[2][3]

    var dis = [xStart, yStart, zStart]
    dis_from_0.push(dis)
  });
}

function alerts(text) {
  $('.alrt').remove()
  $('.close').remove()
  $('.alertDiv').append($(`<div class=alrt role=alert>${text}</div>`));
  $('.alrt').addClass('alert alert-warning alert-dismissible fade show');
  $('.alrt').append('<button type=button class=close data-dismiss=alert aria-label=Close></button>');
  $('.close').append('<span aria-hidden="true">&times;</span>');

}