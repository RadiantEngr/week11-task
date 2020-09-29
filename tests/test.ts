// import app from '../app';
import "../server/schema/schema";
import "../src/schema/schema";
import { Organization } from "../server/models/organization";
import { AllCars } from "../src/models/allCars";
import { PurchasedCars } from "../src/models/purchasedCars";
import { Staffs } from "../src/models/staffs";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { graphql } from "graphql";

// const request = supertest(app);
const mongodb = new MongoMemoryServer();

let server;

describe("/graphql1", () => {
  beforeAll(() => {
    server = require("../app");
  });
  const request = supertest(server);
  afterAll(() => {
    server.close();
  });

  describe("All Test Suites", () => {
    it("can fetch all organizations", async () => {
      try {
        request
          .post("/graphql1")
          .send({
            query: "{organizations{id, organization, ceo}}",
          })
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) return err.message;
            expect(res.body).toBeInstanceOf(Object);
          });
      } catch (error) {
        console.log(`error ${error.toString()}`);
      }
    });

    // it("can fetch an organization", async () => {
    //     request
    //       .post('/graphql1')
    //       .send({
    //         query:
    //           '{ organization(id: "5f732aa663bce128ebd3dd4a") { id, organization, country } }',
    //       })
    //       .set("Accept", "application.json")
    //       .expect("Content-Type", /json/)
    //       .expect(200)
    //       .end((err, res) => {
    //         if (err) return err.message;
    //         const val = res.body.data.organization;
    //         expect(val).toHaveProperty("_id")
    //         expect(val).toHaveProperty("organization");
    //       });
    //   });

    // it("can add to organizations", () => {
    //   request
    //     .post("/graphql1")
    //     .send({
    //       query:
    //         'mutation {addOrganization(organization:"Pito Bank",products: ["Transfer", "Withdrawal"],marketValue: "92%", address: "Lacagan", ceo:"Mr Abass", country: "Nigeria", employees: ["Bisi", "Kenny", "Silver"]){organization, products}}',
    //     })
    //     .set("Accept", "application.json")
    //     .expect("Content-Type", /json/)
    //     .expect(200)
    //     .end((err, res) => {
    //       console.log(res);
    //       if (err) return err.message;  
        
    //       const val = res.body.data.addOrganization;
    //       expect(val).toHaveProperty("organization");
    //       expect(val).toHaveProperty("ceo");
    //       expect(val).toHaveProperty("marketValue");
    //     });
    // });
    
  });
});
