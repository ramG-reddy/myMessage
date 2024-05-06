import { Session } from "next-auth";
import { useRouter } from "next/router";
import { Flex } from "@chakra-ui/react";
import MessagesHeader from "./Messages/Header";
import MessageInput from "./Messages/Input";
import Messages from "./Messages/Messages";
import NoConversation from "./NoConversationSelected";
interface IFeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FC<IFeedWrapperProps> = ({ session }) => {
  const router = useRouter();
  const { convoId } = router.query;
  const userId = session.user.id;
  return (
    <Flex
      display={{ base: convoId ? "flex" : "none", md: "flex" }}
      direction="column"
      width="100%"
      px={4}>
      {convoId && typeof convoId === "string" ? (
        <>
          <Flex
            direction="column"
            overflow="hidden"
            gap={8}
            flexGrow={1}>
            <MessagesHeader userId={userId} conversationId={convoId} />
            <Messages userId={userId} conversationId={convoId} />
          </Flex>
          <MessageInput session={session} conversationId={convoId} />
        </>
      ) : (
        <NoConversation />
      )}
    </Flex>
  );
};

export default FeedWrapper;
