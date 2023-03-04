const follow = document.getElementById("cursor-follow");

document.body.onpointermove = event =>{
    

        const {pageX, pageY} = event;
        
        follow.animate({
            left: `${pageX}px`,
            top: `${pageY}px`
        },{
            duration:2200, fill:"forwards"
        })


}