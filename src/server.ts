import { Elysia, t } from "elysia";
import { v4 as uuidv4 } from 'uuid';
import { users } from "./db/schemas";
import { db } from "./db/connection";
import { count, eq } from "drizzle-orm";
import { nullable } from "zod";

interface Person {
    id: string,
    nickname: string,
    name: string,
    birth: string,
    stack: string[] | null
}

const persons: Person[] = [];

const app = new Elysia()
    .post('/pessoas', async ({ body, set }) => {
        const newPerson: Person = {
            id: uuidv4(),
            nickname: body.nickname,
            name: body.name,
            birth: body.birth,
            stack: body.stack
        }
        try {
            await db.insert(users).values({
                id: newPerson.id,
                nickname: newPerson.nickname,
                name: newPerson.name,
                birth: newPerson.birth,
                stack: newPerson.stack?.toString(),
            });
            set.status = 201;
            persons.push(newPerson);
            console.log(persons);
        } catch (error) {
            set.status = 500;
            return error
        }
    },{
        body: t.Object(
            {
                nickname: t.String({
                    maxLength: 32,
                    error: "Apelido inválido (Excedeu 32 caracteres)",
                }),
                name: t.String({
                    maxLength: 100,
                    error: "Nome inválido"
                }),
                birth: t.String({
                    format: 'date-time',
                    error: "Data inválida"
                }),
                stack: t.Nullable(t.Array(t.String({
                    maxLength: 32,
                    error: "Stack inválida"
                })))
            },
            {
                error: "Algo deu errado!"
            }
        )
    })
    .get("/pessoas/:id", async ({ params, set }) => {
        console.log("Parâmetro id recebido:", params.id);

        const result = await db.select()
            .from(users)
            .where(eq(users.id, params.id));

        console.log("Resultado da consulta:", result);
        return result;
    })
    .get("/pessoas?t=", () => 'buscar pessoa')
    .get("/contagem-pessoas", async () => {
        const [result] = await db.select({ count: count() }).from(users);
        console.log(result.count);
        return result.count;
    })
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
