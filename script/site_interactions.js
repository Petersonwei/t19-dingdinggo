// HOMEPAGE
const loginForm = document.getElementById("loginForm");


function redirectToProfilePage() {
  window.location.href = "profile-page.html";
}

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  const slides = document.getElementsByClassName("mySlides");
  const dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}



//PROFILE PAGE

// Responsive Nav bar

function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

//FILTER CODES FOR PROFILE//

function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("column");
  if (c == "all") {
    c = "";
    // Add "show" class to all items
    for (i = 0; i < x.length; i++) {
      w3AddClass(x[i], "show");
    }
  } else {
    for (i = 0; i < x.length; i++) {
      w3RemoveClass(x[i], "show");
      if (matchesCategories(x[i], c.split(' '))) {
        w3AddClass(x[i], "show");
      }
    }
  }
}

function matchesCategories(element, categories) {
  var classList = element.className.split(' ');
  for (var j = 0; j < categories.length; j++) {
    if (classList.indexOf(categories[j]) === -1) {
      return false;
    }
  }
  return true;
}

function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
  }
}

function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);     
    }
  }
  element.className = arr1.join(" ");
}

// Add active class to the current button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
    var filter = this.getAttribute("data-filter");
    filterSelection(filter);
  });
}

//MODAL BOX - PROFILE PAGE
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("Find-out-button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

loginForm.addEventListener("submit", redirectToProfilePage)
//FORM REDIRECTION - Login Page

/*
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  //If the form is valid, redirect to the profile page
  if (this.checkValidity()) {
    window.location.href = "profile-page.html";
    }
  });
  */

/*
function redirectToProfilePage() {
  const form = document.getElementById('loginForm');

  // Check if the form is valid
  if (form.checkValidity()) {
    window.location.href = "profile-page.html";
    return false; // Prevent default form submission
  }
}
*/
