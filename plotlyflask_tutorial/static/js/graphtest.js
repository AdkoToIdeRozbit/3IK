import { Vector3 } from "https://threejs.org/build/three.module.js"

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
var TRAJECTORY_X = []
var TRAJECTORY_Y = []
var TRAJECTORY_Z = []
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
const x = new Vector3(1, 0, 0);
const y = new Vector3(0, 0, 1);
const z = new Vector3(0, 1, 0);

var c = []
for (i = 0; i < 10; i++) {
  c.push(i)
}

var layout = {
  uirevision: 'true',
  font: { size: "8vw" },
  paper_bgcolor: 'rgba(0,0,0,0)',
  scene: {
    aspectmode: "manual",
    aspectratio: {
      x: 1, y: 1, z: 1,
    },
    xaxis: {
      title: "X(cm)",
      range: [-15, 15],
      showgrid: true,
      zeroline: false,
      showline: true,
      gridcolor: '#A1A1A1',
      gridwidth: 2,
      color: '#000000',
    },
    yaxis: {
      title: "Y(cm)",
      range: [-10, 20],
      showgrid: true,
      zeroline: false,
      showline: true,
      gridcolor: '#A1A1A1',
      gridwidth: 2,
      zerolinewidth: 4,
      color: '#000000',
    },
    zaxis: {
      title: "Z(cm)",
      range: [0, 30],
      showgrid: true,
      zeroline: false,
      showline: true,
      gridcolor: '#A1A1A1',
      gridwidth: 2,
      zerolinewidth: 4,
      color: '#000000',
    },
  },
  margin: {
    l: 20,
    r: 20,
    b: 20,
    t: 20,
  },
  base: -30,
  showlegend: false
};

var trace1 = {
  name: "Kinematic chain",
  x: X,
  y: Y,
  z: Z,
  mode: 'lines',
  line: {
    width: 7,
    color: c,
    colorscale: "Viridis"
  },
  type: 'scatter3d'
};

var trace2 = {
  name: "Required position",
  mode: 'markers',
  type: 'scatter3d',
  marker: {
    color: 'red',
    size: 1,
    symbol: 'circle',
    line: {
      color: 'rgb(0,0,0)',
      width: 0
    }
  },
};

var trace3 = {
  name: "Trajectory",
  x: 0,
  y: 0,
  z: 0,
  mode: 'markers',
  type: 'scatter3d',
  marker: {
    color: "mediumaquamarine",
    colorscale: "Viridis",
    type: 'Blackbody',
    size: 3,
    symbol: 'circle',
    line: {
      color: 'rgb(0,0,0)',

      width: 0
    }
  },
};

var trace4 = {
  name: "X",
  x: 0,
  y: 0,
  z: 0,
  mode: 'lines',
  line: {
    width: 7,
    color: "red",
  },
  type: 'scatter3d'
};

var trace5 = {
  name: "Y",
  x: 0,
  y: 0,
  z: 0,
  mode: 'lines',
  line: {
    width: 7,
    color: "green",
  },
  type: 'scatter3d'
};

var trace6 = {
  name: "Z",
  x: 0,
  y: 0,
  z: 0,
  mode: 'lines',
  line: {
    width: 7,
    color: "blue",
  },
  type: 'scatter3d'
};



var data = [trace1, trace2, trace3, trace4, trace5, trace6]
var config = { responsive: true }

Plotly.newPlot('myDiv', data, layout, config);

