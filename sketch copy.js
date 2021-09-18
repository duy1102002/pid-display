let my_width_desired = 500;
let my_width = 500;
let layout;

// drone simulation
let g = -9.81
let p_desired = 50

// system update
function next_state(a, state, dt){
    var aeff = a + g;
    var position = state[0];
    var velocity = state[1];
    //integration by velocity verlet algorithm
    position += velocity*dt + 0.5*aeff*dt*dt;
    velocity += aeff*dt;
    return [position,velocity];
}

function simulate_drone(controller, num_steps = 1000) {
    var dt = 0.02;
    var state = [0,0];
    var pos_list=[state[0]];
    var time_list = [0];
    var a = 0;
    for (let i = 0; i < num_steps; i++) {
        a = controller.get_control(state[0], dt);
        // upwards acceleration is positive (>0)
        // and limited by power supply (<100)
        a = clip(a, 0, 100);
        
        state = next_state(a, state, dt);
        pos_list.push(state[0]);
        time_list.push((i+1)*dt);
    }
    return [time_list, pos_list];
}

// temperature simulation
const alpha = 1;
const beta = 40;
const T_ambient =20;
const T_desired = 37;
const T_start = 25;

function next_step(u, T, dt) {
  return T + alpha * (T_ambient - T) * dt + beta * u * dt;
}

class Controller {
  constructor() {
    this.name ='Controller';
  }

  get_control() {
    return 0;
  }
}

class sillyController extends Controller {
  constructor() {
    super();
    this.name = 'silly Controller';
  }

  get_control() {
    return 0;
  }
}

class P_Controller extends Controller {
  constructor(set_point, kP) {
    super();
    this.kP = kP;
    this.set_point = set_point;
    this.name = 'P Controller'
  }

  get_control(T, dt) {
    var error = this.set_point - T;
    return this.kP * error;
  }
}

class PI_Controller extends P_Controller {
  constructor(set_point, kP, kI) {
    super(set_point, kP);
    this.kI = kI;
    this.iterm = 0;
    this.name = 'PI Controller'
  }

  get_control(T, dt) {
    var error = this.set_point - T;
    this.iterm += this.kI * error * dt; 
    return this.kP * error + this.iterm;
  }
}

class PID_Controller extends PI_Controller {
  constructor(set_point, kP, kI, kD) {
    super(set_point, kP, kI);
    this.kD = kD;
    this.derivative_term = 0;
    this.last_error = null;
    this.name = 'PID Controller'
  }

  get_control(T, dt) {
    var error = this.set_point - T;
    this.iterm += this.kI * error * dt;
    if (this.last_error != null) {
      this.derivative_term = (error - this.last_error)/dt * this.kD;
    }
    this.last_error = error;

    return this.kP * error + this.iterm + this.derivative_term;
  }
}


function clip(x, xmin, xmax) {
  if (x < xmin) {
    return xmin;
  }
  if (x > xmax) {
    return xmax;
  }
  return x;
}


function simuate_loop(controller) {
  var dt = 0.1;
  var T = T_start;
  var T_list = [T];
  var time_list = [0];

  const num_steps = 20;

  for (i = 0; i < num_steps; i++) {
    var u = controller.get_control(T, dt);
    u = clip(u, 0, 1);
    console.log(u);
    T = next_step(u, T, dt);
    T_list.push(T);
    time_list.push((i+1)*dt);
  }
  return [time_list, T_list];

}

function to_width_string(width_input){
  return Math.floor( width_input ).toString()+"px";
}


function drone_update() {
  var states;
  // var controller = new sillyController();
  //  var controller = new P_Controller(T_desired, slider_p.value()/10000.0);
  //  var controller = new PI_Controller(T_desired, slider_p.value()/10000.0,
  //                                     slider_i.value()/10000.0);
  var controller = new PID_Controller(p_desired, slider_p1.value()/100.0,
                                      slider_i1.value()/100.0,
                                      slider_d1.value()/100.0);  

  states = simulate_drone(controller);
  var trace_T = {
    x: states[0],
    y: states[1],
    name: 'T',
    type: 'line'
  };

  var trace_T_desired = {
    x: states[0],
    y: Array(states[0].length).fill(p_desired),
    name: 'T_desired',
    type: 'line;'
  };

  
  layout1.width=my_width;
  layout1.height=my_width;

  slider_p_text1.html('P = ' + my_display_float(slider_p1.value()/100.0,2)+' ');
  slider_p1.style('width', to_width_string(0.3*my_width));

  slider_i_text1.html('I = ' + my_display_float(slider_i1.value()/100.0,2)+' ');
  slider_i1.style('width', to_width_string(0.3*my_width));

  slider_d_text1.html('D = ' + my_display_float(slider_d1.value()/100.0,2)+' ');
  slider_d1.style('width', to_width_string(0.3*my_width));

  super_group1.style('width', to_width_string(0.66*my_width));
  super_group1.position(0.3*my_width,1.0*my_width);
  
  Plotly.newPlot('myDroneDiv', [trace_T, trace_T_desired], layout1);

}


