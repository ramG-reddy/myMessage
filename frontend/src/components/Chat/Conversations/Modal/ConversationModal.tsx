import ConversationOperations from "@/graphql/operations/conversation";
import UserOperations from "@/graphql/operations/user";
import {
  ISearchUsersData,
  ISearchUsersInput,
  createConversationData,
  createConversationInput,
  searchedUser,
} from "@/lib/types";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { useState } from "react";
import Participants from "./Participants";
import UserSearchList from "./userSearchList";
import toast from "react-hot-toast";
interface IConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
}
import { useRouter } from "next/router";

const ConversationModal: React.FC<IConversationModalProps> = ({
  session,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<Array<searchedUser>>([]);

  const { id: userId } = session.user;

  const [searchUsers, { data, loading, error }] = useLazyQuery<
    ISearchUsersData,
    ISearchUsersInput
  >(UserOperations.Queries.searchUsers);

  const [createConversation, { loading: createConversationLoading }] =
    useMutation<createConversationData, createConversationInput>(
      ConversationOperations.Mutations.createConversation
    );

  // console.log(data, loading, error, "right herre is the list of data");

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Searching for ", username);
    searchUsers({ variables: { username } });
  };

  //add participants to the conversation

  const addParticipant = (user: searchedUser) => {
    setParticipants((prev) => {
      return [...prev, user];
    });
    setUsername("");
  };

  const removeParticipant = (user: searchedUser) => {
    setParticipants((prev) => {
      return prev.filter((participant) => participant.id !== user.id);
    });
  };

  const onCreateConversation = async () => {
    const participantsIds = [userId, ...participants.map((p) => p.id)];
    try {
      const { data } = await createConversation({
        variables: { participantsIds },
      });

      if(!data?.createConversation) throw new Error("Failed to create conversation");

      const { conversationId: convoId } = data.createConversation;

      router.push({ query: { convoId }});

      console.log("Conversation created", data);

      toast.success("Conversation Created!")
      
      setParticipants([]);
      setUsername("");
      onClose();
    } catch (err: any) {
      console.log("Error creating conversation", err.message);
      toast.error("Failed to create conversation");
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d" pb={4}>
          <ModalHeader>Find Users</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack>
                <Input
                  placeholder="Enter a Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button
                  type="submit"
                  isDisabled={!username}
                  isLoading={loading}>
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList users={data.searchUsers} add={addParticipant} />
            )}
            {/* participnats down  */}
            {participants.length > 0 && (
              <>
                <Participants
                  participants={participants}
                  remove={removeParticipant}
                />
                <Button
                  bg="brand.100"
                  width="100%"
                  mt={3}
                  _hover={{ bg: "white", color: "blue.500" }}
                  onClick={onCreateConversation}
                  isLoading={createConversationLoading}>
                  Create Conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
