import * as THREE from "https://threejs.org/build/three.module.js"
import { GUI } from "./modules//dat.gui/build/dat.gui.module.js"
import * as FreeformControls from "./modules/three-freeform-controls/dist/three-freeform-controls.js";
import { OrbitControls } from "./modules/OrbitControls.js"


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
var rot_from_0 = []
var HOMOGENEOUSES = []
var UHLY = []
var SIN = []
var COS = []
var DH
var ROTATIONS = []
var TRAJECTORY = []
var speed_mode = "constant"
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
var LINES = []

var activeIK = {
  active: true
}
var Types = []
var AXIS = []
var PREV = []
var orbit
var target
var envelope, obalka
var record = false
var showtraj = true
var rozdiel, moves

var pos = new THREE.Vector3()
var pos2 = new THREE.Vector3()
var roty = new THREE.Vector3()
var wristpos = new THREE.Vector3()
var wristvec = new THREE.Vector3()
var smervec = new THREE.Vector3()

var adset = {
  negative: false,
  speed: "Constant",
  precision: "Medium",
  manipulate: "Transform",
}
var trajectory_angles = []

document.getElementById("get_angles").addEventListener("click", function () {   // output angles for trajecyory
  if (trajectory_angles.length > 0) {
    $(".output_angles").html(JSON.stringify(trajectory_angles))
    $(".output_angles").height(250)
  }
  else {
    $(".output_angles").html('')
    $(".output_angles").height(0)
  }
});


const gui = new GUI({ width: 400, autoPlace: false })

$("#gui").append($(gui.domElement));

var nasobok = 1


function onWindowResize() {
  Height = window.innerHeight * 0.9;
  Width = window.innerWidth * 0.92;
  renderer.setSize(Width, Height);
  camera.aspect = Width / Height;
  camera.updateProjectionMatrix();

  document.getElementById("div").style.height = `${renderer.domElement.height}px`;
  document.getElementById("div").style.width = `${renderer.domElement.width}px`;
  /*$('#div').height(renderer.domElement.height);
  $('#div').width(renderer.domElement.width);*/
}
window.addEventListener('resize', onWindowResize);


var Height, Width
init();
animate();
function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  Height = window.innerHeight * 0.9;
  Width = window.innerWidth * 0.92;

  renderer.setSize(Width, Height);
  renderer.setPixelRatio(window.devicePixelRatio);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x3E3E3E);
  camera = new THREE.PerspectiveCamera(45, Width / Height, 1, 10000);
  camera.position.x = 100;
  camera.position.y = 40;
  camera.position.z = 175;

  camera.lookAt(new THREE.Vector3(0, 0, 0));
  orbit = new OrbitControls(camera, renderer.domElement);
  $("#div").append(renderer.domElement)

  document.getElementById("div").style.height = `${renderer.domElement.height}px`;
  document.getElementById("div").style.width = `${renderer.domElement.width}px`;
  /*$('#div').height(renderer.domElement.height);
  $('#div').width(renderer.domElement.width);*/
  renderer.domElement.style.position = 'absolute';

  var gridXZ = new THREE.GridHelper(100, 10, new THREE.Color(0xff0000), new THREE.Color(0xffffff));
  scene.add(gridXZ);

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
  //DH = [[0, -90, 0, 32.7], [90, 0, 29, 0], [0, -90, 0, 0], [0, 90, 0, 30], [0, -90, 0, 0], [0, 0, 0, 6.4]]  // IRB 1100 0.58m
  if (DH) {
    Types = JSON.parse(localStorage.getItem("TYPES"))
    if (Types) {
      if (arrayEquals(Types, [1, 2, 2, 3, 2, 3, 4]) && DH[0][1] < 0) {
        DH[1][0] *= -1
      }
      else if (arrayEquals(Types, [1, 2, 2, 3, 2, 3, 4]) && DH[0][1] > 0) nasobok = -1
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
      make_trajectory()
      make_target()
      make_more_settings()
    }
  }
}

