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
const btn = document.getElementById('menu-btn')
const nav = document.getElementById('menu')

btn.addEventListener('click', ()=>{
    btn.classList.toggle('open')
})

btn.addEventListener('click', ()=>{
    if(!nav.classList.contains('menu-active')){
        nav.classList.remove('menu-inactive')
        nav.classList.add('menu-active')
        nav.classList.add('d-flex')
    } else {
        nav.classList.remove('menu-active')
        nav.classList.add('menu-inactive')
    }
})