/* Hide the logout link in navbar  */
if (window.location.pathname === '/admin/login') {
  $('#logout_link').css({ display: 'none' });
}

/* Admin navbar hightlighting */
$('.admin_navbar a').each(function (prams) {
  if (window.location.pathname === $(this).attr('href')) {
    $(this).css({ color: '#DDD' });
  }
});

/* Hide messages after 5 seconds */
$('.dashboard_messages').delay(3000).fadeOut(1000);

/* Admin ckeditor config */
ClassicEditor.create(document.querySelector('#editor')).catch((error) => {
  console.error(error);
});
