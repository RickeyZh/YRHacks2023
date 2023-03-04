$(document ).ready(function() {

  const maxRotate = 18; 
  const perspective = 1000;
  
  $(document).mousemove(function(event){
    var pos = [event.pageX / document.body.clientWidth, event.pageY / document.body.clientHeight];
    for (var i=0;i < pos.length;i++) {
      if (pos[i]<0) {
        pos[i] = 0;
      }
      if (pos[i]>1) {
        pos[i] = 1;
      }
    }
    pos[0] = Math.round(((pos[0]*2)-1)*maxRotate);
    pos[1] = Math.round(((pos[1]*-2)+1)*maxRotate);
  $("img").css("transform", "perspective(" 
  + perspective 
  + ") rotateX("+pos[1]+"deg) rotateY("
  +pos[0]
  +"deg)");
  $("img").css("-webkit-transform", "perspective(" 
  + perspective 
  +    ") rotateX("
  +pos[1]
  +"deg) rotateY("
  +pos[0]
  +"deg)");
  });
});


