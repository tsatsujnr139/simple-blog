let mongoose = require("mongoose");
let User = require("../models/User");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();

chai.use(chaiHttp);

describe("Users", () => {
  beforeEach((done) => {
    //Before each test we empty the database
    User.remove({}, (err) => {
      done();
    });
  });
  /*
   * Test the /GET route
   */
  describe("/GET users", () => {
    it("it should GET all the users", (done) => {
      chai
        .request(server)
        .get("/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe("/POST users", () => {
    it("it should not POST a user without required field", (done) => {
      let user = {
        username: "myusername",
        password: "shazam!",
      };
      chai
        .request(server)
        .post("/users")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          done();
        });
    });
    it("it should create a user ", (done) => {
      let user = {
        username: "myusername",
        email: "user@email.com",
        password: "shazam!",
      };
      chai
        .request(server)
        .post("/users")
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("_id");
          res.body.should.have.property("username");
          res.body.should.have.property("email");
          res.body.should.have.property("createdAt");
          res.body.should.have.property("updatedAt");
          done();
        });
    });
  });
});
