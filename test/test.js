var supertest = require("supertest");
var should = require("should");
var app = require("../app");
fs = require('fs');

// This agent refers to PORT where program is runninng.
var server = supertest.agent(app);

// No auth
describe("Not logged in", function() {
  it("render index.ejs", function(done) {
    server.get("/")
      .expect("Content-type", /text\/html/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(200);
        done();
      });
  });

  it("renders error.ejs on 404", function(done) {
    server.get("/lkasmdfgn")
      .expect("Content-type", /text\/html/)
      .expect(404)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(404);
        done();
      });
  });

  it("renders dashboard on /admin", function(done) {
    server.get("/admin")
      .expect("Content-type", /text\/plain/)
      .expect(302)
      .expect("Location", "/")
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(302);
        done();
      });
  });

  it("re-renders index.ejs on login fail", function(done) {
    server.post("/auth")
      .send({
        pin: "lkasmhjbf",
        password: "xxx"
      })
      .expect("Content-type", /text\/html/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(200);
        done();
      });
  });

  it("redirects to index.ejs with no auth", function(done) {
    server.get("/dashboard")
      .expect("Content-type", /text\/plain/)
      .expect(302)
      .expect("Location", "/")
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(302);
        done();
      });
  });
});


// User level auth
describe("Normal user login", function() {
  it("redirects to dashboard.ejs", function(done) {
    server.post("/auth")
      .send({
        pin: "4321",
        password: "xxx"
      })
      .expect("Content-type", /text\/plain/)
      .expect(302)
      .expect("Location", "/dashboard")
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(302);
        done();
      });
  });

  it("renders dashboard.ejs", function(done) {
    server.get("/dashboard")
      .expect("Content-type", /text\/html/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(200);
        done();
      });
  });

  it("renders error.ejs on unauthorized", function(done) {
    server.get("/admin")
      .expect("Content-type", /text\/html/)
      .expect(401)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(401);
        done();
      });
  });

  it("logs the user out", function(done) {
    server.get("/auth/logout")
      .expect("Content-type", /text\/plain/)
      .expect(302)
      .expect("Location", "/")
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(302);
        done();
      });
  });
});


// Admin level auth
describe("Admin user login", function() {
  it("redirects to dashboard.ejs", function(done) {
    server.post("/auth")
      .send({
        pin: "1234",
        password: "xxx"
      })
      .expect("Content-type", /text\/plain/)
      .expect(302)
      .expect("Location", "/dashboard")
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(302);
        done();
      });
  });

  it("renders dashboard.ejs", function(done) {
    server.get("/dashboard")
      .expect("Content-type", /text\/html/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(200);
        done();
      });
  });

  it("renders admin page", function(done) {
    server.get("/admin")
      .expect("Content-type", /text\/html/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(200);
        done();
      });
  });

  it("logs the admin out", function(done) {
    server.get("/auth/logout")
      .expect("Content-type", /text\/plain/)
      .expect(302)
      .expect("Location", "/")
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(302);
        done();
      });
  });
});