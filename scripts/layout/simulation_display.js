
class sliderInfo {
    constructor(slider, sliderRatio) {
      this.slider = slider;
      this.sliderRatio = sliderRatio;
    }
  
    get_slider() {
      return this.slider;
    }
  
    get_sliderRatio() {
      return this.sliderRatio;
    }
  
  }
  
  class SimulationDisplay {
    constructor(divId, update, sliderP, sliderI, sliderD) {
      this.divId = divId;
      this.name ='SimulationDisplay';
  
      this.superGroup = null;
      this.group = null;
      this.sliderP = sliderP.get_slider();
      this.sliderI = sliderI.get_slider();
      this.sliderD = sliderD.get_slider();
      this.sliderPInfo = null;
      this.sliderIInfo = null;
      this.sliderDInfo = null;
      this.sliderPRatio = sliderP.get_sliderRatio();
      this.sliderIRatio = sliderI.get_sliderRatio();
      this.sliderDRatio = sliderD.get_sliderRatio();
      this.layout = null;
      this.update = update;
    }
  
    layout_init(layout) {
  
      this.layout = layout;
  
      this.superGroup = createDiv('');
      this.group = createDiv('');
      this.group.parent(this.superGroup);
  
      this.sliderP.input(this.update);
      this.sliderP.parent(this.group);
      this.sliderPInfo = createSpan();
      this.sliderPInfo.parent(this.group);
      this.sliderPInfo.style('font-size', '18px');
  
      this.sliderI .input(this.update);
      this.sliderI .parent(this.group);
  
      this.sliderIInfo = createSpan();
      this.sliderIInfo.parent(this.group);
      this.sliderIInfo.style('font-size', '18px');
  
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
  