window.onload = function () {

  //DH = JSON.parse(localStorage.getItem("DH"))
  DH = [[0, -90, 0, 29], [-90, 0, 27, 0], [0, -90, 7, 0], [0, 90, 0, 30], [0, -90, 0, 0], [0, 0, 0, 7]]

  layout.scene = {
    aspectmode: "manual",
    aspectratio: {
      x: 1, y: 1, z: 1,
    },
    xaxis: {
      title: "X(cm)",
      range: [-50, 50],
      showgrid: true,
      zeroline: false,
      showline: true,
      gridcolor: '#A1A1A1',
      gridwidth: 2,
      color: '#000000',
    },
    yaxis: {
      title: "Y(cm)",
      range: [-50, 50],
      showgrid: true,
      zeroline: false,
      showline: true,
      gridcolor: '#A1A1A1',
      gridwidth: 2,
      zerolinewidth: 4,
      color: '#000000',
    },
    zaxis: {
      title: "Z(cm)",
      range: [0, 100],
      showgrid: true,
      zeroline: false,
      showline: true,
      gridcolor: '#A1A1A1',
      gridwidth: 2,
      zerolinewidth: 4,
      color: '#000000',
    },
  }

  Plotly.relayout('myDiv', layout, 1)

  for (let i = 0; i < DH.length; i++) {
    THETAS.push(DH[i][0] * 0.0174532925)
    ALFAS.push(DH[i][1] * 0.0174532925)
    Rs.push(DH[i][2])
    Ds.push(DH[i][3])
    FOR_USER_ANGLES2.push([])
  }

  for (let i = 1; i < DH[0].length; i++) {
    UHLY.push(0)
    MAX_ANGLES.push(Infinity)
  }

  calculate_matricies()
  make_layout()
  update_robot()



  Plotly.restyle('myDiv', {
    x: [[20, 20 + x.x * 10]],
    y: [[20, 20 + x.y * 10]],
    z: [[20, 20 + x.z * 10]],
  }, 3)

  Plotly.restyle('myDiv', {
    x: [[20, 20 + y.x * 10]],
    y: [[20, 20 + y.y * 10]],
    z: [[20, 20 + y.z * 10]],
  }, 4)

  Plotly.restyle('myDiv', {
    x: [[20, 20 + z.x * 10]],
    y: [[20, 20 + z.y * 10]],
    z: [[20, 20 + z.z * 10]],
  }, 5)

  $(".ryp").append(`<div style="padding-top:50px;"><input type="range" min="0" max="45" value="0" class="slider form-range" id="ryp1"></div>`)
  $(".ryp").append(`<div style="padding-top:50px;"><input type="range" min="0" max="45" value="0" class="slider form-range" id="ryp2"></div>`)
  $(".ryp").append(`<div style="padding-top:50px;"><input type="range" min="0" max="45" value="0" class="slider form-range" id="ryp3"></div>`)

  document.getElementById(`ryp1`).oninput = function () {
    var a = parseInt(document.getElementById(`ryp1`).value) * 0.0174532925

    y.applyAxisAngle(x, a)
    z.applyAxisAngle(x, a)

    Plotly.restyle('myDiv', {
      x: [[20, 20 + y.x * 10]],
      y: [[20, 20 + y.y * 10]],
      z: [[20, 20 + y.z * 10]],
    }, 4)

    Plotly.restyle('myDiv', {
      x: [[20, 20 + z.x * 10]],
      y: [[20, 20 + z.y * 10]],
      z: [[20, 20 + z.z * 10]],
    }, 5)

  }
  document.getElementById(`ryp2`).oninput = function () {
    var a = parseInt(document.getElementById(`ryp2`).value) * 0.0174532925

    x.applyAxisAngle(y, a)
    z.applyAxisAngle(y, a)

    Plotly.restyle('myDiv', {
      x: [[20, 20 + x.x * 10]],
      y: [[20, 20 + x.y * 10]],
      z: [[20, 20 + x.z * 10]],
    }, 3)

    Plotly.restyle('myDiv', {
      x: [[20, 20 + z.x * 10]],
      y: [[20, 20 + z.y * 10]],
      z: [[20, 20 + z.z * 10]],
    }, 5)
  }
  document.getElementById(`ryp3`).oninput = function () {
    var a = parseInt(document.getElementById(`ryp3`).value) * 0.0174532925

    x.applyAxisAngle(z, a)
    y.applyAxisAngle(z, a)

    console.log(xpos, ypos, zpos)

    Plotly.restyle('myDiv', {
      x: [[xpos, xpos + x.x * 10]],
      y: [[ypos, ypos + x.y * 10]],
      z: [[zpos, zpos + x.z * 10]],
    }, 3)

    Plotly.restyle('myDiv', {
      x: [[xpos, xpos + y.x * 10]],
      y: [[ypos, ypos + y.y * 10]],
      z: [[zpos, zpos + y.z * 10]],
    }, 4)
  }
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

    X.push(xStart)
    X.push(H0x[0][3])
    Y.push(yStart)
    Y.push(H0x[1][3])
    Z.push(zStart)
    Z.push(H0x[2][3])

    xStart = H0x[0][3]
    yStart = H0x[1][3]
    zStart = H0x[2][3]

    var dis = [xStart, yStart, zStart]
    dis_from_0.push(dis)
  });
  document.querySelector(".akt-x").innerHTML = `X: ${Math.round(X[X.length - 1] * 100) / 100}cm`
  document.querySelector(".akt-y").innerHTML = `Y: ${Math.round(Y[X.length - 1] * 100) / 100}cm`
  document.querySelector(".akt-z").innerHTML = `Z: ${Math.round(Z[X.length - 1] * 100) / 100}cm`

  var a = hom_from_0[2]
  var R0_3 = [[a[0][0], a[0][1], a[0][2]],
  [a[1][0], a[1][1], a[1][2]],
  [a[2][0], a[2][1], a[2][2]]]

  var R0_3inv = math.inv(R0_3)

  var R0_6 = [[-1, 0, 0],
  [0, -1, 0],
  [0, 0, 1]]

  var R3_6 = math.multiply(R0_3inv, R0_6)

}

