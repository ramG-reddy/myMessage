import SkeletonLoader from "@/components/common/SkeletonLoader";
import MessageOperations from "@/graphql/operations/message";
import {
  MessageSubscriptionData,
  MessagesData,
  MessagesVariables,
} from "@/lib/types";
import { useQuery } from "@apollo/client";
import { Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import MessageItem from "./MessageItem";

interface MessagesProps {
  userId: string;
  conversationId: string;
}

const Messages: React.FC<MessagesProps> = ({ userId, conversationId }) => {
  const { data, loading, error, subscribeToMore } = useQuery<
    MessagesData,
    MessagesVariables
  >(MessageOperations.Query.messages, {
    variables: {
      conversationId,
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  useEffect(() => {
    let unsubscribe = subscribeToMore({
      document: MessageOperations.Subscription.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (prev, { subscriptionData }: MessageSubscriptionData) => {
        if (!subscriptionData) return prev;

        const newMessage = subscriptionData.data.messageSent;
        return Object.assign({}, prev, {
          // if sender then we have the value in the cache, no need to update with new value
          // if not the sender, need to fetch new message
          messages:
            newMessage.sender.id === userId
              ? prev.messages
              : [newMessage, ...prev.messages],
        });
      },
    });

    return () => unsubscribe();
  }, [conversationId]);

  if (error) {
    return null;
  }

  return (
    <div className="flex flex-col justify-end">
      {loading && (
        <Stack spacing={4} px={4}>
          <SkeletonLoader count={7} height="60px" width="100%" />
        </Stack>
      )}
      {data?.messages && (
        <div className="overflow-y-scroll h-[70vh]">
          {data.messages.length ? (
            <div className="flex flex-col-reverse h-full">
              {data.messages.map((message, key) => (
                <MessageItem
                  key={key}
                  message={message}
                  sentByMe={message.sender.id === userId}
                />
              ))}
            </div>
          ) : (
            <div className="h-full w-full flex justify-center items-center text-3xl">Say Hello!!👋</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Messages;