function make_more_settings() {
  const abbc = gui.addFolder('MORE SETTINGS')

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
      r = r + Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2)
    }
  }
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

  var a = abbc.add(envelope, 'visible');
  a.name("Working envelope")

  abbc.add(adset, 'negative').name("Catch negative angles")
  abbc.add(adset, "speed", ["Constant", "Slow-down", "Speed-up"]).name("End effector speed mode").onChange(function () {
    if (adset.speed == "Constant") speed_mode = "constant"
    else if (adset.speed == "Slow-down") speed_mode = "slow"
    else speed_mode = "speed"
  })
  abbc.add(adset, "precision", ["Medium", "Low", "High"]).name("Calculations count").onChange(function () {
    if (adset.precision == "Medium") precision = 25
    else if (adset.precision == "Low") precision = 15
    else precision = 30
  })


  var a
  for (let i = 0; i < JOINTS.length - 1; i++) {
    a = {
      max: Infinity,
    }
    MAX_ANGLES[i] = a
    abbc.add(a, 'max', 0, 360, 1)
      .name(`Max angle of ${i + 1}. joint`)
  }

  var obj
  if (arrayEquals(Types, [1, 2, 2, 3, 2, 3, 4])) {
    obj = {
      add: function () {
        JOINTS[JOINTS.length - 1].getWorldPosition(pos)
        rozdiel = Math.sqrt((target.position.x - pos.x) ** 2 + (target.position.y - pos.y) ** 2 + (target.position.z - pos.z) ** 2)
        if (rozdiel < 5) precision = 1
        else {
          if (adset.precision == "Medium") precision = 25
          else if (adset.precision == "Low") precision = 15
          else precision = 30
        }
        get_constant_jacobian6DOF()
      }
    };
  }
  else {
    obj = {
      add: function () {
        JOINTS[JOINTS.length - 1].getWorldPosition(pos)
        rozdiel = Math.sqrt((target.position.x - pos.x) ** 2 + (target.position.y - pos.y) ** 2 + (target.position.z - pos.z) ** 2)
        if (rozdiel < 5) precision = 1
        else {
          if (adset.precision == "Medium") precision = 25
          else if (adset.precision == "Low") precision = 15
          else precision = 30
        }
        get_constant_jacobian()
      }
    };
  }
  var a = gui.add(obj, 'add');
  a.name("Compute IK")

  var b = gui.add(activeIK, 'active');
  b.name("Active IK")
}

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}


function make_trajectory() {
  const abba = gui.addFolder('TRAJECTORY')
  var settings = {
    checkbox: true,
    record: false,
    show: true
  }

  abba.add(adset, "manipulate", ["Transform", "Rotate", "Plane"]).name("Manipulate").onChange(function () {
    if (adset.manipulate == "Transform") {
      moves.translationXP.visible = true;
      moves.translationXN.visible = true;
      moves.translationYP.visible = true;
      moves.translationYN.visible = true;
      moves.translationZP.visible = true;
      moves.translationZN.visible = true;
      moves.rotationX.visible = false;
      moves.rotationY.visible = false;
      moves.rotationZ.visible = false;
      moves.rotationEye.visible = false;
      moves.pickPlaneXY.visible = false;
      moves.pickPlaneYZ.visible = false;
      moves.pickPlaneZX.visible = false;
      moves.pick.visible = false;
    }
    else if (adset.manipulate == "Rotate") {
      moves.translationXP.visible = false;
      moves.translationXN.visible = false;
      moves.translationYP.visible = false;
      moves.translationYN.visible = false;
      moves.translationZP.visible = false;
      moves.translationZN.visible = false;
      moves.rotationX.visible = true;
      moves.rotationY.visible = true;
      moves.rotationZ.visible = true;
      moves.rotationEye.visible = true;
      moves.pickPlaneXY.visible = false;
      moves.pickPlaneYZ.visible = false;
      moves.pickPlaneZX.visible = false;
      moves.pick.visible = false;
    }
    else {
      moves.translationXP.visible = false;
      moves.translationXN.visible = false;
      moves.translationYP.visible = false;
      moves.translationYN.visible = false;
      moves.translationZP.visible = false;
      moves.translationZN.visible = false;
      moves.rotationX.visible = false;
      moves.rotationY.visible = false;
      moves.rotationZ.visible = false;
      moves.rotationEye.visible = false;
      moves.pickPlaneXY.visible = true;
      moves.pickPlaneYZ.visible = true;
      moves.pickPlaneZX.visible = true;
      moves.pick.visible = true;
    }
  })

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
      trajectory_angles = []
      TRAJECTORY = []
      document.querySelector(".precision-value").max = 0
    }
  };
  var a = abba.add(objaa, 'add');
  a.name("Dispose trajectory")
  abba.open()

}