function make_layout() {
  $(".after").append($('.sliders'))
  for (let i = 0; i < DH.length; i++) {
    $('.sliders').append(`<div class="angle_max${i} angle_max">`)
    $(`.angle_max${i}`).append(`<div id=angle${i}></div>`)
    $(`.angle_max${i}`).append(`<input min="0" type=number id=input_angle${i} class=input_max_angle placeholder="Max angle °">`)
    $('.sliders').append(`<input type="range" min="0" max="360" value="0" class="slider form-range" id="myRange${i}">`)
  }

  for (let i = 0; i < DH.length; i++) {
    document.getElementById(`angle${i}`).innerHTML = `Angle of ${i + 1}.joint = ${document.getElementById(`myRange${i}`).value}°`;
    document.getElementById(`myRange${i}`).oninput = function () {
      document.getElementById(`angle${i}`).innerHTML = `Angle of ${i + 1}. joint = ${document.getElementById(`myRange${i}`).value}°`
      UHLY.splice(i, 1)
      UHLY.splice(i, 0, parseInt(document.getElementById(`myRange${i}`).value))
      calculate_matricies()
      update_robot()
    }
    document.getElementById(`input_angle${i}`).oninput = function () {
      if (document.getElementById(`input_angle${i}`).value == '') {
        MAX_ANGLES.splice(i, 1)
        MAX_ANGLES.splice(i, 0, Infinity)
      }
      else {
        MAX_ANGLES.splice(i, 1)
        MAX_ANGLES.splice(i, 0, parseInt(document.getElementById(`input_angle${i}`).value))
      }
    }
  }
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
    var x = xpos
    var y = ypos
    var z = zpos
  }
  else {
    var x = POS_X_zaciatok
    var y = POS_Y_zaciatok
    var z = POS_Z_zaciatok
  }

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

    var xBodka = (x - X[X.length - 1]) / precision
    var yBodka = (y - Y[X.length - 1]) / precision
    var zBodka = (z - Z[X.length - 1]) / precision

    if (slow_down) SPEED_UP_VECTORS.push([xBodka, yBodka, zBodka])
    var docasne = []

    for (let i = 0; i < UHLY.length; i++) {
      var ThetaBodka = (JtJJtinv[0][i] * xBodka + JtJJtinv[1][i] * yBodka + JtJJtinv[2][i] * zBodka) * 50
      var uhol = UHLY[i] + ThetaBodka
      docasne.push(Math.round(uhol * 100) / 100)
      if (!slow_down) {
        FOR_USER_ANGLES2[i].push(Math.round(uhol * 100) / 100)
      }
      UHLY.splice(i, 1)
      UHLY.splice(i, 0, uhol)
      if (negative_angle_exception && uhol < 0) {
        alerts("Negative angle has been calculated, if you wish to continue with this trajectory, disable negative angle exception.")
        update_trajectory()
        update_robot()
        return
      }
      if (uhol > MAX_ANGLES[i]) {
        alerts("Maximum angle of some of your joint has been preceeded. Choose different trajectory.")
        update_trajectory()
        update_robot()
        return
      }
    }
    if (plot) {
      FOR_USER_ANGLES.push(docasne)
      TRAJECTORY_X.push(X[X.length - 1])
      TRAJECTORY_Y.push(Y[X.length - 1])
      TRAJECTORY_Z.push(Z[X.length - 1])
    }

    var rozdiel = ((x - X[X.length - 1]) ** 2 + (y - Y[X.length - 1]) ** 2 + (z - Z[X.length - 1]) ** 2) ** 1 / 2
    if (rozdiel < 0.1) {
      update_robot()
      update_trajectory()
      return
    }
    if (i == 999) {
      update_robot()
      update_trajectory()
      return
    }
  }
}

