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