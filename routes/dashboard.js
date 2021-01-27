var express = require('express');
var cel = require('connect-ensure-login');
var {
  nanoid
} = require("nanoid");
var router = express.Router();

var mysql = require('mysql2');
var config = require("../db_config.js");

const pool = mysql.createPool(config.connection);

// GET /dashboard
router.get('/', cel.ensureLoggedIn("/"), function (req, res) {
  pool.execute("SELECT * FROM cards ORDER BY LastName", function (err, rows) {
    if (err) {
      return res.status(500).render("error", { "error": { status: 500, stack: err.sqlMessage }, message: "Database error." });
    }

    res.render('dashboard', {
      "cards": rows,
      "user": req.user
    });
  });
});

//  DELETE card - /dashboard/delete
router.post('/delete', cel.ensureLoggedIn('/'), function (req, res) {
  pool.execute("SELECT * FROM cards WHERE CardID = ?", [req.body.id], function (err, rows) {
    if (err) {
      return res.status(500).render("error", { "error": { status: 500, stack: err.sqlMessage }, message: "Database error." });
    }
    if (rows.length == 1) {
      pool.execute("DELETE FROM cards WHERE CardID = ?", [req.body.id], function (err, rows) {
        if (err) {
          return res.status(500).render("error", { "error": { status: 500, stack: err.sqlMessage }, message: "Database error." });
        }
        pool.execute("SELECT * FROM cards ORDER BY LastName", function (err, rows) {
          if (err) {
            return res.status(500).render("error", { "error": { status: 500, stack: err.sqlMessage }, message: "Database error." });
          }
          return res.render('partials/card-list', {
            "cards": rows
          });
        });
      });
    }
  });
});

// GET new card modal - /dashboard/new
router.get('/new', cel.ensureLoggedIn('/'), function (req, res) {
  res.render('partials/card-modal', {
    action: "New",
    card: {
      FirstName: "",
      LastName: "",
      Balance: 0,
      CardID: -1
    }
  });
});

// POST edit card modal - /dashboard/edit
router.post('/edit', cel.ensureLoggedIn('/'), function (req, res) {
  if (!req.body.id) {
    res.json({
      "error": "Must have CardID"
    });
    return;
  }

  pool.execute("SELECT * FROM cards WHERE CardID = ?", [req.body.id], function (err, rows) {
    if (err) {
      return res.status(500).render("error", { "error": { status: 500, stack: err.sqlMessage }, message: "Database error." });
    }

    if (rows.length == 0) {
      return res.status(400).render("error", { "error": { status: 500, stack: "Card not found." }, message: "Database error." });
    }

    res.render('partials/card-modal', {
      action: "Edit",
      card: rows[0]
    });
  });
});

// POST save card - /dashboard/save
router.post('/save', cel.ensureLoggedIn('/'), function (req, res) {
  if (!req.body.FirstName || !req.body.LastName || !req.body.Balance || !req.body.CardID) {
    res.json({
      "error": "Not enough information for user add."
    });
    return;
  }

  if (req.body.CardID == -1) {
    pool.execute(
      `INSERT INTO cards(FirstName, LastName, Balance, CardID)
      VALUES (?, ?, ?, ?)`,
      [req.body.FirstName, req.body.LastName, req.body.Balance, nanoid(10)],
      function (err, rows) {
        if (err) {
          return res.status(500).render("error", { "error": { status: 500, stack: err.sqlMessage }, message: "Database error." });
        }

        pool.execute("SELECT * FROM cards ORDER BY LastName", function (err, rows) {
          if (err) {
            return res.status(500).render("error", { "error": { status: 500, stack: err.sqlMessage }, message: "Database error." });
          }
          return res.render('partials/card-list', {
            "cards": rows
          });
        });
      });
  } else {
    pool.execute(
      `UPDATE cards
      SET FirstName=?, LastName=?, Balance=?
      WHERE CardID=?`,
      [req.body.FirstName, req.body.LastName, req.body.Balance, req.body.CardID],
      function (err, rows) {
        if (err) {
          return res.status(500).render("error", { "error": { status: 500, stack: err.sqlMessage }, message: "Database error." });
        }
        pool.execute("SELECT * FROM cards ORDER BY LastName", function (err, rows) {
          if (err) {
            return res.status(500).render("error", { "error": { status: 500, stack: err.sqlMessage }, message: "Database error." });
          }
          return res.render('partials/card-list', {
            "cards": rows
          });
        });
      }
    );
  }
});

module.exports = router;