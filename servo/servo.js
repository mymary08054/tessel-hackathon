const tessel = require('tessel');
// var os = require('os');
// const http = require('http');
// const port = 8888;

// const av = require('tessel-av');
// const camera = new av.Camera({
//   width: 320,
//   height: 240,
// });

// const server = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'image/jpg' });

//  camera.capture().pipe(response);

// }).listen(port, () => console.log('http://${os.hostname()}.local:${port}'));

// process.on("SIGINT", _ => server.close());


// const fs = require('fs');
// const path = require('path');
 
// // const av = require('tessel-av');
// // const camera = new av.Camera();
// const capture = camera.capture();
 


/////ambient

var ambientlib = require('ambient-attx4');

var ambient = ambientlib.use(tessel.port['A']);

let ambLvl = 0
let screamLvl = 0;
ambient.on('ready', function () {
 // Get points of light and sound data.
  setInterval( function () {
    ambient.getLightLevel( function(err, lightdata) {
      if (err) throw err;
      ambient.getSoundLevel( function(err, sounddata) {
        if (err) throw err;
        ambLvl = lightdata.toFixed(8)
        screamLvl = sounddata.toFixed(8);
        console.log("Light level:", lightdata.toFixed(8), " ", "Sound Level:", sounddata.toFixed(8));
      });
    });
  }, 500); // The readings will happen every .5 seconds
});

ambient.on('error', function (err) {
  console.log(err);
});

// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This servo module demo turns the servo around
1/10 of its full rotation  every 500ms, then
resets it after 10 turns, reading out position
to the console at each movement.
*********************************************/

// var tessel = require('tessel');
var servolib = require('servo-pca9685');

var servo = servolib.use(tessel.port['B']);

var servo1 = 1; // We have a servo plugged in at position 1
var servo2 = 5;

servo.on('ready', function () {
  var position = 0;  //  Target position of the servo between 0 (min) and 1 (max).

  servo.configure(servo1, 0.05, 0.12, function () {
    setInterval(function () {
      console.log('Position (in range 0-1):', position);

      if (ambLvl < 0.02) {
        servo.move(servo1, position);
      }
      })
      if(screamLvl > .6) {
        servo.move(servo1, position);
      }

      position += 0.1;
      if (position > 1) {
        position = 0; // Reset servo position
      }
    }, 500); // Every 500 milliseconds

  servo.configure(servo2, 0.05, 0.12, function () {
    setInterval(function () {
      console.log('Position (in range 0-1):', position);

      if (ambLvl < 0.02) {
        servo.move(servo2, position);
      }
      if(screamLvl > .6) {
        servo.move(servo1, position);
      }
      // Increment by 10% (~18 deg for a normal servo)
      position += 0.1;
      if (position > 1) {
        position = 0; // Reset servo position
      }
    }, 200); // Every 500 milliseconds
  })
  });
