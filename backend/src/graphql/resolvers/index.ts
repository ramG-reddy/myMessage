import userResolvers from "./user";
import conversationResolvers from "./conversation";
import merge from "lodash.merge";
import scalarResolvers from "./scalars";
import messageResolvers from "./message";

const resolvers = merge(
  {},
  userResolvers,
  conversationResolvers,
  messageResolvers,
  scalarResolvers
);

export default resolvers;