function scale(number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function get_constant_jacobian6DOF() {
  if (obalka.containsPoint(target.position)) $(".close").click() //closes not in reach alert
  else alerts("This point is outside of reach for your robot.")
  roty.set(0, 1, 0)
  roty.applyEuler(target.rotation)
  JOINTS[JOINTS.length - 1].getWorldPosition(pos)
  JOINTS[4].getWorldPosition(pos2)

  rozdiel = Math.sqrt((pos.x - pos2.x) ** 2 + (pos.y - pos2.y) ** 2 + (pos.z - pos2.z) ** 2)
  var goalx = target.position.x - (roty.x * rozdiel) //WRIST POSITION
  var goaly = target.position.y - (roty.y * rozdiel)
  var goalz = target.position.z - (roty.z * rozdiel)

  var xBodka = (goalx - pos2.x) / (precision)
  var yBodka = (goaly - pos2.y) / (precision)
  var zBodka = (goalz - pos2.z) / (precision)

  smervec.set(xBodka, yBodka, zBodka)
  JOINTS[5].getWorldPosition(wristvec)

  var l0 = LINES[0].geometry.parameters.path.points[1].distanceTo(LINES[0].geometry.parameters.path.points[0])
  var l1 = LINES[1].geometry.parameters.path.points[1].distanceTo(LINES[1].geometry.parameters.path.points[0])
  var l2 = LINES[2].geometry.parameters.path.points[1].distanceTo(LINES[2].geometry.parameters.path.points[0])
  var l3 = LINES[3].geometry.parameters.path.points[1].distanceTo(LINES[3].geometry.parameters.path.points[0])

  for (let i = 1; i < precision + 1; i++) {
    var x = wristvec.x + i * smervec.x  //WRIST POSITION
    var y = wristvec.y + i * smervec.y
    var z = wristvec.z + i * smervec.z
    wristpos.set(x, y, z)

    var joint1_angle = (Math.atan2(-z, x) * 57.2957795)
    UHLY[0] = joint1_angle

    pos2 = wristpos.clone()
    JOINTS[1].getWorldPosition(pos)
    pos2.y = pos2.y - (pos2.y - pos.y)
    var r = pos.distanceTo(pos2)
    var alpha = math.atan2(y - l0, r) // x - JOINTS[1].position.x (world)

    var s = Math.sqrt((y - l0) ** 2 + r ** 2)
    var l4 = Math.sqrt(l2 ** 2 + l3 ** 2)
    var beta = math.acos((l1 ** 2 + s ** 2 - l4 ** 2) / (2 * l1 * s))
    var joint2_angle = (((Math.PI / 2) - beta - alpha) * 57.2957795) * nasobok
    UHLY[1] = joint2_angle

    var gamma = math.acos((l1 ** 2 + l4 ** 2 - s ** 2) / (2 * l1 * l4))
    var theta = math.atan(l3 / l2)

    var joint3_angle = ((Math.PI - gamma - theta) * 57.2957795) * nasobok
    UHLY[2] = joint3_angle

    var m = new THREE.Matrix4()
    const threerot = new THREE.Euler(target.rotation.x, -target.rotation.z, target.rotation.y);
    m.makeRotationFromEuler(threerot)

    var R0_6 = [[m.elements[0], m.elements[1], m.elements[2]],
    [m.elements[4], m.elements[5], m.elements[6]],
    [m.elements[8], m.elements[9], m.elements[10]]]

    /*update_robot()
    var a = JOINTS[2].matrixWorld
    var R0_3 = [[a.elements[0], a.elements[1], a.elements[2]],
    [a.elements[4], a.elements[5], a.elements[6]],
    [a.elements[8], a.elements[9], a.elements[10]]]*/

    calculate_matricies()
    var a = hom_from_0[2]
    var R0_3 = [[a[0][0], a[0][1], a[0][2]],
    [a[1][0], a[1][1], a[1][2]],
    [a[2][0], a[2][1], a[2][2]]]


    var R0_3inv = math.transpose(R0_3)
    var R3_6 = math.multiply(R0_3inv, R0_6)

    /*for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        var difference = R3_6[j][k] - R0_6[j][k]  //the amount it has to change
        //console.log(difference / (precision - i))
        R0_3[j][k] = R0_6[j][k] + (difference / (precision - i))
      }
    }*/

    //var R3_6 = math.multiply(R0_3inv, R0_6)

    //if (target.position.x < 0) var joint4_angle = -180 - (math.atan(R3_6[1][2] / R3_6[0][2]) * 57.2957795)
    var joint4_angle = (math.atan(R3_6[1][2] / R3_6[0][2]) * 57.2957795)  // 180 - the_angle for moveing through 0 :(
    if (wristpos.x < 0) {
      if (wristpos.z < 0) joint4_angle += 180
      else joint4_angle -= 180
    }
    var joint5_angle = (((math.asin(R3_6[2][2]) * 57.2957795)) - 90) * nasobok
    var joint6_angle = (math.atan(-R3_6[2][1] / R3_6[2][0]) * 57.2957795)

    UHLY[3] = joint4_angle
    UHLY[4] = joint5_angle
    UHLY[5] = joint6_angle

    JOINTS[6].getWorldPosition(pos)
    JOINTS[5].getWorldPosition(pos2)
    /*if (target.position.y < pos2.y) {
      UHLY[4] *= -1
      joint5_angle *= -1
    }*/


    var docasne = [Math.round(joint1_angle * 100) / 100, Math.round(joint2_angle * 100) / 100, Math.round(joint3_angle * 100) / 100, Math.round(joint4_angle * 100) / 100, Math.round(joint5_angle * 100) / 100, Math.round(joint6_angle * 100) / 100]
    for (let i = 0; i < UHLY.length; i++) UHLY[i] = Math.round(UHLY[i] * 100) / 100

    //console.log(`CONST jointtarget JointTarget_${TRAJECTORY.length}:=[[${UHLY}],[9E+09,9E+09,9E+09,9E+09,9E+09,9E+09]];`)
    //console.log(`MoveAbsJ JointTarget_${TRAJECTORY.length},v100,z1,tool0\WObj:=wobj0;`)

    console.log(precision)
    if (record) {
      JOINTS[6].getWorldPosition(pos)
      const geometry = new THREE.SphereGeometry(0.2, 32, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const dad = new THREE.Mesh(geometry, material);
      dad.position.set(pos.x, pos.y, pos.z)
      scene.add(dad);
      if (!showtraj) dad.visible = false
      TRAJECTORY.push(dad)
      trajectory_angles.push(docasne)
    }
    update_robot()
  }

}


function get_constant_jacobian() {
  if (obalka.containsPoint(target.position)) {
    $(".close").click() //closes not in reach alert
    calculate_matricies()
    JOINTS[JOINTS.length - 1].getWorldPosition(pos)
    var xpos = target.position.x
    var ypos = target.position.y
    var zpos = target.position.z
    var xBodka = (xpos - pos.x) / precision
    var yBodka = (ypos - pos.y) / precision
    var zBodka = (zpos - pos.z) / precision

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
        if (adset.negative && uhol < 0) {
          alerts(`Negative angle has been calculated, if you wish to continue with this trajectory, disable "Catch negative angles".`)
          update_robot()
          return
        }
        if (uhol > MAX_ANGLES[i].max) {
          alerts("Maximum angle of some of your joint has been preceeded. Choose different trajectory.")
          return
        }
        UHLY.splice(i, 1)
        UHLY.splice(i, 0, uhol)
        docasne.push(Math.round(uhol * 100) / 100)
      }
      //FOR_USER_ANGLES.push(docasne)
      //console.log(UHLY)
      rozdiel = Math.sqrt((xpos - X[X.length - 1]) ** 2 + (ypos - Y[X.length - 1]) ** 2 + (zpos - Z[X.length - 1]) ** 2)
      if (record) {
        const geometry = new THREE.SphereGeometry(0.2, 32, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const dad = new THREE.Mesh(geometry, material);
        dad.position.set(X[X.length - 1], Y[X.length - 1], Z[X.length - 1])
        scene.add(dad);
        if (!showtraj) dad.visible = false
        TRAJECTORY.push(dad)
        trajectory_angles.push(docasne)
      }

      if (rozdiel < 0.5) {
        update_robot()
        return
      }
      if (i == 999) {
        console.log("didnt make it :'(")
        update_robot()
        return
      }

    }
  }
  else alerts("This point is outside of reach for your robot.")

}




function get_slow_down_jacobian(slow_down, plot) {
  if (slow_down) {
    SPEED_UP_VECTORS = []
    UHLY_zaciatok = []
    POS_X_zaciatok = []
    POS_Y_zaciatok = []
    POS_Z_zaciatok = []
    UHLY_zaciatok.push(...UHLY)
    POS_X_zaciatok = X[X.length - 1]
    POS_Y_zaciatok = Y[X.length - 1]
    POS_Z_zaciatok = Z[X.length - 1]
    var x = target.position.x
    var y = target.position.y
    var z = target.position.z
  }
  else {
    var x = POS_X_zaciatok
    var y = POS_Y_zaciatok
    var z = POS_Z_zaciatok
  }

  for (let k = 0; k < 1000; k++) {
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

    var xBodka = (x - X[X.length - 1]) / precision
    var yBodka = (y - Y[X.length - 1]) / precision
    var zBodka = (z - Z[X.length - 1]) / precision

    if (slow_down) SPEED_UP_VECTORS.push([xBodka, yBodka, zBodka])

    var docasne = []

    for (let i = 0; i < UHLY.length; i++) {
      var ThetaBodka = (JtJJtinv[0][i] * xBodka + JtJJtinv[2][i] * yBodka + JtJJtinv[1][i] * -zBodka) * 50
      var uhol = UHLY[i] + ThetaBodka
      docasne.push(Math.round(uhol * 100) / 100)
      UHLY.splice(i, 1)
      UHLY.splice(i, 0, uhol)

      /*if (!slow_down) {
        FOR_USER_ANGLES2[i].push(Math.round(uhol * 100) / 100)
      }*/

      if (adset.negative && uhol < 0) {
        alerts(`Negative angle has been calculated, if you wish to continue with this trajectory, disable "Catch negative angles".`)
        update_robot()
        return
      }
      if (uhol > MAX_ANGLES[i].max) {
        alerts("Maximum angle of some of your joint has been preceeded. Choose different trajectory.")
        update_robot()
        return
      }
    }

    if (plot) {
      if (record) {
        const geometry = new THREE.SphereGeometry(0.1, 32, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const dad = new THREE.Mesh(geometry, material);
        dad.position.set(X[X.length - 1], Y[X.length - 1], Z[X.length - 1])
        scene.add(dad);
        if (!showtraj) dad.visible = false
        TRAJECTORY.push(dad)
      }
    }

    rozdiel = Math.sqrt((xpos - X[X.length - 1]) ** 2 + (ypos - Y[X.length - 1]) ** 2 + (zpos - Z[X.length - 1]) ** 2)
    if (rozdiel < 2) {
      update_robot()
      return
    }

    if (k == 999) {
      update_robot()
      return
    }
  }
}

function make_target() {
  let geometry = new THREE.BoxGeometry(4.4, 4.4, 4.4);
  let material = new THREE.MeshPhongMaterial({ color: 0x000000, emissive: 0xff0000, shininess: 10, opacity: 0.5, transparent: true })

  target = new THREE.Mesh(geometry, material);
  JOINTS[JOINTS.length - 1].getWorldPosition(pos)
  target.position.set(pos.x, pos.y, pos.z)

  var quaternion = new THREE.Quaternion();
  JOINTS[JOINTS.length - 1].getWorldQuaternion(quaternion)
  target.setRotationFromQuaternion(quaternion)
  scene.add(target)

  const axesHelper = new THREE.AxesHelper(10);
  target.add(axesHelper);


  const controlsManager = new FreeformControls.ControlsManager(camera, renderer.domElement);
  scene.add(controlsManager);
  moves = controlsManager.anchor(target, {
    separation: 5,
    hideOtherHandlesOnDrag: true,
    hideOtherControlsInstancesOnDrag: true,
    showHelperPlane: false,
    pickPlaneSizeScale: 0.5,
    rotationRadiusScale: 3,
    eyeRotationRadiusScale: 3.5,
    translationDistanceScale: 2.5
  });

  moves.translationZP.scale.set(15, 15, 15)
  moves.translationZN.scale.set(15, 15, 15)
  moves.translationYP.scale.set(15, 15, 15)
  moves.translationYN.scale.set(15, 15, 15)
  moves.translationXP.scale.set(15, 15, 15)
  moves.translationXN.scale.set(15, 15, 15)


  moves.translationXP.visible = true;
  moves.translationXN.visible = true;
  moves.translationYP.visible = true;
  moves.translationYN.visible = true;
  moves.translationZP.visible = true;
  moves.translationZN.visible = true;
  moves.rotationX.visible = false;
  moves.rotationY.visible = false;
  moves.rotationZ.visible = false;
  moves.rotationEye.visible = false;
  moves.pickPlaneXY.visible = false;
  moves.pickPlaneYZ.visible = false;
  moves.pickPlaneZX.visible = false;
  moves.pick.visible = false;

  moves.rotationX.handlebar.scale.set(10, 10, 10)
  moves.rotationY.handlebar.scale.set(10, 10, 10)
  moves.rotationZ.handlebar.scale.set(10, 10, 10)
  moves.rotationEye.handlebar.scale.set(10, 10, 10)

  moves.pickPlaneXY.plane.material.opacity = 0.1
  moves.pickPlaneYZ.plane.material.opacity = 0.1
  moves.pickPlaneZX.plane.material.opacity = 0.1

  controlsManager.listen(FreeformControls.EVENTS.DRAG_START, (object, handleName) => {
    orbit.enabled = false;
  });
  controlsManager.listen(FreeformControls.EVENTS.DRAG_STOP, (object, handleName) => {
    orbit.enabled = true;
  });

  if (arrayEquals(Types, [1, 2, 2, 3, 2, 3, 4])) {
    controlsManager.listen(FreeformControls.EVENTS.DRAG, (object, handleName) => {
      JOINTS[JOINTS.length - 1].getWorldPosition(pos)
      rozdiel = Math.sqrt((target.position.x - pos.x) ** 2 + (target.position.y - pos.y) ** 2 + (target.position.z - pos.z) ** 2)
      if (rozdiel < 5) precision = 1
      else {
        if (adset.precision == "Medium") precision = 25
        else if (adset.precision == "Low") precision = 15
        else precision = 30
      }
      if (activeIK.active) {
        get_constant_jacobian6DOF()
      }
    });
  }

  else {
    controlsManager.listen(FreeformControls.EVENTS.DRAG, (object, handleName) => {
      rozdiel = Math.sqrt((target.position.x - X[X.length - 1]) ** 2 + (target.position.y - Y[X.length - 1]) ** 2 + (target.position.z - Z[X.length - 1]) ** 2)
      if (rozdiel < 5) precision = 1
      else {
        if (adset.precision == "Medium") precision = 25
        else if (adset.precision == "Low") precision = 15
        else precision = 30
      }
      if (activeIK.active) {
        get_constant_jacobian()
      }
    });
  }

}

function make_joint() {
  let radius = 3;
  let height = 6
  //let material = new THREE.MeshPhongMaterial({ color: 0x000000, emissive: 0xff0000, shininess: 10, opacity: 0.5, transparent: true })
  let material = new THREE.MeshPhongMaterial({ color: 0x90ee90 });
  let cylinder = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, radius, height, 256), material)

  //let cylinder = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, radius, height, 32), material)
  //let cylinder = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, radius, height, 32), new THREE.MeshPhongMaterial({ color: 0x0398fc }))
  cylinder.receiveShadow = true
  return cylinder
}

