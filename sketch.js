let my_width_desired = 500;
let my_width = 500;
let layout;

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



}


function temperature_update() {
  let states;
  // var controller = new sillyController();
  //  var controller = new P_Controller(T_desired, slider_p.value()/10000.0);
   var controller = new PI_Controller(T_desired, smd.KP(), smd.KI());
  // var controller = new PID_Controller(T_desired, slider_p.value()/10000.0,
  //                                     slider_i.value()/10000.0,
  //                                     slider_d.value()/10000.0);  
  states = simuate_loop(controller);

  smd.layout_common_update(states, T_desired);

}

let smd = null;
var sliderP = null;
var sliderI = null;
var sliderD = null;

function setup() {

  plotly_layout = {
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
    sliderP = new sliderInfo(createSlider(0, 10000, 0), 10000.0);
    sliderI = new sliderInfo(createSlider(0, 2000, 0), 10000.0);
    sliderD = new sliderInfo(createSlider(-30, 30, 0), 10000.0);

    smd = new SimulationDisplay('test1', temperature_update, sliderP, sliderI, sliderD);

    smd.layout_init(plotly_layout);
    temperature_update();
    createCanvas(400, 400);
}


function draw() {

}

function windowResized() {
  temperature_update();
}


function my_display_float(x,n) { // simple helper
  return Number.parseFloat(x).toFixed(n);
}
