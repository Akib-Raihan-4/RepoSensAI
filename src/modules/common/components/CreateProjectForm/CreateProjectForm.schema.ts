import { z } from "zod";

export const formSchema = z.object({
  projectName: z
    .string()
    .min(2, { message: "Project name must be at least 2 characters long." }),
  githubUrl: z
    .string()
    .url({ message: "Please enter a valid repository URL." }),
  githubToken: z.string().optional(),
});

export type FormInput = z.infer<typeof formSchema>;

export const defaultValues: FormInput = {
  projectName: "",
  githubUrl: "",
  githubToken: "",
};
