import ConversationOperations from "@/graphql/operations/conversation";
import { useMutation } from "@apollo/client";
import { Box, Button, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { ConversationPopulated } from "../../../../../backend/src/lib/types";
import ConversationItem from "./ConversationItem";
import ConversationModal from "./Modal/ConversationModal";

interface IConversationListProps {
  session: Session;
  conversations: Array<ConversationPopulated> | undefined;
  onViewConversation: (
    conversationId: string,
    hasSeenLastestMessage: boolean | undefined
  ) => void;
}

const ConversationList: React.FC<IConversationListProps> = ({
  session,
  conversations,
  onViewConversation: onView,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const [deleteConversation] = useMutation<{
    deleteConversation: boolean;
    conversationId: string;
  }>(ConversationOperations.Mutations.deleteConversation);

  const router = useRouter();
  const { id: userId } = session.user;

  const onDeleteConversation = async (conversationId: string) => {
    try {
      toast.promise(
        deleteConversation({
          variables: {
            conversationId,
          },
          update: () => {
            router.replace(
              typeof process.env.NEXT_PUBLIC_BASE_URL === "string"
                ? process.env.NEXT_PUBLIC_BASE_URL
                : ""
            );
          },
        }),
        {
          loading: "Deleting conversation",
          success: "Conversation deleted",
          error: "Failed to delete conversation",
        }
      );
    } catch (error) {
      console.log("onDeleteConversation error", error);
    }
  };

  return (
    <Box
      width={{ base: "100%", md: "350px" }}
      position="relative"
      height="100%">
      <Box
        py={2}
        px={4}
        bg="blackAlpha.300"
        borderRadius={4}
        cursor="pointer"
        onClick={onOpen}>
        <Text textAlign="center" color="HighlightText">
          Find or Start a Conversation
        </Text>
      </Box>
      <ConversationModal session={session} isOpen={isOpen} onClose={onClose} />
      {!conversations && (
        <Text textAlign="center" color="HighlightText" mt={4}>
          Loading...
        </Text>
      )}
      <Box overflowY="scroll" height="80vh">
        {conversations?.map((convo) => {
          const participant = convo.participants.find(
            (p) => p.user.id === userId
          );

          return (
            <ConversationItem
              key={convo.id}
              userId={userId}
              conversation={convo}
              onClick={() =>
                onView(convo.id, participant?.hasSeenLatestMessage)
              }
              isSelected={convo.id === router.query.convoId}
              hasSeenLatestMessage={participant?.hasSeenLatestMessage}
              onDeleteConversation={onDeleteConversation}
            />
          );
        })}
      </Box>
      <Button
        onClick={() => signOut()}
        position="absolute"
        bottom={0}
        width="100%">
        Logout from {session.user.username}
      </Button>
    </Box>
  );
};

export default ConversationList;
