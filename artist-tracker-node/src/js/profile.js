/* global $ FormValidator Materialize */

$(document).ready(function () {
  $('ul.tabs').tabs();
  $('.button-collapse').sideNav();
  $('.collapsible').collapsible();

  populateFavorites();
});

// This function gets details about user's favorite artists using their object id
function populateFavorites () {
  $('.favorites li').each(function () {
    var list = $(this);
    $.ajax({
      type: 'GET',
      url: '/getArtist/' + list.data('id'),
      dataType: 'json',
      success: function (result) {
        list
          .find('.collapsible-header .circle')
          .attr('src', result.images[0].uri);

        console.log(result);

        list.find('.collapsible-header').text(result.name);
        list.find('.collapsible-body').text(result.profile);
      },
      error: function () {
        console.log('Error');
      }
    });
  });
}
