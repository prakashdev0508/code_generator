import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { inngest } from "@/inngest/client";

export const messageRouter = createTRPCRouter({

    getMessages: baseProcedure.query(async () => {
        const messages = await prisma.message.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return messages;
    }),

    createMessage: baseProcedure.input(z.object({
        content: z.string(),
    })).mutation(async ({ input }) => {
        const { content } = input;

        const message = await prisma.message.create({
            data: {
                content,
                role: "USER",
                type: "RESULT",
            }
        })

        await inngest.send({
            name: "code-agent/run",
            data: {
                value: input.content,
            },
        });

        return message;
    })
})
