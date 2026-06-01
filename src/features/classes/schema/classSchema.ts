import * as z from "zod";

export const classSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  sectionId: z.preprocess(
    (val) => (val === "" || val === undefined ? 0 : Number(val)),
    z.number().int().positive("Section is required")
  ),
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

export type ClassFormValues = z.infer<typeof classSchema>;
