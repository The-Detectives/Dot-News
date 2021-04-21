/* contacnt us form submitting */
$('#poup_close_btn').on('click', function (e) {
  $('#popup1').css({
    visibility: 'hidden',
    opacity: 0,
  });
});

$('#contactus_form').submit(function (e) {
  e.preventDefault();
  var formData = {
    username: $('#username').val(),
    phone: $('#phone').val(),
    email: $('#email').val(),
    message: $('#message').val(),
  };

  $.ajax({
    type: 'POST',
    url: '/contactus',
    data: formData,
    dataType: 'json',
    encode: true,
  }).done(function (data) {
    console.log(data);
    $('#popup1').css({
      visibility: 'visible',
      opacity: 1,
    });
    $('#username').val('');
    $('#phone').val('');
    $('#email').val('');
    $('#message').val('');
  });
});

/* Sectoin header changing background on change section */
$('.topnav_right>a').each(function () {
  if (window.location.pathname === $(this).attr('href')) {
    $(this).css({
      color: '#38A169',
    });
  }
});

$('.secHeader>a').each(function () {
  if (window.location.pathname === $(this).attr('href')) {
    $(this).css({
      'background-color': '#38A169',
      color: 'white',
    });
  }
});

/* second header */

window.onscroll = function () {
  myFunction();
};

var header = document.getElementById('myHeader');
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
}

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

const init = (n) => {
  slides.forEach((slide, index) => {
    slide.style.display = 'none';
    dots.forEach((dot, index) => {
      dot.classList.remove('active');
    });
  });
  slides[n].style.display = 'block';
  dots[n].classList.add('active');
};
document.addEventListener('DOMContentLoaded', init(currentSlide));
const next = () => {
  currentSlide >= slides.length - 1 ? (currentSlide = 0) : currentSlide++;
  init(currentSlide);
};

const prev = () => {
  currentSlide <= 0 ? (currentSlide = slides.length - 1) : currentSlide--;
  init(currentSlide);
};

// document.querySelector('.next').addEventListener('click', next);

// document.querySelector('.prev').addEventListener('click', prev);

setInterval(() => {
  next();
}, 4000);

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    console.log(currentSlide);
    init(i);
    currentSlide = i;
  });
});