function temperature_update() {
  let states;
  // var controller = new sillyController();
  //  var controller = new P_Controller(T_desired, slider_p.value()/10000.0);
   var controller = new PI_Controller(T_desired, slider_p.value()/10000.0,
                                      slider_i.value()/10000.0);
  // var controller = new PID_Controller(T_desired, slider_p.value()/10000.0,
  //                                     slider_i.value()/10000.0,
  //                                     slider_d.value()/10000.0);  
  states = simuate_loop(controller);

  var trace_T = {
    x: states[0],
    y: states[1],
    name: 'T',
    type: 'line'
  };

  var trace_T_desired = {
    x: states[0],
    y: Array(states[0].length).fill(T_desired),
    name: 'T_desired',
    type: 'line;'
  };

  
  layout.width=my_width;
  layout.height=my_width;

  slider_p_text.html('P = ' + my_display_float(slider_p.value()/10000.0,2)+' ');
  slider_p.style('width', to_width_string(0.3*my_width));

  slider_i_text.html('I = ' + my_display_float(slider_i.value()/10000.0,2)+' ');
  slider_i.style('width', to_width_string(0.3*my_width));

  slider_d_text.html('D = ' + my_display_float(slider_d.value()/10000.0,4)+' ');
  slider_d.style('width', to_width_string(0.3*my_width));

  super_group.style('width', to_width_string(0.66*my_width));
  super_group.position(0.3*my_width,0);
  
  Plotly.newPlot('myDiv', [trace_T, trace_T_desired], layout);

}

function draw_update() {

  drone_update();   
  temperature_update();

}


let super_group;
let group_p;
let slider_p;
let slider_i;
let slider_d;

let super_group1;
let group_p1;
let slider_p1;
let slider_i1;
let slider_d1;

let plot_type = 0;


function setup() {
  //plotly layout
  layout = {
    autosize: false,
    width: my_width,
    height: my_width,
    automargin: true,
    showlegend: false,
    font: {
      size: 16
    },
    title: 'Temperature PID',
    xaxis: {
      title: 'Time',
    },
    yaxis: {
    title: 'Temperature',
    showline: false,
    range: [19, 42]
  }

  };

  layout1 = {
    autosize: false,
    width: my_width,
    height: my_width,
    automargin: true,
    showlegend: false,
    font: {
      size: 16
    },
    title: 'Drone PID',
    xaxis: {
      title: 'Time',
    },
    yaxis: {
    title: 'Height',
    showline: false,
    range: [-75, 75]
  }

  };

  super_group = createDiv('');

  group_p = createDiv('');
  group_p.parent(super_group);

  slider_p = createSlider(0, 10000, 0);
  slider_p.input(temperature_update);
  slider_p.parent(group_p);
  slider_p_text = createSpan();
  slider_p_text.parent(group_p);
  slider_p_text.style('font-size', '18px');

  slider_i = createSlider(0, 2000, 0);
  slider_i.input(temperature_update);
  slider_i.parent(group_p);
  slider_i_text = createSpan();
  slider_i_text.parent(group_p);
  slider_i_text.style('font-size', '18px');

  slider_d = createSlider(-30, 30, 0);
  slider_d.input(temperature_update);
  slider_d.parent(group_p);
  slider_d_text = createSpan();
  slider_d_text.parent(group_p);
  slider_d_text.style('font-size', '18px');

  frameRate(10);
  temperature_update();

  // super_group1 = document.getElementById('myDronePID');
  super_group1 = createDiv('');
  group_p1 = createDiv('');
  group_p1.parent(super_group1);

  slider_p1 = createSlider(0, 1000, 0);
  slider_p1.input(draw_update);
  slider_p1.parent(group_p1);
  slider_p_text1 = createSpan();
  slider_p_text1.parent(group_p1);
  slider_p_text1.style('font-size', '18px');

  slider_i1 = createSlider(0, 50, 0);
  slider_i1.input(draw_update);
  slider_i1.parent(group_p1);
  slider_i_text1 = createSpan();
  slider_i_text1.parent(group_p1);
  slider_i_text1.style('font-size', '18px');

  slider_d1 = createSlider(-300, 300, 0);
  slider_d1.input(draw_update);
  slider_d1.parent(group_p1);
  slider_d_text1 = createSpan();
  slider_d_text1.parent(group_p1);
  slider_d_text1.style('font-size', '18px');


  drone_update();   

  createCanvas(400, 400);
}






function draw() {

}

function windowResized() {
  //console.log(windowWidth);
  draw_update();
}


function my_display_float(x,n) { // simple helper
  return Number.parseFloat(x).toFixed(n);
}