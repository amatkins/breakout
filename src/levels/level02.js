import Template from "./template";

let tempC = new Template(false);
let tempS = new Template(true, false);
let temp1 = new Template(true, true, 1, [1], ["green"]);
let temp2 = new Template(true, true, 2, [3, 1], ["green", "yellow"]);
let temp3 = new Template(true, true, 3, [5, 3, 1], ["green", "yellow", "orange"]);
let temp4 = new Template(true, true, 4, [10, 5, 3, 1], ["green", "yellow", "orange", "red"]);
let temp5 = new Template(true, true, 5, [25, 10, 5, 3, 1], ["green", "yellow", "orange", "red", "purple"]);

export default [
          [temp5.cast(2), temp5.cast(3), temp4.cast(2), temp5.cast(3), temp5.cast(2)],
  [temp2.cast(1), temp4.cast(2), tempC.cast(1), temp4.cast(2), temp4.cast(2), tempC.cast(1), temp4.cast(2), temp2.cast(1)],
          [temp3.cast(2), tempC.cast(1), temp3.cast(2), tempS.cast(2), temp3.cast(2), tempC.cast(1), temp3.cast(2)],
  [temp4.cast(1), temp2.cast(2), tempC.cast(1), temp2.cast(2), temp2.cast(2), tempC.cast(1), temp2.cast(2), temp4.cast(1)],
          [temp1.cast(2), temp1.cast(3), temp2.cast(2), temp1.cast(3), temp1.cast(2)]
]
