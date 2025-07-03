import { gql, useQuery, useMutation } from '@apollo/client';

// --- QUERIES ---

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      username
      email
      lastSeen
      status
      createdAt
      avatarUrl
      isAdmin
    }
  }
`;

export const useGetUsers = () => useQuery(GET_USERS);

export const GET_ME = gql`
  query GetMe {
    getMe {
      id
      username
      email
      lastSeen
      status
      createdAt
      avatarUrl
      isAdmin
    }
  }
`;

export const useGetMe = () => useQuery(GET_ME);

export const GET_USER = gql`
  query GetUser($id: String!) {
    getUser(id: $id) {
      id
      username
      email
      lastSeen
      status
      createdAt
      avatarUrl
      isAdmin
    }
  }
`;

export const useGetUser = (id) =>
  useQuery(GET_USER, {
    variables: { id },
    skip: !id,
  });

export const GET_CONVERSATIONS = gql`
  query GetConversations {
    getConversations {
      id
      title
      unreadCount
      lastMessage
      createdAt
      updatedAt
      participants {
        id
        username
        avatarUrl
      }
    }
  }
`;

export const useGetConversations = () => useQuery(GET_CONVERSATIONS);

export const GET_CURRENT_CONVERSATION = gql`
  query GetCurrentConversation($conversationId: String!) {
    getCurrentConversation(conversationId: $conversationId) {
      id
      title
      unreadCount
      lastMessage
      createdAt
      updatedAt
      participants {
        id
        username
        avatarUrl
      }
    }
  }
`;

export const useGetCurrentConversation = (conversationId) =>
  useQuery(GET_CURRENT_CONVERSATION, {
    variables: { conversationId },
    skip: !conversationId,
  });

export const GET_MESSAGES = gql`
  query GetMessages($conversationId: String!, $limit: Float) {
    getMessages(conversationId: $conversationId, limit: $limit) {
      id
      content
      status
      createdAt
      updatedAt
      sender {
        id
        username
        avatarUrl
      }
      conversation {
        id
        title
      }
    }
  }
`;

export const useGetMessages = (conversationId, limit) =>
  useQuery(GET_MESSAGES, {
    variables: { conversationId, limit },
    skip: !conversationId,
  });

// --- MUTATIONS ---

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      email
      isAdmin
      avatarUrl
    }
  }
`;

export const useCreateUser = () => useMutation(CREATE_USER);

export const CREATE_CONVERSATION = gql`
  mutation CreateConversation($input: CreateConversationInput!) {
    createConversation(input: $input) {
      id
      title
      participants {
        id
        username
      }
    }
  }
`;

export const useCreateConversation = () => useMutation(CREATE_CONVERSATION);

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      content
      status
      createdAt
      sender {
        id
        username
      }
      conversation {
        id
        title
      }
    }
  }
`;

export const useSendMessage = () => useMutation(SEND_MESSAGE);
