import { gql, useMutation, useQuery } from '@apollo/client';

// 🔹 GETTERS

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

export const GET_CONVERSATIONS = gql`
  query GetConversations {
    getConversations {
      id
      title
      participantIds
      participants {
        id
        username
        avatarUrl
      }
      lastMessage
      unreadCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_CURRENT_CONVERSATION = gql`
  query GetCurrentConversation($conversationId: String!) {
    getCurrentConversation(conversationId: $conversationId) {
      id
      title
      participantIds
      participants {
        id
        username
        avatarUrl
      }
      lastMessage
      unreadCount
      createdAt
      updatedAt
    }
  }
`;

// 🔹 MUTATIONS

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      mail
    }
  }
`;

export const CREATE_CONVERSATION = gql`
  mutation CreateConversation($input: CreateConversationInput!) {
    createConversation(input: $input) {
      id
      title
      participantIds
      createdAt
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      content
      status
      createdAt
      conversation {
        id
      }
      sender {
        id
        username
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
      user {
        id
        username
        email
      }
    }
  }
`;

// 🔹 HOOKS

export const useGetUsers = () => useQuery(GET_USERS);
export const useGetUser = (id) => useQuery(GET_USER, { variables: { id } });
export const useGetConversations = () => useQuery(GET_CONVERSATIONS);
export const useGetCurrentConversation = (conversationId) =>
  useQuery(GET_CURRENT_CONVERSATION, { variables: { conversationId } });

export const useCreateUser = () => useMutation(CREATE_USER);
export const useCreateConversation = () => useMutation(CREATE_CONVERSATION);
export const useSendMessage = () => useMutation(SEND_MESSAGE);
export const useLogin = () => useMutation(LOGIN);
