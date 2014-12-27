var keypress = require("keypress");
keypress(process.stdin);

var stream = process.stdout;
var running = false;
var scramble = true;
var pressed = false;
var times = 0;
var interval;
var start;

var scrambleList = [
  "U",
  "D",
  "L",
  "R",
  "F",
  "B",
  "U'",
  "D'",
  "L'",
  "R'",
  "F'",
  "B'",
  "U2",
  "D2",
  "L2",
  "R2",
  "F2",
  "B2",
];
var scrambling = function(callback){
  var scrambled = "";
  var xPrevious;
  var randomScramble = function(cb){
    for (i=0; i < 20; i++) {
      var x = Math.floor(Math.random() * 18);
      if (x == xPrevious) {
        x = Math.floor(Math.random() * 18);
        xPrevious = x;
      } else {
        xPrevious = x;
      }
      scrambled = scrambled+scrambleList[x]+" ";
    }
    cb();
  }
  randomScramble(function(){
    callback(scrambled);
  });
}

var elapsedTime = function(){
  var ms = Date.now() - start;
  var minutes = Math.floor((ms / 1000) / 60);
  var seconds = Math.floor((ms / 1000) % 60);
  if (seconds < 10) seconds = '0'+seconds;
  if (minutes < 10) minutes = '0'+minutes;
  var m = Math.floor((ms / 1000) % 360);
  return minutes+":"+seconds+":";
}

var speedStart = function(){
  var ms = 0;
  times++;
  start = Date.now();
  interval = setInterval(function(){
    if (ms < 100) {
      ms+=1;
    } else {
      ms=0;
    }
    stream.clearLine();
    stream.cursorTo(0);
    stream.write("node-speedstack >>> "+elapsedTime()+ms+" ");
  }, 10);

}
var speedStop = function(){
  clearInterval(interval);
  console.log("\nnode-speedstack >>> Times: "+times+", Average: ");
  ready();
}



process.stdin.on('keypress', function(ch,key){
  if (key && key.name == "q"){
    console.log("\nexited.\n");
    process.exit();
  }
  if (key && key.name == "s"){
    if (scramble){
      scramble = false;
    } else {
      scramble = true;
    }
  }
  if (key && key.name == "c"){
    times = 0;
    avg = 0;
    console.log("\nnode-speedstack >>> session cleared. ok.");
    ready();
  }
  if (key && key.name == "space"){
    if(!running) {
      running = true;
      speedStart();
    } else {
      running = false;
      speedStop();
    }
  }
});
process.stdin.setRawMode(true);
var ready = function(){
  scrambling(function(s){
    if (scramble) {
      console.log("\nnode-speedstack >>> "+s);
    }
    stream.clearLine();
    stream.cursorTo(0);
    stream.write("node-speedstack >>> Ready? ");
  });
}
ready();
