import { ConversationPopulated, MessagePopulated } from "../../../backend/src/lib/types"
// * User

export interface ICreateUsername {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface ICreateUsernameVars {
  username: string;
}

export interface ISearchUsersInput {
  username: string;
}

export interface searchedUser  {
  id: String,
  username: String
}

export interface ISearchUsersData {
  searchUsers: { id: string; username: string }[];
}

// * Conversation

export interface ConversationsData {
  conversations: Array<ConversationPopulated>;
}

export interface createConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface createConversationInput {
  participantsIds: Array<String>
}

export interface conversationData {
  conversations : Array<ConversationPopulated>
}

export interface ConversationUpdatedData {
  conversationUpdated: {
    conversation: ConversationPopulated;
  };
}

export interface ConversationDeletedData {
  conversationDeleted: {
    id: string;
  };
}

// * Message

export interface MessagesData {
  messages: Array<MessagePopulated>
}

export interface MessagesVariables {
  conversationId: string;
}

export interface MessageSubscriptionData {
  subscriptionData: {
    data: {
      messageSent: MessagePopulated;
    };
  };
}