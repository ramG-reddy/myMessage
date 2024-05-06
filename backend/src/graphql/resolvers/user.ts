import { User } from "@prisma/client";
import { GraphQLError } from "graphql";
import { GraphQLContext, createUsernameResponse } from "../../lib/types";

const userResolvers = {
  Query: {
    searchUsers: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<Array<User>> => {
      const { username: searchedUsername } = args;
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("You must be logged in to search users.")
      }

      const { username: myusername } = session.user;
      try {
        const result = await prisma.user.findMany({
          where: {
            username: {
              contains: searchedUsername,
              not: myusername,
              mode: "insensitive",
            },
          },
        });
        return result;
      } catch (error: any) {
        console.log(error);
        throw new GraphQLError("Failed to search users " + error.message);
      }
    },
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<createUsernameResponse> => {
      const { username } = args;
      const { session, prisma } = context;

      if (!session?.user) {
        return { error: "You must be logged in to create a username." };
      }

      const { id: userId } = session.user;

      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        if (existingUser) {
          return { error: "This username is already taken. Try another" };
        }

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            username,
          },
        });

        return { success: true };
      } catch (error: any) {
        console.log(error);
        return { error: "Failed to create username " + error.message };
      }
    },
  },
  // Subscription: {},
};

export default userResolvers;
