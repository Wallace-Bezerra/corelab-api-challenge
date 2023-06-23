import fastify from "fastify";
import { NoteRoutes } from "./routes/note";

const app = fastify();

app.register(NoteRoutes);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server Runnnig on http://localhost:3333");
  });
