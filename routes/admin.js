var express = require('express');
var cel = require('connect-ensure-login');
var router = express.Router();
var {
  nanoid
} = require("nanoid");
var mysql = require('mysql2');
var config = require("../db_config.js");

var pool = mysql.createPool(config.connection);

/* GET home page. */
router.get('/', [cel.ensureLoggedIn("/"), isAuthorized], function (req, res) {
  pool.execute("SELECT * FROM users ORDER BY LastName", function (err, userRows) {
    if (err) {
      return res.status(500).render("error", { "error": { status: 500, stack: err.sqlMessage }, message: "Database error." });
    }
    pool.execute("SELECT * FROM cards ORDER BY LastName", function (err, cardRows) {
      if (err) {
        return res.status(500).render("error", { "error": { status: 500, stack: err.sqlMessage }, message: "Database error." });
      }

      res.render('admin', {
        "users": userRows,
        "cards": cardRows,
        "current": req.user
      });
    });
  });
});

//  DELETE user - /admin/delete
router.post('/delete', [cel.ensureLoggedIn("/"), isAuthorized], function (req, res) {
  pool.execute("SELECT * FROM users WHERE UserID = ?", [req.body.id], function (err, rows) {
    if (err) {
      return res.status(500).render("error", { "error": { status: 500, stack: err.sqlMessage }, message: "Database error." });
    }

    if (rows.length == 1) {
      pool.execute("DELETE FROM users WHERE UserID = ?", [req.body.id], function (err, rows) {
        if (err) {
          return res.status(500).render("error", { "error": { status: 500, stack: err.sqlMessage }, message: "Database error." });
        }
        pool.execute("SELECT * FROM users ORDER BY LastName", function (err, rows) {
          if (err) {
            return res.status(500).render("error", { "error": { status: 500, stack: err.sqlMessage }, message: "Database error." });
          }
          return res.render('partials/user-list', {
            "users": rows,
            "current": req.user
          });
        });
      });
    } else {
      return res.status(500).render("error", { "error": { status: 500, stack: "UserID not found." }, message: "Database error." });
    }
  });
});

// GET new user modal - /dashboard/new
router.get('/new', [cel.ensureLoggedIn("/"), isAuthorized], function (req, res) {
  res.render('partials/user-modal', {
    action: "New",
    user: {
      FirstName: "",
      LastName: "",
      Pin: "",
      Privilege: "",
      UserID: -1
    },
    current: req.user
  });
});

// POST edit user modal - /dashboard/edit
router.post('/edit', [cel.ensureLoggedIn("/"), isAuthorized], function (req, res) {
  if (!req.body.id) {
    res.json({
      "error": "Must have UserID"
    });
    return;
  }

  pool.execute("SELECT * FROM users WHERE UserID = ?", [req.body.id], function (err, rows) {
    if (err) {
      return res.status(500).render("error", { "error": { status: 500, stack: err.sqlMessage }, message: "Database error." });
    }

    if (rows.length == 0) {
      return res.status(400).render("error", { "error": { status: 500, stack: "User not found." }, message: "Database error." });
    }

    res.render('partials/user-modal', {
      action: "Edit",
      user: rows[0],
      current: req.user
    });
  });
});

// POST save card - /dashboard/save
router.post('/save', [cel.ensureLoggedIn("/"), isAuthorized], function (req, res) {
  if (!req.body.FirstName || !req.body.LastName || !req.body.Privilege || !req.body.UserID || !req.body.Pin) {
    return res.status(400).render("error", { "error": { status: 500, stack: "Not enough information for user save." }, message: "Application error." });
  }

  if (req.body.UserID == -1) {
    pool.execute(
      `INSERT INTO users(FirstName, LastName, Pin, Privilege, UserID)
      VALUES (?, ?, ?, ?, ?)`,
      [req.body.FirstName, req.body.LastName, req.body.Pin, req.body.Privilege, nanoid(10)],
      function (err, rows) {
        if (err) {
          return res.status(500).render("error", { "error": { status: 500, stack: err.sqlMessage }, message: "Database error." });
        }    
        
        pool.execute("SELECT * FROM users ORDER BY LastName", function (err, rows) {
          if (err) {
            return res.status(500).render("error", { "error": { status: 500, stack: err.sqlMessage }, message: "Database error." });
          }
      
          return res.render('partials/user-list', {
            "users": rows,
            "current": req.user
          });
        });
      });
  } else {
    pool.execute(
      `UPDATE users
      SET FirstName=?, LastName=?, Pin=?, Privilege=?
      WHERE UserID=?`,
      [req.body.FirstName, req.body.LastName, req.body.Pin, req.body.Privilege, req.body.UserID],
      function (err, rows) {
        if (err) {
          return res.status(500).render("error", { "error": { status: 500, stack: err.sqlMessage }, message: "Database error." });
        }
    
        pool.execute("SELECT * FROM users ORDER BY LastName", function (err, rows) {
          if (err) {
            return res.status(500).render("error", { "error": { status: 500, stack: err.sqlMessage }, message: "Database error." });
          }
      
          return res.render('partials/user-list', {
            "users": rows,
            "current": req.user
          });
        });
      }
    );
  }
});


function isAuthorized(req, res, next) {
  if (req.user.Privilege == "Admin") {
    next();
  } else {
    // render the error page
    res.status(500);
    res.render('error', {
      message: "Authorization error.",
      error: {
        status: 401,
        stack: "You are not authorized to access this page."
      }
    });
  }
}

module.exports = router;