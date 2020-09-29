import graphql from "graphql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Organization, validateOrganization } from "../models/organization";
import { User, validateUser } from "../models/user";
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} from "graphql";

const OrganizationType = new GraphQLObjectType({
  name: "Organization",
  fields: () => ({
    id: { type: GraphQLID },
    organization: { type: GraphQLString },
    products: { type: GraphQLList(GraphQLString) },
    marketValue: { type: GraphQLString },
    address: { type: GraphQLString },
    ceo: { type: GraphQLString },
    country: { type: GraphQLString },
    noOfEmployees: { type: GraphQLString },
    employees: { type: GraphQLList(GraphQLString) },
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
    organization: {
      type: OrganizationType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args, context, info) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");

          return Organization.findById(args.id);
        } catch (err) {
          console.error(err.message);
        }
      },
    },
    organizations: {
      type: new GraphQLList(OrganizationType),
      async resolve(parent, args, context, info) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");

          return await Organization.find({});
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
      async resolve(parent, args) {
        try {
          const { error } = validateUser(args);
          if (error) throw new Error(error.details[0].message);

          let register = new User({
            name: args.name,
            email: args.email,
            password: args.password,
          });
          register["password"] = bcrypt.hashSync(register["password"]);
          return register.save();
        } catch (err) {
          console.error(err.message);
        }
      },
    },

    login: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        try {
          return User.findOne({ email: args.email })
            .exec()
            .then((user) => {
              if (!user) {
                return new Error("Invalid login credetials");
              }

              if (bcrypt.compareSync(args.password, user["password"])) {
                const payload = {
                  name: user["name"],
                  id: user["id"],
                };

                let userObject = user.toJSON();
                const token = jwt.sign(payload, process.env.SECRET_KEY);
                userObject["token"] = token;

                return userObject;
              } else {
                return new Error("Invalid login credentails");
              }
            });
        } catch (err) {
          console.error(err.message);
        }
      },
    },

    addOrganization: {
      type: OrganizationType,
      args: {
        organization: { type: new GraphQLNonNull(GraphQLString) },
        products: { type: new GraphQLNonNull(GraphQLList(GraphQLString)) },
        marketValue: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        ceo: { type: new GraphQLNonNull(GraphQLString) },
        country: { type: new GraphQLNonNull(GraphQLString) },
        employees: { type: new GraphQLNonNull(GraphQLList(GraphQLString)) },
      },
      async resolve(_, args, context, _info) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");

          const { error, value } = validateOrganization(args);
          if (error) throw new Error(error.details[0].message);

          let organization = new Organization(value);

          return await organization.save();
        } catch (err) {
          console.error(err.message);
        }
      },
    },

    updateOrganization: {
      type: OrganizationType,
      args: {
        id: { type: GraphQLID },
        organization: { type: GraphQLString },
        products: { type: GraphQLList(GraphQLString) },
        marketValue: { type: GraphQLString },
        address: { type: GraphQLString },
        ceo: { type: GraphQLString },
        country: { type: GraphQLString },
        noOfEmployees: { type: GraphQLString },
        employees: { type: GraphQLList(GraphQLString) },
      },
      async resolve(parent, args, context, info) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");

          let organization = await Organization.findById(args.id);

          if (!organization)
            return "Organization with the given ID not in organization list";

          return Organization.findOneAndUpdate(
            args.id,
            {
              $set: {
                organization: args.organization || organization["organization"],
                products: args.products || organization["products"],
                marketValue: args.marketValue || organization["marketValue"],
                address: args.address || organization["address"],
                ceo: args.ceo || organization["ceo"],
                country: args.country || organization["country"],
                employees: args.employees || organization["employees"],
              },
            },
            { new: true }
          );
        } catch (err) {
          console.error(err.message);
        }
      },
    },

    deleteOrganization: {
      type: OrganizationType,
      args: {
        id: { type: GraphQLID },
      },
      async resolve(parent, args, context, info) {
        try {
          // const token = context.headers.authorization;
          // if (!token) throw Error("Invalid token");

          let organization = await Organization.findById(args.id);
          return Organization.findOneAndDelete(args.id);
        } catch (err) {
          console.error(err.message);
        }
      },
    },

    deleteUser: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args, context) {
        try {
          const value = await context;
          if (!value.headers.authorization) {
            throw Error("Error here!");
          }
          return User.findByIdAndDelete(args.id);
        } catch (err) {
          console.error(err.message);
        }
      },
    },
  },
});

const resultantSchemaForOrganization = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export { resultantSchemaForOrganization };
