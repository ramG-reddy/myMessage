"use client";

import MessageOperations from "@/graphql/operations/message";
import { useMutation } from "@apollo/client";
import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { ObjectID } from "bson";
import { Session } from "next-auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { SendMessageArgs } from "../../../../../../backend/src/lib/types";
import { MessagesData } from "@/lib/types";

interface IMessageInputProps {
  session: Session;
  conversationId: string;
}

const MessageInput: React.FunctionComponent<IMessageInputProps> = ({
  session,
  conversationId,
}) => {
  const [messageBody, setMessageBody] = useState<string>("");
  const [sendMessage] = useMutation<{ sendMessage: boolean }, SendMessageArgs>(
    MessageOperations.Mutation.sendMessage
  );
  const onSendMessage = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!messageBody) return toast.error("Message cannot be empty");
    console.log("Sending message:", messageBody);
    try {
      const { id: senderId } = session.user;
      const messageId = new ObjectID().toString();
      const newMessage: SendMessageArgs = {
        id: messageId,
        conversationId,
        senderId,
        body: messageBody,
      };
      setMessageBody("");
      const { data, errors } = await sendMessage({
        variables: {
          ...newMessage,
        },
        optimisticResponse: {
          sendMessage: true,
        },
        update: (cache) => {
          const existing = cache.readQuery<MessagesData>({
            query: MessageOperations.Query.messages,
            variables: {
              conversationId,
            },
          }) as MessagesData;

          cache.writeQuery<MessagesData, { conversationId: string }>({
            query: MessageOperations.Query.messages,
            variables: {
              conversationId,
            },
            data: {
              ...existing,
              messages: [
                {
                  id: messageId,
                  body: messageBody,
                  senderId: session.user.id,
                  conversationId,
                  sender: {
                    id: session.user.id,
                    username: session.user.username,
                  },
                  createdAt: new Date(Date.now()),
                  updatedAt: new Date(Date.now()),
                },
                ...existing.messages,
              ],
            },
          });
        },
      });

      if (!data?.sendMessage || errors) {
        throw new Error("Failed to send message");
      }
    } catch (error: any) {
      console.error("Failed to send message", error?.message);
      toast.error("Failed to send message");
    }
  };
  return (
    <Box py={6} width="100%">
      <form
        onSubmit={(ev) => {
          onSendMessage(ev);
        }}
        className="flex gap-2">
        <Input
          value={messageBody}
          placeholder="Type a message"
          onChange={(e) => setMessageBody(e.target.value)}
          resize="none"
        />
        <Button type="submit" bg="brand.100" px={4} py={2}>
          Send
        </Button>
      </form>
    </Box>
  );
};

export default MessageInput;
