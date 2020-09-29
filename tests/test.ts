import "../server/schema/schema";
import "../src/schema/schema";
import { Organization } from "../server/models/organization";
import { AllCars } from "../src/models/allCars";
import { PurchasedCars } from "../src/models/purchasedCars";
import { Staffs } from "../src/models/staffs";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../app"
import { graphql } from "graphql";

const mongod = new MongoMemoryServer();

const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({}, () => {});
  }
};

let server;

// describe("/graphql1", () => {
  // beforeAll(() => {
  //   server = require("../app");
  // });
  const request = supertest(app);

  afterEach(async () => clearDatabase());

  afterAll(() => {
    // server.close();
    closeDatabase();
  });

  describe("All Test Suites",  () => {
    it("can fetch all organizations", async (done) => {
        request
          .post("/graphql1")
          .send({
            query: "{organizations{id, organization, ceo}}",
          })
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) done("the error",err.message) 
            // console.log("the res",res.body)
            expect(res.body).toBeInstanceOf(Object);
            done()
          }) 
    })

    // it("can fetch an organization", async (done) => {
    //   try {
    //   request
    //     .post("/graphql1")
    //     .send({
    //       query:
    //         '{ organization(id: "5f732aa663bce128ebd3dd4a") { id, organization, country } }',
    //     })
    //     .set("Accept", "application.json")
    //     .expect("Content-Type", /json/)
    //     .expect(200)
    //     .end((err, res) => {
    //       if (err) done(err);
    //       console.log(res.body);
    //       const val = res.body.data.organization;
    //       expect(val).toHaveProperty("_id");
    //       expect(val).toHaveProperty("organization");
    //       done()
    //     });
    //   } catch (err) {
    //     console.error(err.message);
    //     done()
    //   }
    // });

    it("can add to organizations", async (done) => {
  
      request
        .post("/graphql1")
        .send({
          query:
            'mutation {addOrganization(organization:"Pito Bank",products: ["Transfer", "Withdrawal"],marketValue: "92%", address: "Lacagan", ceo:"Mr Abass", country: "Nigeria", employees: ["Bisi", "Kenny", "Silver"]){organization, products, ceo}}',
        })
        .set("Accept", "application.json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          console.log(res);
          if (err) done(err);

          const val = res.body.data.addOrganization;
          expect(val).toHaveProperty("organization");
          expect(val).toHaveProperty("ceo");
          // expect(val).toHaveProperty("marketValue");
          done()
        })
  })

    
});