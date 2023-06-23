import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import z from "zod"
export async function NoteRoutes(app: FastifyInstance) {
  

  app.get("/notes", async(req, res) => {
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })
    res.send(notes)
  })

  app.post("/notes", async (req, res) => {
    const paramsSchemaBody = z.object({
      title: z.string(),
      content: z.string(),
      isFavorite: z.coerce.boolean().default(false),
      color: z.string().default("#ffffff")
    })
    const result = paramsSchemaBody.safeParse(req.body)
    if (!result.success) {
      res.send(result.error.message)
    } else {
      const { color, content, isFavorite, title } = result.data
      const note = await prisma.note.create({
        data:
        {
          title,
          content,
          color,
          isFavorite,
        }
      })
      res.send(note);
    }
  })
  

  app.delete("/notes/:id", async (req, res) => {
    const paramsSchemaId = z.object({
      id: z.string()
    })
    const result = paramsSchemaId.safeParse(req.params)
    if (!result.success) {
      res.send(result.error)
    } else {
      const { id } = result.data
      await prisma.note.delete({
        where: {
          id: id
        }
      })
    }
    res.send("Deleted")
  })
  app.patch("/notes/:id", async(req, res) => {
    const paramsSchemaId = z.object({
      id: z.string()
    })
    const { id } = paramsSchemaId.parse(req.params)
    const paramsSchemaBody = z.object({
      title: z.string(),
      content: z.string(),
      isFavorite: z.coerce.boolean().default(false),
      color: z.string().default("#ffffff")
    })
    const { title, content, color, isFavorite } = paramsSchemaBody.parse(req.body)
    const editNote = await prisma.note.update({
      where: {
        id: id,
      },
      data: {
        title,
        content,
        color,
        isFavorite,
      }
    })
    res.send(editNote)
  })
}