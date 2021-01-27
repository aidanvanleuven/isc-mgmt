var supertest = require("supertest");
var should = require("should");
var app = require("../app");

// This agent refers to PORT where program is runninng.
var server = supertest.agent(app);

describe("GET /", function () {
  it("renders index.ejs", function (done) {
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

  it("renders error.ejs", function (done) {
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
});

describe("POST /auth", function () {
  it("re-renders index.ejs on fail", function(done) {
    server.post("/auth")
      .send({
        pin: "lkasmhjbf",
        password: "xxx"
      })
      .expect("Content-type", /text\/html/)
      .expect(200)
      .end(function (err, res) {
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
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.status.should.equal(302);
        done();
      });
  });

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
});