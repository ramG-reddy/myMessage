import SkeletonLoader from "@/components/common/SkeletonLoader";
import ConversationOperations from "@/graphql/operations/conversation";
import {
  ConversationDeletedData,
  ConversationUpdatedData,
  ConversationsData,
  conversationData,
} from "@/lib/types";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  ConversationPopulated,
  ParticipantPopulated,
} from "../../../../../backend/src/lib/types";
import ConversationList from "./ConversationList";

interface IConversationWrapperProps {
  session: Session;
}

const ConversationWrapper: React.FC<IConversationWrapperProps> = ({
  session,
}) => {
  const router = useRouter();
  const { convoId } = router.query;
  const { id: userId } = session.user;

  const {
    data: ConversationsData,
    error: ConversationsError,
    loading: ConversationsLoading,
    subscribeToMore,
  } = useQuery<conversationData>(ConversationOperations.Queries.conversations);
  // console.log("Data for conversation query",ConversationsData);

  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: boolean },
    { userId: string; conversationId: string }
  >(ConversationOperations.Mutations.markConversionAsRead);

  useSubscription<ConversationUpdatedData, null>(
    ConversationOperations.Subscriptions.conversationUpdated,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData) return;

        const {
          conversationUpdated: { conversation: updatedConversation },
        } = subscriptionData;

        const currentlyViewingConversation = updatedConversation.id === convoId;

        if (currentlyViewingConversation) {
          onViewConversation(convoId, false);
        }
      },
    }
  );

  useSubscription<ConversationDeletedData, null>(
    ConversationOperations.Subscriptions.conversationDeleted,
    {
      onData: ({ client, data }) => {
        // console.log("HERE IS SUB DATA", data);
        const { data: subscriptionData } = data;

        if (!subscriptionData) return;

        const existing = client.readQuery<ConversationsData>({
          query: ConversationOperations.Queries.conversations,
        });

        if (!existing) return;

        const { conversations } = existing;
        const {
          conversationDeleted: { id: deletedConversationId },
        } = subscriptionData;

        client.writeQuery<ConversationsData>({
          query: ConversationOperations.Queries.conversations,
          data: {
            conversations: conversations.filter(
              (conversation) => conversation.id !== deletedConversationId
            ),
          },
        });

        router.push("/");
      },
    }
  );

  const onViewConversation = async (
    conversationId: string,
    hasSeenLatestMessage: boolean | undefined
  ) => {
    console.log("Viewing Conversation", conversationId);
    router.push({ query: { convoId: conversationId } });
    if (hasSeenLatestMessage) {
      console.log("Marked as seen already");
      return;
    }
    try {
      await markConversationAsRead({
        variables: {
          userId,
          conversationId,
        },
        optimisticResponse: {
          markConversationAsRead: true,
        },
        update: (cache) => {
          /**
           * Get conversation participants from cache
           */
          const participantsFragment = cache.readFragment<{
            participants: Array<ParticipantPopulated>;
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                  }
                  hasSeenLatestMessage
                }
              }
            `,
          });

          if (!participantsFragment) return;

          const participants = [...participantsFragment.participants];

          const userParticipantIdx = participants.findIndex(
            (p) => p.user.id === userId
          );

          if (userParticipantIdx === -1) return;

          const userParticipant = participants[userParticipantIdx];

          /**
           * Update participant to show latest message as read
           */
          participants[userParticipantIdx] = {
            ...userParticipant,
            hasSeenLatestMessage: true,
          };

          /**
           * Update cache
           */
          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdatedParticipant on Conversation {
                participants
              }
            `,
            data: {
              participants,
            },
          });
        },
      });
    } catch (e: any) {
      console.log("onViewConversation Error:", e);
    }
  };

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated };
          };
        }
      ) => {
        if (!subscriptionData.data) return prev;

        // console.log("Subscription Data", subscriptionData);

        const newConversation = subscriptionData.data.conversationCreated;

        // console.log("New Conversation", newConversation);

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  return (
    <Box
      width={{ base: "100%", md: "380px" }}
      bg={{base:"whiteAlpha.200", md: "purple.800"}}
      flexDirection="column"
      gap={1}
      py={6}
      px={3}
      display={{ base: convoId ? "none" : "flex", md: "flex" }}
      height="100vh">
      {ConversationsLoading ? (
        <SkeletonLoader count={7} height="80px" width="350px" />
      ) : (
        <ConversationList
          session={session}
          conversations={ConversationsData?.conversations}
          onViewConversation={onViewConversation}
        />
      )}
    </Box>
  );
};

export default ConversationWrapper;
