document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);


window.addEventListener('load', function () {
  if (window.devicePixelRatio && devicePixelRatio >= 2) {
    var hairline = document.createElement('div');
    hairline.style.border = '.5px solid transparent';
    document.body.appendChild(hairline);
    if (hairline.offsetHeight == 1) {
      document.querySelector('html').classList.add('hairline');
    }
    document.body.removeChild(hairline);
  }
	/*
	setTimeout(function(){
		document.getElementById("container").setAttribute("class","loaded");
	},5000);
	setTimeout(function(){
		document.getElementById("overlay").setAttribute("class","show");
	},9000);
	*/
}, false);