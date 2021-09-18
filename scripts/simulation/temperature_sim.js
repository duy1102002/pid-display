// temperature simulation
const alpha = 1;
const beta = 40;
const T_ambient =20;
const T_desired = 37;
const T_start = 25;

function next_step(u, T, dt) {
  return T + alpha * (T_ambient - T) * dt + beta * u * dt;
}

function simuate_loop(controller, num_steps=20) {
  var dt = 0.1;
  var T = T_start;
  var T_list = [T];
  var time_list = [0];

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
