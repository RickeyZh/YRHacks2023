const follow = document.getElementById("cursor-follow");

document.body.onpointermove = event =>{
    const {clientX, clientY} = event;

    follow.animate({
        left: `${clientX}px`,
        top: `${clientY}px`
    },{
        duration:2200, fill:"forwards"
    })

}