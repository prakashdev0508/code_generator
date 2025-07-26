import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { inngest } from "@/inngest/client";
import { generateSlug } from "random-word-slugs"
import { TRPCError } from "@trpc/server";

export const projectRouter = createTRPCRouter({

    getProjects: baseProcedure.query(async () => {
        const projects = await prisma.project.findMany();
        return projects;
    }),

    getOne: baseProcedure.input(z.object({
        projectId: z.string(),
    })).query(async ({ input }) => {
        const { projectId } = input;
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Project not found",
            });
        }

        return project;
    }),

    createProject: baseProcedure.input(z.object({
        name: z.string().min(1, { message: "message is required" }).max(1000, { message: "message must be less than 20 characters" }),
    })).mutation(async ({ input }) => {
        const { name } = input;

        const createdProject = await prisma.project.create({
            data: {
                name: generateSlug(2, { format: "kebab" }),

                messages: {
                    create: {
                        content: name,
                        role: "USER",
                        type: "RESULT",
                    },
                },
            },
        })

        await inngest.send({
            name: "code-agent/run",
            data: {
                value: name,
                projectId: createdProject.id,
            },
        });

        return createdProject;
    })
})