function get_constant_jacobian() {
  var xBodka = (xpos - X[X.length - 1]) / precision
  var yBodka = (ypos - Y[X.length - 1]) / precision
  var zBodka = (zpos - Z[X.length - 1]) / precision
  //ID: -21,3.5,-7,z,,,,-21,38.5,-7,x,2,,,17.5,38.5,-7,x,2,,,17.5,14,-7,y,,,2,17.5,14,-45.5,e,2,,2;12;11;10;16;15;17;
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
    /*var a = math.add(JJt, 100)
    console.log(a)
    var ainv = math.inv(a)
    var JtJJtinv = math.multiply(Jt, ainv)*/
    //console.log(JJt)
    var JJtinv = math.inv(JJt)
    var JtJJtinv = math.multiply(Jt, JJtinv)

    var docasne = []
    for (let i = 0; i < UHLY.length; i++) {
      var ThetaBodka = (JtJJtinv[0][i] * xBodka + JtJJtinv[1][i] * yBodka + JtJJtinv[2][i] * zBodka) * 10
      var uhol = UHLY[i] + ThetaBodka
      FOR_USER_ANGLES2[i].push(Math.round(uhol * 100) / 100)
      UHLY.splice(i, 1)
      UHLY.splice(i, 0, uhol)
      if (negative_angle_exception && uhol < 0) {
        alerts("Negative angle has been calculated, if you wish to continue with this trajectory, disable negative angle exception.")
        update_trajectory()
        update_robot
        return
      }
      if (uhol > MAX_ANGLES[i]) {
        alerts("Maximum angle of some of your joint has been preceeded. Choose different trajectory.")
        update_trajectory()
        update_robot
        return
      }
      docasne.push(Math.round(uhol * 100) / 100)
    }
    FOR_USER_ANGLES.push(docasne)
    var rozdiel = ((xpos - X[X.length - 1]) ** 2 + (ypos - Y[X.length - 1]) ** 2 + (zpos - Z[X.length - 1]) ** 2) ** 1 / 2
    TRAJECTORY_X.push(X[X.length - 1])
    TRAJECTORY_Y.push(Y[X.length - 1])
    TRAJECTORY_Z.push(Z[X.length - 1])
    if (rozdiel < 0.1) {
      update_robot()
      update_trajectory()
      return
    }
    if (i == 999) {
      update_robot()
      update_trajectory()
      return
    }
  }
}

document.querySelector(".compute").addEventListener('click', function () {

  if (speed_mode == 1) get_constant_jacobian()
  else if (speed_mode == 2) get_slow_down_jacobian(true, true)
  else {
    get_slow_down_jacobian(true, false)
    get_slow_down_jacobian(false, true)
    get_slow_down_jacobian(true, false)
  }
});

document.querySelector('.new-x').addEventListener('change', (event) => {
  xpos = event.target.value

  update_point()

});
document.querySelector('.new-y').addEventListener('change', (event) => {
  ypos = event.target.value
  update_point()

});
document.querySelector('.new-z').addEventListener('change', (event) => {
  zpos = event.target.value

  update_point()

});

