import graphql from "graphql";
import { AllCars, validateCar } from "../models/allCars";
import { PurchasedCars, validatePurchasedCar } from "../models/purchasedCars";
import { Staffs, validateStaff } from "../models/staffs";
import { User, validateUser } from "../../server/models/user";

console.log(__dirname);

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} from "graphql";

const PurchasedCarsType = new GraphQLObjectType({
  name: "PurchasedCars",
  fields: () => ({
    id: { type: GraphQLID },
    type: { type: GraphQLString },
    modelNumber: { type: GraphQLString },
    saleDate: { type: GraphQLString },
    buyer: { type: GraphQLString },
    color: { type: GraphQLString },
  }),
});

const AllCarsType = new GraphQLObjectType({
  name: "AllCars",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    type: { type: GraphQLString },
    productionDate: { type: GraphQLString },
    color: { type: GraphQLList(GraphQLString) },
    amount: { type: GraphQLInt },
    condition: { type: GraphQLString },
    price: { type: GraphQLInt },
  }),
});

const StaffsType = new GraphQLObjectType({
  name: "Staffs",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    position: { type: GraphQLString },
    salary: { type: GraphQLInt },
    homeAddress: { type: GraphQLString },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    purchasedCar: {
      type: PurchasedCarsType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args, context, info) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");
          return PurchasedCars.findById(args.id);
        } catch (err) {
          console.error(err.message);
        }
      },
    },

    car: {
      type: AllCarsType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args, context, info) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");
          return AllCars.findById(args.id);
        } catch (err) {
          console.error(err.message);
        }
      },
    },

    staff: {
      type: StaffsType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args, context, info) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");
          return Staffs.findById(args.id);
        } catch (err) {
          console.error(err.message);
        }
      },
    },

    purchasedCars: {
      type: new GraphQLList(PurchasedCarsType),
      resolve(parent, args, context, info) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");
          return PurchasedCars.find({});
        } catch (err) {
          console.error(err.message);
        }
      },
    },

    allCars: {
      type: new GraphQLList(AllCarsType),
      resolve(parent, args, context, info) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");
          return AllCars.find({});
        } catch (err) {
          console.error(err.message);
        }
      },
    },

    staffs: {
      type: new GraphQLList(StaffsType),
      resolve(parent, args, context, info) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");
          return Staffs.find({});
        } catch (err) {
          console.error(err.message);
        }
      },
    },

    purchasedCarsByTypeOrColor: {
      type: new GraphQLList(PurchasedCarsType),
      args: { type: { type: GraphQLString }, color: { type: GraphQLString } },
      resolve(parent, args, context, info) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");
          return PurchasedCars.find({
            $or: [{ type: args.type }, { color: args.color }],
          });
        } catch (err) {
          console.error(err.message);
        }
      },
    },

    allCarsByTypeOrConditionOrColor: {
      type: new GraphQLList(AllCarsType),
      args: {
        type: { type: GraphQLString },
        condition: { type: GraphQLString },
        color: { type: GraphQLString },
      },
      resolve(parent, args, context, info) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");
          return AllCars.find({
            $or: [
              { type: args.type },
              { condition: args.condition },
              { color: args.color },
            ],
          });
        } catch (err) {
          console.error(err.message);
        }
      },
    },

    staffsByPositionOrName: {
      type: new GraphQLList(StaffsType),
      args: {
        position: { type: GraphQLString },
        name: { type: GraphQLString },
      },
      resolve(parent, args, context, info) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");
          return Staffs.find({
            $or: [{ position: args.position }, { name: args.name }],
          });
        } catch (err) {
          console.error(err.message);
        }
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args, context) {
        const { error } = validateUser(args);
        if (error) throw new Error(error.details[0].message);

        let register = new User({
          name: args.name,
          email: args.email,
          password: args.password,
        });
        return register.save();
      },
    },
    addPurchasedCar: {
      type: PurchasedCarsType,
      args: {
        type: { type: new GraphQLNonNull(GraphQLString) },
        modelNumber: { type: new GraphQLNonNull(GraphQLString) },
        saleDate: { type: new GraphQLNonNull(GraphQLString) },
        buyer: { type: new GraphQLNonNull(GraphQLString) },
        color: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args, context, info) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");
          const { error, value } = validatePurchasedCar(args);
          if (error) throw new Error(error.details[0].message);

          let purchasedCar = new PurchasedCars(value);

          return await purchasedCar.save();
        } catch (err) {
          console.error(err.message);
        }
      },
    },

    addCar: {
      type: AllCarsType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: new GraphQLNonNull(GraphQLString) },
        productionDate: { type: new GraphQLNonNull(GraphQLString) },
        color: { type: new GraphQLNonNull(GraphQLList(GraphQLString)) },
        amount: { type: new GraphQLNonNull(GraphQLInt) },
        condition: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parent, args, context, info) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");
          const { error, value } = validateCar(args);
          if (error) throw new Error(error.details[0].message);

          let car = new AllCars(value);

          return await car.save();
        } catch (err) {
          console.error(err.message);
        }
      },
    },

    addStaff: {
      type: StaffsType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        position: { type: new GraphQLNonNull(GraphQLString) },
        salary: { type: new GraphQLNonNull(GraphQLInt) },
        homeAddress: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args, context) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");
          const { error, value } = validateStaff(args);
          if (error) throw new Error(error.details[0].message);
          let staff = new Staffs(value);
          return await staff.save();
        } catch (err) {
          console.error(err.message);
        }
      },
    },

    updatePurchasedCar: {
      type: PurchasedCarsType,
      args: {
        id: { type: GraphQLID },
        type: { type: GraphQLString },
        modelNumber: { type: GraphQLString },
        saleDate: { type: GraphQLString },
        buyer: { type: GraphQLString },
        color: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");
          let purchasedCar = await PurchasedCars.findById(args.id);

          if (purchasedCar === null)
            return "Car with the given ID not on the purchased car list";

          return PurchasedCars.findByIdAndUpdate(
            args.id,
            {
              $set: {
                type: args.type || purchasedCar["type"],
                modelNumber: args.modelNumber || purchasedCar["modelNumber"],
                saleDate: args.saleDate || purchasedCar["saleDate"],
                buyer: args.buyer || purchasedCar["buyer"],
                color: args.color || purchasedCar["color"],
              },
            },
            { new: true }
          );
        } catch (err) {
          console.error(err.message);
        }
      },
    },

    updateCar: {
      type: AllCarsType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        type: { type: GraphQLString },
        productionDate: { type: GraphQLString },
        color: { type: GraphQLList(GraphQLString) },
        amount: { type: GraphQLInt },
        condition: { type: GraphQLString },
        price: { type: GraphQLInt },
      },
      async resolve(parent, args, context) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");
          let car = await AllCars.findById(args.id);

          if (!car) return "Car with the given ID not on the car list";

          return AllCars.findByIdAndUpdate(
            args.id,
            {
              $set: {
                name: args.name || car["name"],
                type: args.type || car["type"],
                productionDate: args.productionDate || car["productionDate"],
                color: args.color || car["color"],
                amount: args.amount || car["amount"],
                condition: args.condition || car["condition"],
                price: args.price || car["price"],
              },
            },
            { new: true }
          );
        } catch (err) {
          console.error(err.message);
        }
      },
    },

    updateStaff: {
      type: StaffsType,
      args: {
        name: { type: GraphQLString },
        position: { type: GraphQLString },
        salary: { type: GraphQLInt },
        homeAddress: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");
          let staff = await Staffs.findById(args.id);

          if (!staff) return "Staff with the given ID not on staff list";

          return Staffs.findByIdAndUpdate(
            args.id,
            {
              $set: {
                name: args.name || staff["name"],
                position: args.position || staff["position"],
                salary: args.salary || staff["salary"],
                homeAddress: args.homeAddress || staff["homeAddress"],
              },
            },
            { new: true }
          );
        } catch (err) {
          console.error(err.message);
        }
      },
    },

    deleteUser: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args, context) {
        const value = await context;
        if (!value.headers.authorization) {
          throw Error("Error here!");
        }
        return User.findByIdAndDelete(args.id);
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export { schema };
