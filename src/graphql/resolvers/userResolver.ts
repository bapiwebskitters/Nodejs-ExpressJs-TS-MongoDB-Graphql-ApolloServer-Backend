
export const userResolver = {
  Query: {
    getUser: async (_: any, { id }: { id: string }) => {
      // Replace with actual database query
      return { id, name: "John Doe", email: "john@example.com" };
    },
    getAllUsers: async () => {
      // Replace with actual database query
      return [
        { id: "1", name: "John Doe", email: "john@example.com" },
        { id: "2", name: "Jane Doe", email: "jane@example.com" },
      ];
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      { name, email }: { name: string; email: string }
    ) => {
      // Replace with actual database query to create a new user
      return { id: "3", name, email };
    },
  },
};