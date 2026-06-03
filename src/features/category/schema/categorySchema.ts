import * as z from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  status: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return val === "true";
      }
      return Boolean(val);
    },
    z.boolean()
  ),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
