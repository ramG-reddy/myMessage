import { searchedUser } from "@/lib/types";
import { Avatar, Button, Flex, Stack, Text } from "@chakra-ui/react";

interface IUserSearchListProps {
  users: Array<searchedUser>;
  add: (user: searchedUser) => void;
}

const UserSearchList: React.FC<IUserSearchListProps> = ({ users, add }) => {
  return (
    <div>
      {users.length > 0 ? (
        <Stack mt={6}>
          {users.map((user, key) => (
            <Stack
              key={key}
              direction="row"
              align="center"
              px={4}
              py={2}
              borderRadius={4}
              _hover={{ bg: "whiteAlpha.200" }}>
              <Avatar />
              <Flex justify="space-between" align="center" width="100%">
                <Text color="whiteAlpha.700">{user.username}</Text>
                <Button
                  bg="brand.100"
                  _hover={{ bg: "white", color: "brand.100" }}
                  onClick={() => add(user)}>
                  Select
                </Button>
              </Flex>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Flex justify="center" mt={6}>
          <Text>No users found</Text>
        </Flex>
      )}
    </div>
  );
};
export default UserSearchList;
