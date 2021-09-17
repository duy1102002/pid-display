let my_width_desired = 500;
let my_width = 500;
let layout;

function to_width_string(width_input){
  return Math.floor( width_input ).toString()+"px";
}


class sliderInfo {
  constructor(slider, sliderRatio) {
    this.slider = slider;
    this.sliderRatio = sliderRatio;
  }

  slider() {
    return this.slider;
  }

  sliderRatio() {
    return this.sliderRatio;
  }
}

class SimulationDisplay {
  constructor(divId, update, sliderP, sliderI, sliderD) {
    this.divId = divId;
    this.name ='SimulationDisplay';

    this.superGroup = null;
    this.group = null;
    this.sliderP = sliderP.slider();
    this.sliderI = sliderI.slider();
    this.sliderD = sliderD.slider();
    this.sliderPInfo = null;
    this.sliderIInfo = null;
    this.sliderDInfo = null;
    this.sliderPRatio = sliderP.sliderRatio();
    this.sliderIRatio = sliderI.sliderRatio();
    this.sliderDRatio = sliderD.sliderRatio();
    this.layout = null;
    this.update = update;
  }

  layout_init(layout) {

    this.layout = layout;

    this.superGroup = createDiv('');
    this.group = createDiv('');
    this.group.parent(this.superGroup);

    // this.sliderP = createSlider(0, 10000, 0);
    this.sliderP.input(this.update);
    this.sliderP.parent(this.group);
    this.sliderPInfo = createSpan();
    this.sliderPInfo.parent(this.group);
    this.sliderPInfo.style('font-size', '18px');

    // this.sliderI  = createSlider(0, 2000, 0);
    this.sliderI .input(this.update);
    this.sliderI .parent(this.group);

    this.sliderIInfo = createSpan();
    this.sliderIInfo.parent(this.group);
    this.sliderIInfo.style('font-size', '18px');

    // this.sliderD = createSlider(-30, 30, 0);
    this.sliderD.input(this.update);
    this.sliderD.parent(this.group);
    this.sliderDInfo = createSpan();
    this.sliderDInfo.parent(this.group);
    this.sliderDInfo.style('font-size', '18px'); 

    var plotDiv = document.createElement('div');
    plotDiv.id = this.divId;
    document.body.appendChild(plotDiv);

  }

  layout_common_update(states, desired) {
    if (this.sliderPInfo != null) {
      this.layout_slider_update();
      this.group_update();
      this.plotly_update(states, desired);
    }
  }

  layout_slider_update() {
    if (this.sliderPInfo != null) {
      this.sliderPInfo.html('P = ' + my_display_float(this.sliderP.value()/this.sliderPRatio, 2)+' ');
      this.sliderP.style('width', to_width_string(0.3*my_width));
      
      this.sliderI.style('width', to_width_string(0.3*my_width));
      this.sliderIInfo.html('I = ' + my_display_float(this.sliderI.value()/this.sliderIRatio, 2)+' ');
      
      this.sliderD.style('width', to_width_string(0.3*my_width));
      this.sliderDInfo.html('D = ' + my_display_float(this.sliderD.value()/this.sliderDRatio, 2)+' ');
      
    }
  }

  KP() {
    return this.sliderP.value()/this.sliderPRatio;
  }

  KI() {
    return this.sliderI.value()/this.sliderIRatio;
  }

  KD() {
    return this.sliderD.value()/this.sliderDRatio;
  }

  group_update() {
    this.superGroup.style('width', to_width_string(0.66*my_width));
    // this.superGroup.position(0.3*my_width,1.0*my_width);
  }

  plotly_update(states, desired) {
      var trace_T = {
        x: states[0],
        y: states[1],
        name: 'T',
        type: 'line'
      };
    
      var trace_T_desired = {
        x: states[0],
        y: Array(states[0].length).fill(desired),
        name: 'T_desired',
        type: 'line;'
      };

      this.layout.width = my_width;
      this.layout.height = my_width;

      Plotly.newPlot(this.divId, [trace_T, trace_T_desired], this.layout);
  }
  
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
    sliderP.slider();
    smd = new SimulationDisplay('test1', temperature_update, sliderP, sliderI, sliderD);

    smd.layout_init(plotly_layout);
    temperature_update();
    createCanvas(400, 400);
}


function draw() {

}

function windowResized() {
  draw_update();
}


function my_display_float(x,n) { // simple helper
  return Number.parseFloat(x).toFixed(n);
}