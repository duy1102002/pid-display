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
  