function make_sphere() {
  let geometry = new THREE.BoxGeometry(4.4, 4.4, 4.4);
  //let material = new THREE.MeshBasicMaterial({ color: 0xffaa00, blending: THREE.AdditiveBlending, opacity: 0.5, transparent: true })
  //let material = new THREE.MeshPhongMaterial({color: 0x90ee90, opacity: 0.5, transparent: true, shininess: 10})
  //material.alphaMap = 0xffffff
  //let material = new THREE.MeshPhongMaterial({ color: 0x000000, emissive: 0xff0000, shininess: 10, opacity: 0.5, transparent: true })
  let material = new THREE.MeshPhongMaterial({ color: 0x90ee90 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.receiveShadow = true
  sphere.castShadow = true
  sphere.rotation.set(JOINTS[JOINTS.length - 1].rotation.x, JOINTS[JOINTS.length - 1].rotation.y, JOINTS[JOINTS.length - 1].rotation.z)
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
      var a = ROTATIONS[0].prev
      var b = ROTATIONS[0].rotation * 0.0174532925
      UHLY[0] = ROTATIONS[0].rotation
      JOINTS[0].rotateY(b - a)
      ROTATIONS[0].prev = ROTATIONS[0].rotation * 0.0174532925
      calculate_matricies()
    })

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
    // const axesHelper = new THREE.AxesHelper(10);
    // cylinder.add(axesHelper);
    scene.add(cylinder)
    cylinder.userData.name = `${i}`
    JOINTS.push(cylinder)


    pos.set(0, 1, 0)
    var q = new THREE.Quaternion()
    JOINTS[i - 1].getWorldQuaternion(q)
    pos.applyQuaternion(q)
    cylinder.setRotationFromQuaternion(q)
    cylinder.rotateOnWorldAxis(pos, THETAS[i - 1])

    pos.set(1, 0, 0)
    JOINTS[i].getWorldQuaternion(q)
    pos.applyQuaternion(q)
    cylinder.setRotationFromQuaternion(q)
    cylinder.rotateOnWorldAxis(pos, ALFAS[i - 1])

    cylinder.position.set(e[0], e[2], e[1])
    if (i < dis_from_0.length) {
      cubeFolder.add(controls, 'rotation', -180, 180)
        .name(`Joint ${i + 1}`)
        .onChange(function () {
          var k = parseInt(cylinder.userData.name)
          var a = ROTATIONS[k].prev
          var b = ROTATIONS[k].rotation * 0.0174532925
          UHLY[k] = ROTATIONS[k].rotation
          JOINTS[k].rotateY(b - a)
          ROTATIONS[k].prev = ROTATIONS[k].rotation * 0.0174532925
          calculate_matricies()
        });
      i++
    }
  });

  JOINTS[JOINTS.length - 1].getWorldPosition(pos)
  document.querySelector(".xpos").innerHTML = `X: ${Math.round(pos.x * 100) / 100}cm`
  document.querySelector(".ypos").innerHTML = `Y: ${Math.round(pos.y * 100) / 100}cm`
  document.querySelector(".zpos").innerHTML = `Z: ${Math.round(pos.z * 100) / 100}cm`
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
      2,// THICKNESS
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


