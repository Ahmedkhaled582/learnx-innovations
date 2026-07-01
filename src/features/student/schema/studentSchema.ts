import * as z from "zod";

export const studentSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  emailAddress: z.string().min(1, "Email Address is required"),
  password: z.string().optional(),
  admissionNumber: z.string().optional(),
  rollNumber: z.string().optional(),
  academicYear: z.string().optional(),
  status: z.boolean().default(true),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  bloodGroup: z.string().optional(),
  categoryId: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 0 : Number(val)),
    z.number().int().default(0)
  ),
  classId: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 0 : Number(val)),
    z.number().int().default(0)
  ),
  sectionId: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 0 : Number(val)),
    z.number().int().default(0)
  ),
  height: z.string().optional(),
  weight: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
  ifscCode: z.string().optional(),
  nationalIdentificationNumber: z.string().optional(),
  previousSchoolName: z.string().optional(),
  previousSchoolAddress: z.string().optional(),
  currentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  roomNo: z.string().optional(),
  fatherName: z.string().optional(),
  fatherPhone: z.string().optional(),
  fatherOccupation: z.string().optional(),
  motherName: z.string().optional(),
  motherPhone: z.string().optional(),
  motherOccupation: z.string().optional(),
  guardianName: z.string().optional(),
  guardianEmail: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianOccupation: z.string().optional(),
  guardianAddress: z.string().optional(),
  guardianRelation: z.string().optional(),
  documentName: z.string().optional(),
  phoneNumber: z.string().optional(),
  details: z.string().optional(),
});

export type StudentFormValues = z.infer<typeof studentSchema>;


