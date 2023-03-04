const follow = document.getElementById("cursor-follow");
const limit = 20;
const mouseOver = document.getElementById("stare");
const imgLayer = document.getElementById("st-con");

document.body.onpointermove = event =>{
    

        const {pageX, pageY} = event;
        var {clientX, clientY} = event;
        
        follow.animate({
            left: `${pageX}px`,
            top: `${pageY}px`
        },{
            duration:2200, fill:"forwards"
        });

        // let xy = [clientX, clientY];
        // let pos = xy.concat([imgLayer]);
    
        // window.requestAnimationFrame(function(){
        //     transformLayer(imgLayer, pos);
        // });

}




function transformimg(x, y, di){
    let image = di.getBoundingClientRect();

    let deltaX = -(y - image.y - (image.height/2))/limit;
    let deltaY = (x-image.x - (image.width/2)) / limit;

    return " rotateX("+deltaX+"deg)"
        +" rotateY("+deltaY+"deg)";
};


function transformLayer(di, xyDI){
    console.log("gelo");
    di.style.transform = transformimg.apply(null, xyDI);
}

mouseOver.onmousemove = function(e){


};