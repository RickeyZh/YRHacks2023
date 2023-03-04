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
}
