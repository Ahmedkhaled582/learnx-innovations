import * as z from "zod";

export const feesTypeSchema = z.object({
  name: z.string().min(1, "Fees name is required"),
  isActive: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return val === "true";
      }
      return Boolean(val);
    },
    z.boolean()
  ),
});

export type FeesTypeFormValues = z.infer<typeof feesTypeSchema>;
