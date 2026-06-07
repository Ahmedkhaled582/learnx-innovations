import clientAxios from "@/lib/axios/clientaxios";

export interface Student {
  id: number;
  admissionNumber: string;
  admissionDate?: string;
  rollNumber: string;
  academicYear: string;
  status: boolean;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  emailAddress: string;
  studentImage?: string;
  categoryId: number;
  classId: number;
  sectionId: number;
  parentId?: number;
  userId?: string;
  height?: string;
  weight?: string;
  bankAccountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  nationalIdentificationNumber?: string;
  previousSchoolName?: string;
  previousSchoolAddress?: string;
  currentAddress?: string;
  permanentAddress?: string;
  hostelId?: number;
  roomNo?: string;
  fatherName?: string;
  fatherPhone?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherPhone?: string;
  motherOccupation?: string;
  guardianName?: string;
  guardianEmail?: string;
  guardianPhone?: string;
  guardianOccupation?: string;
  guardianAddress?: string;
  guardianRelation?: string;
  documentName?: string;
  phoneNumber?: string;
  details?: string;
}

export const getStudents = async (): Promise<Student[]> => {
  const res = await clientAxios.get<Student[]>("/api/Students/get-students");
  return res.data;
};

export const getStudent = async (id: number): Promise<Student> => {
  const res = await clientAxios.get<Student>(`/api/Students/get-student/${id}`);
  return res.data;
};

export const addStudent = async (formData: FormData): Promise<any> => {
  const res = await clientAxios.post("/api/Students/add-student", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateStudent = async (formData: FormData): Promise<any> => {
  const res = await clientAxios.put("/api/Students/update-student", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteStudent = async (id: number): Promise<any> => {
  const res = await clientAxios.delete(`/api/Students/delete-student/${id}`);
  return res.data;
};
