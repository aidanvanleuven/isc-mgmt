var userModal;
var cardModal;

$(function() {

  // Nav
  $("#users").click(function() {
    $("#users-area").removeClass("d-none");
    $("#cards-area").addClass("d-none");
    $(this).addClass("active");
    $("#cards").removeClass("active");
  });

  $("#cards").click(function() {
    $("#cards-area").removeClass("d-none");
    $("#users-area").addClass("d-none");
    $(this).addClass("active");
    $("#users").removeClass("active");
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
    $("#cards-area").html(res);
    cardModal.hide();
  });
});

// Delete card 
$(document).on("click", ".card-remove", function() {
  var data = {
    "id": $(this).attr("data-id")
  };

  $.post("/dashboard/delete", data, function(res) {
    $("#cards-area").html(res);
  });
});

// New user modal
$(document).on("click", ".user-new", function() {
  $.get("/admin/new", function(res) {
    $("#userModal").html(res);
    userModal = new bootstrap.Modal(document.getElementById('userModal'));
    userModal.show();
  });
});

// Edit user modal
$(document).on("click", ".user-edit", function() {
  var data = {
    "id": $(this).attr("data-id")
  };
  $.post("/admin/edit", data, function(res) {
    $("#userModal").html(res);
    userModal = new bootstrap.Modal(document.getElementById('userModal'));
    userModal.show();
  });
});

// Save user
$(document).on("click", "#user-save", function() {
  // Build data object from form data
  var data = {
    "FirstName": $("#user-first-name").val(),
    "LastName": $("#user-last-name").val(),
    "Pin": $("#pin").val(),
    "Privilege": $("#access").val(),
    "UserID": $(this).attr("data-id")
  };

  if (data.FirstName == "" || data.LastName == "" || data.Pin == "" || data.Privilege == "" || data.UserID == "") {
    $("#err-msg-user").text("All fields must be filled.");
    return;
  }

  $.post("/admin/save", data, function(res) {
    $("#users-area").html(res);
    userModal.hide();
  });
});

// Delete user 
$(document).on("click", ".user-remove", function() {
  var data = {
    "id": $(this).attr("data-id")
  };
  
  $.post("/admin/delete", data, function(res) {
    $("#users-area").html(res);
  });
});