let video;
let poseNet;
let poses = [];
let prevPose = [];
let first = true; // checks if its the first iteration
let sound = new Audio("assets/ringSoundEffect.mp3");

// analysis
let t = 0;
let dt = 0;
let info = {
    headTurn: {
        name: "Head Turning",
        show: true,
        val: 0,
        format: function(x) {
            return x > 0;
        }
    },
    headTurnRep: {
        name: "Head Turning Reports",
        show: true,
        val: 0,
        format: undefined
    },
    handsUp: {
        name: "Hands up",
        show: true,
        val: 0,
        format: undefined
    },
    fallRep: {
        name: "Fall Reports",
        show: true,
        val: 0,
        format: undefined
    }
};

// runs on start
function setup() {
    const canvas = createCanvas(640, 480);
    canvas.parent("videoContainer");

    // Video capture
    video = createCapture(VIDEO);
    video.size(width, height);
    // Create a new poseNet method with a single detection
    poseNet = ml5.poseNet(video, modelReady);
    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on("pose", function(results) {
        poses = results;
    });
    // console.log(poses);
    video.hide();
}

// runs each frame
function draw() {
    image (video, 0, 0, width, height);

    // process
    baseProcess();
    if(!first){
        // put all checkers here
        checkHeadTurn();
        checkHandsUp();
        checkFall();
    }
    first = false;
    prevPose = poses;

    // update info display
    displayInfo();
    
    // We can call both functions to draw all keypoints and the skeletons
    drawKeypoints();
}
function modelReady(){
    select("#status").html("");
}
function drawKeypoints(){
    for(let i=0; i<poses.length; i++){
        let pose = poses[i].pose;
        for(let j=0; j<pose.keypoints.length; j++){
            let keypoint = pose.keypoints[j];
            fill(255, 0, 0);
            noStroke();
            ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        }
    }
}

// PROCESSING

// processing to be run first
function baseProcess() {
    let t0 = t;
    t = performance.now()*0.001;
    dt = t-t0;
}

// head turn
let headTurnSec = 0;
let headTurnDelay = 0;
function checkHeadTurn(){
    // get input
    if(poses.length == 0 || prevPose.length == 0) return;
    let dLeftEye = abs(poses[0].pose.leftEye.x-prevPose[0].pose.leftEye.x);
    let dRightEye = abs(poses[0].pose.rightEye.x-prevPose[0].pose.rightEye.x);

    // is turning?
    let iTurn = info.headTurn;
    if(dLeftEye >= 15 && dLeftEye-dRightEye >= 5){ // check turn vs move
        iTurn.val = 1;
        headTurnDelay = 0;
    } else if(dRightEye >= 15 && dRightEye-dLeftEye >= 5){
        iTurn.val = 1;
        headTurnDelay = 0;
    } else {
        iTurn.val = max(0, iTurn.val-dt);
        headTurnDelay += dt;
    }

    // turning report
    if (headTurnDelay >= 15) { // reset turn sec after 15 seconds of no activity
        headTurnSec = 0;
        headTurnDelay = 0;
        console.log("Head turn seconds is being reset.");
    }
    headTurnSec += dt*(iTurn.val);
    if (headTurnSec >= 3) {
        // REPORT
        info.headTurnRep.val++;
        headTurnSec = 0;
        alert("Person #1 has been turning their head a suspicious number of times.");
        sound.play();
    }
}

// hands up
let handsUpTime = 0;
function checkHandsUp() {
    if(poses.length == 0 || poses[0].pose.leftWrist.confidence < 0.01 || poses[0].pose.rightWrist.confidence < 0.01) return;
    let wrist = (poses[0].pose.leftWrist.y+poses[0].pose.rightWrist.y)/2;
    let eye = (poses[0].pose.leftEye.y+poses[0].pose.rightEye.y)/2;
    if(wrist > eye+50){
        info.handsUp.val = false;
        handsUpTime = 0;
    } else{
        info.handsUp.val = true;
        handsUpTime += dt;
        if(handsUpTime >= 5){
            handsUpTime = 0;
            alert("Person #1 has been holding their hands up for a suspicious amount of time.");
            sound.play();

        }
    }
}

// fall
let fallDealy = 15;
function checkFall() {
    if(poses.length == 0 || prevPose.length == 0) return;
    let pose1 = poses[0].pose;
    let pose0 = prevPose[0].pose;
    let head1 = (pose1.leftEye.y+pose1.rightEye.y + pose1.nose.y + pose1.leftEar.y+pose1.rightEar.y)/5;
    let head0 = (pose0.leftEye.y+pose0.rightEye.y + pose0.nose.y + pose0.leftEar.y+pose0.rightEar.y)/5;
    let dHead = (head1-head0)*dt;
    if (dHead >= 0.6 && fallDealy >= 2) {
        fallDealy = 0;
        info.fallRep.val++;
        alert("Person #1 may have suspiciously fallen over.");
    } else {
        fallDealy += dt;
    }
    console.log(dHead);
}

// display info
function displayInfo() {
    let temp = "";
    for (let key in info) {
        let elem = info[key];
        if (typeof(elem.name) != "string") {elem.name = "(invalid name) "+key;}
        if (typeof(elem.show) != "boolean") {elem.show = false;}

        // add text
        if (elem.show) {
            if (typeof(elem.format) == "function") {
                temp += elem.name+": "+elem.format(elem.val);
            } else {
                temp += elem.name+": "+elem.val;
            }
            temp += "<br>";
        }
    }
    select("#info-body").html(temp);
}