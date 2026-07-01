import * as z from "zod";

export const teacherSchema = z.object({
  teacherCode: z.string().optional(),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  subjectId: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 0 : Number(val)),
    z.number().int().default(0)
  ),
  classId: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 0 : Number(val)),
    z.number().int().default(0)
  ),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  qualification: z.string().optional(),
  experience: z.string().optional(),
  mobileNumber: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  joiningDate: z.string().optional(),
  status: z.boolean().default(true),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  maritalStatus: z.string().optional(),
  contractType: z.string().optional(),
  shift: z.string().optional(),
  workLocation: z.string().optional(),
  bloodGroup: z.string().optional(),
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
  details: z.string().optional(),
  facebook: z.string().optional(),
  linkedIn: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  documentName: z.string().optional(),
  userId: z.string().optional(),
  password: z.string().optional(),
});

export type TeacherFormValues = z.infer<typeof teacherSchema>;
