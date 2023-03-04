let video;
let poseNet;
let poses = [];
let prevPose = [];
let headTurns = 0;
let first = true; // checks if its the first iteration
function setup() {
    const canvas = createCanvas(640, 480);
    canvas.parent('videoContainer');

    // Video capture
    video = createCapture(VIDEO);
    video.size(width, height);
    // Create a new poseNet method with a single detection
    poseNet = ml5.poseNet(video, modelReady);
    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on('pose', function(results) {
        poses = results;
    });
    console.log(poses);
    video.hide();
}

function draw() {
    image (video, 0, 0, width, height);

    if(!first){
        // put all checkers here
        checkHeadTurn();
    }
    first = false;
    
    // We can call both functions to draw all keypoints and the skeletons
    drawKeypoints();
    prevPose = poses;
}
function modelReady(){
    select('#status').html('model Loaded')
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
function checkHeadTurn(){
    if(poses.length==0 || prevPose.length==0) return;
    let dLeftEye = abs(poses[0].pose.leftEye.x-prevPose[0].pose.leftEye.x);
    let dRightEye = abs(poses[0].pose.rightEye.x-prevPose[0].pose.rightEye.x);

    if(dLeftEye>10 && dRightEye<=9){   // check turn vs move
        headTurns++;
    }
    else if(dRightEye>10 && dLeftEye<=9){
        headTurns++;
    }
    console.log(dLeftEye + " " + dRightEye);


    if(headTurns>5){
        select('#status').html('TURNING HEAD')
        // CALL A FUNCTION TO NOTIFY
        headTurns = 0;
    }
}