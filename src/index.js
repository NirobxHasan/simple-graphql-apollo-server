import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import fs from "fs";
import { GraphQLJSON, GraphQLLong } from "graphql-scalars";
import path from "path";
import { fileURLToPath } from "url";
import typeDefs from "./schema/schema.js";

const __filename = fileURLToPath(import.meta.url);
console.log(__filename);
const __dirname = path.dirname(__filename);

const readJSONFile = (filename) => {
  const filePath = path.join(__dirname, `./data_source/${filename}.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const resolvers = {
  Long: GraphQLLong,
  JSON: GraphQLJSON,

  Query: {
    node: (parent, args) => {
      const nodes = readJSONFile("node");
      return nodes.find((node) => node._id === args.nodeId);
    },
    nodesByCompositeId: (parent, args) => {
      const nodes = readJSONFile("node");
      return nodes.filter((node) => node.compositeId === args.compositeId);
    },
    action: (parent, args) => {
      const actions = readJSONFile("action");
      return actions.find((action) => action._id === args.actionId);
    },

    response: (parent, args) => {
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
      return actions.filter((action) => parent.actionIds.includes(action._id));
    },
    responses: (parent) => {
      const responses = readJSONFile("response");
      if (!Array.isArray(parent.responseIds)) {
        return [];
      }
      return responses.filter((response) =>
        parent.responseIds.includes(response._id)
      );
    },
    trigger: (parent) => {
      const triggers = readJSONFile("trigger");
      return triggers.find((trigger) => trigger._id === parent.triggerId);
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

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at: ${url}`);
