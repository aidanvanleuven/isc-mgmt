$(function() {
  $("#search").on("keyup", function(e) {
    if (e.key == "Escape") {
      $(this).val("");
    }
    var value = $(this).val().toLowerCase();
    $(".card-name").filter(function() {
      $(this).parents(".card-single").toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});


// New card modal
$(document).on("click", ".card-new", function() {
  $.get("/dashboard/new", function(res) {
    $("#cardModal").html(res);
    cardModal = new bootstrap.Modal(document.getElementById('cardModal'));
    cardModal.show();
  });
});

// Edit card modal
$(document).on("click", ".card-edit", function() {
  var data = {
    "id": $(this).attr("data-id")
  };
  $.post("/dashboard/edit", data, function(res) {
    $("#cardModal").html(res);
    cardModal = new bootstrap.Modal(document.getElementById('cardModal'));
    cardModal.show();
  });
});

// Save card
$(document).on("click", "#card-save", function() {
  // Build data object from form data
  var data = {
    "FirstName": $("#card-first-name").val(),
    "LastName": $("#card-last-name").val(),
    "Balance": $("#balance").val(),
    "CardID": $(this).attr("data-id")
  };

  if (data.FirstName == "" || data.LastName == "" || data.Balance == "" || data.CardID == "") {
    $("#err-msg-card").text("All fields must be filled.");
    return;
  }

  $.post("/dashboard/save", data, function(res) {
    $("#display-area").html(res);
    cardModal.hide();
  });
});

// Delete card 
$(document).on("click", ".card-remove", function() {
  var data = {
    "id": $(this).attr("data-id")
  };
  
  $.post("/dashboard/delete", data, function(res) {
    $("#display-area").html(res);
  });
});