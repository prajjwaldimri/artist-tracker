/* global $ Materialize */
$(document).ready(function () {
  $('.secondary-content').click(function () {
    var addButton = $(this);
    var artistId = addButton.data('id');
    $.ajax({
      type: 'POST',
      url: '/account/addArtist',
      data: { artistId: artistId },
      dataType: 'json',
      success: function () {
        addButton
          .children()
          .first()
          .text('done');
        Materialize.toast('Successfully Added', 2000, 'green');
      },
      error: function () {
        Materialize.toast('Something bad happened! Try again', 2000, 'red');
      }
    });
  });
});