function animate() {
  orbit.update();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function calculate_matricies() {
  hom_from_0 = []
  dis_from_0 = []
  rot_from_0 = []
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


document.querySelector(".precision-value").oninput = function () {
  UHLY = trajectory_angles[this.value]
  update_robot()
}

function alerts(text) {
  $('.alrt').remove()
  $('.close').remove()
  $('.alertDiv').append($(`<div class=alrt role=alert>${text}</div>`));
  $('.alrt').addClass('alert alert-warning alert-dismissible fade show');
  $('.alrt').append('<button type=button class=close data-dismiss=alert aria-label=Close></button>');
  $('.close').append('<span aria-hidden="true">&times;</span>');

}

function update_robot() {
  for (let v = 0; v < UHLY.length; v++) {
    if (!isNaN(UHLY[v])) {
      JOINTS[v].rotateY(UHLY[v] * 0.0174532925 - ROTATIONS[v].prev)
      ROTATIONS[v].prev = UHLY[v] * 0.0174532925
      ROTATIONS[v].rotation = UHLY[v]
    }
  }
  for (var ci = 0; ci < Object.keys(gui.__folders).length; ci++) {
    var key = Object.keys(gui.__folders)[ci];
    for (var jc = 0; jc < gui.__folders[key].__controllers.length; jc++) {
      gui.__folders[key].__controllers[jc].updateDisplay();
    }
  }
  JOINTS[JOINTS.length - 1].getWorldPosition(pos)
  document.querySelector(".xpos").innerHTML = `X: ${Math.round(pos.x * 100) / 100}cm`
  document.querySelector(".ypos").innerHTML = `Y: ${Math.round(pos.y * 100) / 100}cm`
  document.querySelector(".zpos").innerHTML = `Z: ${Math.round(pos.z * 100) / 100}cm`

  document.querySelector(".precision-value").max = TRAJECTORY.length - 1
}

// fis>kus
function get_cirkular() {
  var x = target.position.x
  var y = target.position.y
  var z = target.position.z

  var xe = Infinity
  var ye = Infinity
  var ze = Infinity

  for (let k = 0; k < 1000; k++) {
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

    var xBodka = (x - X[X.length - 1]) / precision
    var yBodka = (y - Y[X.length - 1]) / precision
    var zBodka = (z - Z[X.length - 1]) / precision

    var docasne = []

    for (let i = 0; i < UHLY.length; i++) {
      var ThetaBodka = (JtJJtinv[0][i] * xBodka + JtJJtinv[2][i] * yBodka + JtJJtinv[1][i] * -zBodka) * 50
      var uhol = (UHLY[i] + ThetaBodka) - (k * k) * 0.000001
      docasne.push(Math.round(uhol * 100) / 100)
      UHLY.splice(i, 1)
      UHLY.splice(i, 0, uhol)
      if (adset.negative && uhol < 0) {
        alerts(`Negative angle has been calculated, if you wish to continue with this trajectory, disable "Catch negative angles".`)
        update_robot()
        return
      }
      if (uhol > MAX_ANGLES[i].max) {
        alerts("Maximum angle of some of your joint has been preceeded. Choose different trajectory.")
        update_robot()
        return
      }
    }

    if (record) {
      const geometry = new THREE.SphereGeometry(0.1, 32, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const dad = new THREE.Mesh(geometry, material);
      dad.position.set(X[X.length - 1], Y[X.length - 1], Z[X.length - 1])
      scene.add(dad);
      if (!showtraj) dad.visible = false
      TRAJECTORY.push(dad)

      if (k == 0) {
        xe = TRAJECTORY[0].position.x
        ye = TRAJECTORY[0].position.y
        ze = TRAJECTORY[0].position.z
        console.log(xe, ye, ze)
      }


    }

    if (k > 20) {
      rozdiel = Math.sqrt((xe - X[X.length - 1]) ** 2 + (ye - Y[X.length - 1]) ** 2 + (ze - Z[X.length - 1]) ** 2)
      if (Math.abs(ye - Y[X.length - 1]) < 0.5 && Math.abs(ze - Z[X.length - 1]) < 0.5) {
        update_robot()
        return
      }
      if (k == 200) {
        update_robot()
        return
      }
    }
  }
}