document.querySelector(".precision-value").addEventListener("change", function () {
  var text
  var span
  if (document.querySelector(`.precision-value`).value == 0) {
    span = `<span style="color:green;"> Low <span>`
    text = "precision is on average 8 calculations per centimeter of trajectory."
    precision = 15
  }
  else if (document.querySelector(`.precision-value`).value == 1) {
    span = `<span style="color:darkorange;"> Meduim <span>`
    text = "precision is on average 14 calculations per centimeter of trajectory."
    precision = 25
  }
  else {
    span = `<span style="color:red;"> High <span>`
    text = "precision is on average 20 calculations per centimeter of trajetory."
    precision = 30
  }
  var element = $(".slider-text-output")
  element.empty();
  element.append($(`<div>${span + text}<div>`))
})

document.querySelector(".clear").addEventListener("click", function () {
  TRAJECTORY_X = []
  TRAJECTORY_Y = []
  TRAJECTORY_Z = []
  FOR_USER_ANGLES = []
  FOR_USER_ANGLES2.forEach(array => {
    array = []
  });
  update_trajectory()
})

function update_robot() {
  Plotly.restyle('myDiv', {
    x: [X],
    y: [Y],
    z: [Z],
  }, 0)
}

function update_point() {
  Plotly.restyle('myDiv', {
    x: [[xpos, xpos]],
    y: [[ypos, ypos]],
    z: [[zpos, zpos]],
  }, 1)
}
function update_trajectory() {
  Plotly.restyle('myDiv', {
    x: [TRAJECTORY_X],
    y: [TRAJECTORY_Y],
    z: [TRAJECTORY_Z],
  }, 2)
}


var rad = document.mode.spdmode;
var prev = null;
for (var i = 0; i < rad.length; i++) {
  rad[i].addEventListener('change', function () {
    if (this !== prev) {
      prev = this;
    }
    speed_mode = this.value
  });
}

var radq = document.type.data;
var prevq = null;
for (var i = 0; i < radq.length; i++) {
  radq[i].addEventListener('change', function () {
    (prevq) ? console.log(prevq.value) : null;
    if (this !== prevq) {
      prevq = this;
    }
    var text
    output_type = this.value
    if (this.value == 2) text = "After pressing this button, you will recieve angles of your joints for current trajectory as Array of arrays."
    else text = "After pressing this button, you will recieve angles of your joints for current trajectory as Array for each joint."
    document.querySelector(".type-output").innerHTML = text
  });
}

document.querySelector("#negative_angle").addEventListener("change", function () {
  var checkBox = document.getElementById("negative_angle");
  if (checkBox.checked == true) {
    document.querySelector(`.negative-angle-text`).innerHTML = "Prevent computations of negative angles"
    negative_angle_exception = true
  } else {
    document.querySelector(`.negative-angle-text`).innerHTML = "Ignore computations of negative angles"
    negative_angle_exception = false
  }
})

document.querySelector(".get_angles").addEventListener("click", function () {
  var text
  if (FOR_USER_ANGLES.length > 0) {

    var g = 0
    FOR_USER_ANGLES.forEach(e => {
      e.push(0)
      e.push(0)
      e.push(0)
      g++;
      console.log(`MoveAbsJ JointTarget_${g},v10,z100,tool0\WObj:=wobj0;`)
    });
    // CONST jointtarget JointTarget_1:=[[13,14,15,16,17,18],[9E+09,9E+09,9E+09,9E+09,9E+09,9E+09]];
    if (output_type == 2) text = JSON.stringify(FOR_USER_ANGLES)
    else text = JSON.stringify(FOR_USER_ANGLES2)
    document.querySelector(".type-output").innerHTML = ''
    document.querySelector(".type-output").append(text)

  }
  else {
    if (!$(".ml")[0].checked) text = "After pressing this button, you will recieve angles of your joints for current trajectory as Array of arrays."
    else text = "After pressing this button, you will recieve angles of your joints for current trajectory as Array for each joint."
    document.querySelector(".type-output").innerHTML = text
  }
})



function alerts(text) {
  $('.alrt').remove()
  $('.close').remove()
  $('.alertDiv').append($(`<div class=alrt role=alert>${text}</div>`));
  $('.alrt').addClass('alert alert-warning alert-dismissible fade show');
  $('.alrt').append('<button type=button class=close data-dismiss=alert aria-label=Close></button>');
  $('.close').append('<span aria-hidden="true">&times;</span>');

}