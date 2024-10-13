import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import fs from "fs";
import { GraphQLJSON, GraphQLLong } from "graphql-scalars";
import path from "path";
import { fileURLToPath } from "url";
import authContext from "./context/authContext.js";
import typeDefs from "./schema/schema.js";

const __filename = fileURLToPath(import.meta.url);
console.log(__filename);
const __dirname = path.dirname(__filename);

const readJSONFile = (filename) => {
  const filePath = path.join(__dirname, `./data_source/${filename}.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const checkAuth = (context) => {
  if (!context.user) {
    throw new Error("Authentication required");
  }
};

const resolvers = {
  Long: GraphQLLong,
  JSON: GraphQLJSON,

  Query: {
    node: (parent, args, context) => {
      checkAuth(context);
      const nodes = readJSONFile("node");
      const node = nodes.find((node) => node._id === args.nodeId);

      if (!node) return null;
      return {
        ...node,
        triggerId: node.trigger || null,
        responseIds: node.responses || null,
        actionIds: node.actions || null,
        parentIds: node.parents || null,
      };
    },
    nodesByCompositeId: (parent, args, context) => {
      checkAuth(context);
      const nodes = readJSONFile("node");
      return nodes.filter((node) => node.compositeId === args.compositeId);
    },
    action: (parent, args, context) => {
      checkAuth(context);
      const actions = readJSONFile("action");
      return actions.find((action) => action._id === args.actionId);
    },

    response: (parent, args, context) => {
      checkAuth(context);
      const responses = readJSONFile("response");
      return responses.find((response) => response._id === args.responseId);
    },
  },

  NodeObject: {
    actions: (parent) => {
      const actions = readJSONFile("action");
      if (!Array.isArray(parent.actionIds)) {
        return [];
      }

      return parent.actionIds.map((actionId) => {
        const action = actions.find((action) => action._id === actionId);
        return action || null;
      });
    },
    responses: (parent) => {
      const responses = readJSONFile("response");
      if (!Array.isArray(parent.responseIds)) {
        return [];
      }

      return parent.responseIds.map((responseId) => {
        const response = responses.find(
          (response) => response._id === responseId
        );
        return response || null;
      });
    },
    parents: (parent) => {
      const nodes = readJSONFile("node");
      if (!Array.isArray(parent.parentIds)) {
        return [];
      }
      return parent.parentIds.map((parentId) => {
        const node = nodes.find((node) => node._id === parentId);
        return node || null;
      });
    },
    trigger: (parent) => {
      const triggers = readJSONFile("trigger");
      return triggers.find((trigger) => trigger._id === parent.trigger);
    },
    resourceTemplate: (parent) => {
      const templates = readJSONFile("resourceTemplate");
      return templates.find(
        (template) => template._id === parent.resourceTemplateId
      );
    },
  },

  Action: {
    resourceTemplate: (parent) => {
      const templates = readJSONFile("resourceTemplate");
      return templates.find(
        (template) => template._id === parent.resourceTemplateId
      );
    },
  },

  Trigger: {
    resourceTemplate: (parent) => {
      const templates = readJSONFile("resourceTemplate");
      return templates.find(
        (template) => template._id === parent.resourceTemplateId
      );
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(
  server,
  {
    context: async ({ req }) => authContext(req),
  },
  {
    listen: { port: 4000 },
  }
);

console.log(`🚀 Server ready at: ${url}`);
