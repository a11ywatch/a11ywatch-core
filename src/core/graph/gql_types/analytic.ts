import gql from "graphql-tag";

export const analytic = gql`
  type Analytic {
    id: ID
    pageUrl: String
    errorCount: Int
    warningCount: Int
    noticeCount: Int
    errorOccurances: String
    userId: Int
    domain: String
    adaScore: Float
  }
`;
