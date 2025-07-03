import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

const defaultOptions = {};

// GraphQL Document pour CreateUser
export const CreateUserDocument = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      email
      createdAt
    }
  }
`;

// Hook personnalisé pour CreateUser
export function useCreateUserMutation(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation(CreateUserDocument, options);
}

// GraphQL Document pour Login
export const LoginDocument = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
      user {
        id
        email
        username
        isAdmin
      }
    }
  }
`;

// Hook personnalisé pour Login
export function useLoginMutation(baseOptions) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation(LoginDocument, options);
}
