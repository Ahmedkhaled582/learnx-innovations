import * as z from "zod";

export const studentSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  emailAddress: z.string().min(1, "Email Address is required").email("Invalid email format"),
  password: z.string().optional(),
  admissionNumber: z.string().optional().default(""),
  rollNumber: z.string().optional().default(""),
  academicYear: z.string().optional().default(""),
  status: z.boolean().default(true),
  gender: z.string().optional().default(""),
  dateOfBirth: z.string().optional().default(""),
  bloodGroup: z.string().optional().default(""),
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
  height: z.string().optional().default(""),
  weight: z.string().optional().default(""),
  bankAccountNumber: z.string().optional().default(""),
  bankName: z.string().optional().default(""),
  ifscCode: z.string().optional().default(""),
  nationalIdentificationNumber: z.string().optional().default(""),
  previousSchoolName: z.string().optional().default(""),
  previousSchoolAddress: z.string().optional().default(""),
  currentAddress: z.string().optional().default(""),
  permanentAddress: z.string().optional().default(""),
  roomNo: z.string().optional().default(""),
  fatherName: z.string().optional().default(""),
  fatherPhone: z.string().optional().default(""),
  fatherOccupation: z.string().optional().default(""),
  motherName: z.string().optional().default(""),
  motherPhone: z.string().optional().default(""),
  motherOccupation: z.string().optional().default(""),
  guardianName: z.string().optional().default(""),
  guardianEmail: z.string().optional().default(""),
  guardianPhone: z.string().optional().default(""),
  guardianOccupation: z.string().optional().default(""),
  guardianAddress: z.string().optional().default(""),
  guardianRelation: z.string().optional().default(""),
  documentName: z.string().optional().default(""),
  phoneNumber: z.string().optional().default(""),
  details: z.string().optional().default(""),
});

export type StudentFormValues = z.infer<typeof studentSchema>;

export const addStudentSchema = studentSchema.extend({
  password: z.string().min(1, "Password is required"),
  classId: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 0 : Number(val)),
    z.number().int().gt(0, "Please select a Class")
  ),
  sectionId: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 0 : Number(val)),
    z.number().int().gt(0, "Please select a Section")
  ),
  categoryId: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 0 : Number(val)),
    z.number().int().gt(0, "Please select a Category")
  ),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  admissionNumber: z.string().min(1, "Admission Number is required"),
});

export type AddStudentFormValues = z.infer<typeof addStudentSchema>;

