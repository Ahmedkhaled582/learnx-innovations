import * as z from "zod";

export const sectionSchema = z.object({
  name: z.string().min(1, "Section name is required"),
  status: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return val === "true";
      }
      return Boolean(val);
    },
    z.boolean({
      required_error: "Status is required",
    })
  ),
});

export type SectionFormValues = z.infer<typeof sectionSchema>;
