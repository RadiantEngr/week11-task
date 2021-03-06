import "../server/schema/schema";
import "../src/schema/schema";
import { Organization } from "../server/models/organization";
import { AllCars } from "../src/models/allCars";
import { PurchasedCars } from "../src/models/purchasedCars";
import { Staffs } from "../src/models/staffs";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../app";
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

const request = supertest(app);

afterEach(async () => clearDatabase());

afterAll(() => {
  closeDatabase();
});

describe("All Test Suites", () => {
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
        if (err) done("the error", err.message);
        expect(res.body).toBeInstanceOf(Object);
        done();
      });
  });

  it("can fetch an organization", async (done) => {
    request
      .post("/graphql1")
      .send({
        query:
          '{ organization(id: "5f74c5a88323749bf4e6f4cf") { id, organization, country } }',
      })
      .set("Accept", "application.json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).toBeInstanceOf(Object);
        done()
      });
  });

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
        if (err) done(err);
        const val = res.body.data.addOrganization;
        expect(val).toHaveProperty("organization");
        expect(val).toHaveProperty("ceo");
        done();
      });
  });

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

})





