let video;
let poseNet;
let poses = [];
let prevPose = [];
let first = true; // checks if its the first iteration

// analysis
let t = 0;
let dt = 0;
let headTurns = 0;
let info = {
    headTurning: 0,
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
    console.log(poses);
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
    }
    first = false;
    prevPose = poses;

    // update info display
    displayInfo();
    
    // We can call both functions to draw all keypoints and the skeletons
    drawKeypoints();
}
function modelReady(){
    select("#status").html("model Loaded");
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

// CHECKERS
function baseProcess() {
    let t0 = t;
    t = performance.now()*0.001;
    dt = t-t0;
    console.log("time: "+t+" "+dt);
}
function checkHeadTurn(){
    if(poses.length==0 || prevPose.length==0) return;
    let dLeftEye = abs(poses[0].pose.leftEye.x-prevPose[0].pose.leftEye.x);
    let dRightEye = abs(poses[0].pose.rightEye.x-prevPose[0].pose.rightEye.x);

    if(dLeftEye>10 && dRightEye<=9){ // check turn vs move
        headTurns++;
        info.headTurning = 1;
    } else if(dRightEye>10 && dLeftEye<=9){
        headTurns++;
        info.headTurning = 1;
    } else {
        info.headTurning -= dt;
        info.headTurning = max(0, info.headTurning);
    }
    console.log(dLeftEye + " " + dRightEye);

    console.log("head turns: "+headTurns);
    if(headTurns >= 5){
        // CALL A FUNCTION TO NOTIFY
        headTurns = 0;
    } else {
        
    }
}
function displayInfo() {
    let temp = "";
    for (let key in info) {
        if (info[key] > 0) {temp += key+": true";}
        else {temp += key+": false";}
    }
    select("#info-body").html(temp);
}