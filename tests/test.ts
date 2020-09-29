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

describe("/graphql1", () => {
  beforeAll(() => {
    server = require("../app");
  });
  const request = supertest(server);

  afterEach(async () => clearDatabase());

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

    it("can fetch an organization", async () => {
      request
        .post("/graphql1")
        .send({
          query:
            '{ organization(id: "5f732aa663bce128ebd3dd4a") { id, organization, country } }',
        })
        .set("Accept", "application.json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return err.message;
          console.log(res.body);
          const val = res.body.data.organization;
          expect(val).toHaveProperty("_id");
          expect(val).toHaveProperty("organization");
        });
    });

    it("can add to organizations", () => {
      request
        .post("/graphql1")
        .send({
          query:
            'mutation {addOrganization(organization:"Pito Bank",products: ["Transfer", "Withdrawal"],marketValue: "92%", address: "Lacagan", ceo:"Mr Abass", country: "Nigeria", employees: ["Bisi", "Kenny", "Silver"]){organization, products}}',
        })
        .set("Accept", "application.json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          console.log(res);
          if (err) return err.message;

          const val = res.body.data.addOrganization;
          expect(val).toHaveProperty("organization");
          expect(val).toHaveProperty("ceo");
          expect(val).toHaveProperty("marketValue");
        });
    });

    // it("can update organization", () => {
    //   request
    //     .post("/graphql")
    //     .send({
    //       query:
    //         'mutation {updateOrganization(organization:"Pito Bank",products: ["first", "second"],marketValue: "92%", address: "Lacagan", ceo:"Mr Abass", country: "Nigeria", employees: ["Bisi", "Kenny", "Silver"]){organization, products}}',
    //     })
    //     .set("Accept", "application.json")
    //     .expect("Content-Type", /json/)
    //     .expect(200)
    //     .end((err, res) => {
    //       console.log(res);
    //       if (err) return err.message;
    //     expect(res.body).toBeInstanceOf{Object}
    //       const val = res.body.data.addOrganization;
    //       expect(val).toHaveProperty("organization");
    //       expect(val).toHaveProperty("ceo");
    //       expect(val).toHaveProperty("marketValue");
    //     });
    // });

    it("can add a purchased car", async () => {
      let data = {
        type: "Toyota",
        modelNumber: "7452MXDGH-2017",
        saleDate: "2020-09-10T14:14:08.670Z",
        buyer: "Olapeju",
        color: "Green",
      };

      expect(async () => await PurchasedCars.create()).not.toThrow();
    });

    it("can add to cars", async () => {
      let data = {
        Name: "X-series",
        type: "Melon",
        productionDate: "2014-05-11",
        color: ["Silver", "black"],
        amount: 21,
        condition: "Old",
        price: 34366729,
      };
      expect(async () => await AllCars.create()).not.toThrow();
    });

    it("can add to staffs", async () => {
      let data = {
        name: "Freddie Ochukwu",
        position: "Manager",
        salary: 250000,
        homeAddress: "No.4 Behind okija, yola, adamawa state",
      };
      expect(async () => await Staffs.create()).not.toThrow();
    });

    it("can update a purchased car", async () => {
      expect(async () => await PurchasedCars.findByIdAndUpdate()).not.toThrow();
    });

    it("can update a car", async () => {
      expect(async () => await AllCars.findByIdAndUpdate()).not.toThrow();
    });

    it("can update a staff", async () => {
      expect(async () => await Staffs.findByIdAndUpdate()).not.toThrow();
    });

    it("can get all purchased cars", async () => {
      expect(async () => await PurchasedCars.find()).not.toThrow();
    });

    it("can get all cars", async () => {
      expect(async () => await AllCars.find()).not.toThrow();
    });

    it("can get all staffs", async () => {
      expect(async () => await Staffs.find()).not.toThrow();
    });

    it("can delete a purchased car", async () => {
      expect(async () => await PurchasedCars.findByIdAndRemove()).not.toThrow();
    });

    it("can delete a car", async () => {
      expect(async () => await AllCars.findByIdAndRemove()).not.toThrow();
    });

    it("can get all staff", async () => {
      expect(async () => await Staffs.findByIdAndRemove()).not.toThrow();
    });
  });
});
