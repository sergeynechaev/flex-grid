
$(document).ready(function() {
    console.log( "It works!" );

    $('.contact-center__block-header').click( function() {
        $(this).parent().attr( 'data-state', !$(this).parent().attr('data-state') ? 'collapse' : '' );
    });

    $('.contact-center__elem').click( function() {
        console.log('elem clicked oT= ' + this.offsetTop + " rect= " + this.getBoundingClientRect().top);
    });
});


// window.onload = function () {

//     var elements = document.querySelectorAll('.contact-center__elem');
//     // console.log(elements);

//     for( var i = 0; i < elements.length || 0; i++) {
//      // console.log(elements[i]);
//      elements[i].addEventListener('click', function(e) {
//          // e.target = clicked element
//          console.log('elem clicked oT= ' + this.offsetTop + " rect= " + this.getBoundingClientRect().top);
//          // this.parentNode.dataset.state = !this.parentNode.dataset.state ? 'collapse' : '';
//          // console.log('clicked = ' + this.parentNode.dataset.state);
//      });
//     }
// }



// function removeClass(obj, cls) {
// 	var classes = obj.className.split(' ');

// 	for (i = 0; i < classes.length; i++) {
// 		if (classes[i] == cls) {
// 		  classes.splice(i, 1); // remove class
// 		  i--; // (*)
// 		}
// 	}
// 	obj.className = classes.join(' ');
// }

// function replaceContentInContainer(matchClass, content) {
//     var elems = document.getElementsByTagName('*'), i;
//     for (i in elems) {
//         if((' ' + elems[i].className + ' ').indexOf(' ' + matchClass + ' ')
//                 > -1) {
//             elems[i].innerHTML = content;
//         }
//     }
// }

// window.onload = function () {
//     console.log('works!');

//     var elements = document.querySelectorAll('.contact-center__block-header');
//     // console.log(elements);

//     for( var i = 0; i < elements.length || 0; i++) {
//     	console.log(elements[i]);
//     	elements[i].addEventListener('click', function(e) {
//     		// e.target = clicked element
//     		console.log(this.parentNode);
//     		this.parentNode.dataset.state = !this.parentNode.dataset.state ? 'collapse' : '';
//     		console.log('clicked = ' + this.parentNode.dataset.state);
//     	});
//     }
// }