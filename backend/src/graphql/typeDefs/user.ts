import gql from "graphql-tag";

const userTypeDefs = gql`
  type searchedUser {
    id: String
    username: String
  }

  type User {
    id:String
    name: String
    username: String
    email: String
    emailVerified: Boolean
    image: String
  }
  
  type Query {
    searchUsers(username: String): [searchedUser]
  }

  type Mutation {
    createUsername(username: String): createUsernameResponse
  }

  type createUsernameResponse {
    success: Boolean
    error: String
  }
`;

export default userTypeDefs;