# Simple Graphql Apollo Server

## Overview

This GraphQL API server is built using Node.js and Apollo Server. It supports the provided schema, with data sourced from JSON files. The API is authenticated using Bearer tokens.

## Technologies Used

- **Node.js**: Server-side runtime
- **Apollo Server**: GraphQL server library
- **JWT (jsonwebtoken)**: Used for token-based authentication
- **GraphQL**: Query language for the API

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/NirobxHasan/simple-graphql-apollo-server.git
cd simple-graphql-apollo-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

```bash
npm start
```

or, You can start Dev Server

```bash
npm run start:dev
```

The server will run at http://localhost:4000 by default.

### 4. Generate a Bearer Token

To authenticate your requests, generate a Bearer token by running the following script:

```bash
npm run generateToken
```

Use this token in your API requests.

#### Authentication

The API is secured with Bearer token authentication. You must include a valid JWT token in the `Authorization` header for each request:

```bash
Authorization: Bearer <your-token>
```

or, you can use this Token

```bash
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGhlcmVkaXQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Mjg3MjMwODl9.der-VFjad6dGVImSju8l7QH558ehJjYfPt0G0w5qWUc
```

## Available Queries

#### Fetch a Node by ID

```bash
query {
  action(actionId: "6530933e6a1690d2f0c78a92") {
    _id
    name
    resourceTemplate {
      name
    },
    responses: name

  }
}
```

#### Fetch Nodes by Composite ID

```bash
query {
  nodesByCompositeId(compositeId: "XTpR0HkNpxWjJ6eG") {
    _id
    name
    description
  }
}
```
