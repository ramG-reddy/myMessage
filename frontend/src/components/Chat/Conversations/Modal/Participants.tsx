import { searchedUser } from "@/lib/types";
import { Flex, Stack, Text } from "@chakra-ui/react";
import { IoIosCloseCircleOutline } from "react-icons/io";

type Props = {
  participants: Array<searchedUser>;
  remove: (user: searchedUser) => void;
};

const Participants = ({ participants, remove }: Props) => {
  // console.log(participants, "participants");
  return (
    <Flex mt={8} gap="10px" flexWrap="wrap">
      {participants.map((participant, key) => {
        return (
          <Stack
            key={key}
            p={2}
            align="center"
            direction="row"
            spacing={2}
            borderRadius={6}
            bg="whiteAlpha.200"
            _hover={{ bg: "whiteAlpha.400", color: "blue.200" }}
            >
            <Text mb={1}>
              {participant.username}
            </Text>
            <IoIosCloseCircleOutline
              onClick={() => {
                remove(participant);
              }}
              cursor="pointer"
            />
          </Stack>
        );
      })}
    </Flex>
  );
};
export default Participants;
