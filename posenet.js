let video;
let poseNet;
let poses = [];
let prevPose = [];
let first = true; // checks if its the first iteration

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
<<<<<<< HEAD
        trgVal: 1
    },
    handsUp: {
        name: "Hands up",
        val: 0,
        trgVal: 0.001
    }
=======
        format: undefined
    },
>>>>>>> becdcdf913f18a21a5459dfe099ee08d09a35613
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
    checkHandsUp();
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
    // console.log("time: "+t+" "+dt);
}

// head turn
let headTurnSec = 0;
function checkHeadTurn(){
    // get input
    if(poses.length==0 || prevPose.length==0) return;
    let dLeftEye = abs(poses[0].pose.leftEye.x-prevPose[0].pose.leftEye.x);
    let dRightEye = abs(poses[0].pose.rightEye.x-prevPose[0].pose.rightEye.x);

    // is turning?
<<<<<<< HEAD
    {
        let currInfo = info.headTurn;
        if(dLeftEye >= 15 && dLeftEye-dRightEye >= 5){ // check turn vs move
            headTurns++;
            currInfo.val = 1;
        } else if(dRightEye >= 15 && dRightEye-dLeftEye >= 5){
            headTurns++;
            currInfo.val = 1;
        } else {
            currInfo.val -= dt;
            currInfo.val = max(0, currInfo.val);
        }
        //console.log(dLeftEye + " " + dRightEye);
=======
    let iTurn = info.headTurn;
    if(dLeftEye >= 15 && dLeftEye-dRightEye >= 5){ // check turn vs move
        iTurn.val = 1;
        headTurnSec += dt;
    } else if(dRightEye >= 15 && dRightEye-dLeftEye >= 5){
        iTurn.val = 1;
        headTurnSec += dt;
    } else {
        iTurn.val = max(0, iTurn.val-dt);
>>>>>>> becdcdf913f18a21a5459dfe099ee08d09a35613
    }
    // console.log(dLeftEye + " " + dRightEye);

<<<<<<< HEAD
    // turning significant?
    {
        let currInfo = info.headTurnSus;
        //console.log("head turns: "+headTurns);
        if (headTurns >= 5){
            // CALL A FUNCTION TO NOTIFY
            headTurns = 0;
            currInfo.val = 1;
        } else {
            currInfo.val -= dt;
            currInfo.val = max(0, currInfo.val);
        }
=======
    // turn amount significant
    if (headTurnSec >= 5) {
        // REPORT
        info.headTurnRep++;
        headTurnSec = 0;
>>>>>>> becdcdf913f18a21a5459dfe099ee08d09a35613
    }
}
function checkHandsUp(){
    if(poses.length==0 || poses[0].pose.leftWrist.confidence<0.01 || poses[0].pose.rightWrist.confidence<0.01) return;
    let wrist = (poses[0].pose.leftWrist.y+poses[0].pose.rightWrist.y)/2;
    let eye = (poses[0].pose.leftEye.y+poses[0].pose.rightEye.y)/2;
    console.log("Wrist:"+eye + " " + wrist);
    if(wrist>eye+50){
        info.handsUp.val = 0;
    }
    else{
        info.handsUp.val = 1;
    }

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