import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { inngest } from "@/inngest/client";

export const messageRouter = createTRPCRouter({

    getMessages: baseProcedure.input(z.object({
        projectId: z.string(),
    })).query(async ({ input }) => {
        const { projectId } = input;

        const messages = await prisma.message.findMany({
            where: {
                projectId,
            },
            include: {
                fragments: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        return messages;
    }),

    createMessage: baseProcedure.input(z.object({
        content: z.string().min(1, { message: "message is required" }).max(200, { message: "message must be less than 20 characters" }),
        projectId: z.string(),
    })).mutation(async ({ input }) => {
        const { content, projectId } = input;

        const message = await prisma.message.create({
            data: {
                content,
                role: "USER",
                type: "RESULT",
                projectId,
            }
        })

        await inngest.send({
            name: "code-agent/run",
            data: {
                value: input.content,
                projectId,
            },
        });

        return message;
    })
})
