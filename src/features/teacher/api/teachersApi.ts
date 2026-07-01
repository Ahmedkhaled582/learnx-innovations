import clientAxios from "@/lib/axios/clientaxios";

export interface Teacher {
  id: number;
  teacherCode?: string;
  firstName: string;
  lastName: string;
  subjectId?: number;
  classId?: number;
  gender?: string;
  dateOfBirth?: string;
  qualification?: string;
  experience?: string;
  mobileNumber?: string;
  email: string;
  joiningDate?: string;
  status: boolean;
  fatherName?: string;
  motherName?: string;
  maritalStatus?: string;
  contractType?: string;
  shift?: string;
  workLocation?: string;
  bloodGroup?: string;
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
  details?: string;
  facebook?: string;
  linkedIn?: string;
  instagram?: string;
  youtube?: string;
  teacherImage?: string;
  documentName?: string;
  documentImage?: string;
  userId?: string;
}

export const getTeachers = async (): Promise<Teacher[]> => {
  const res = await clientAxios.get<Teacher[]>("/api/Teachers/get-teachers");
  return res.data;
};

export const getTeacher = async (id: number): Promise<Teacher> => {
  const res = await clientAxios.get<Teacher>(`/api/Teachers/get-teacher/${id}`);
  return res.data;
};

export const addTeacher = async (formData: FormData): Promise<any> => {
  const res = await clientAxios.post("/api/Teachers/add-teacher", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateTeacher = async (formData: FormData): Promise<any> => {
  const res = await clientAxios.put("/api/Teachers/update-teacher", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteTeacher = async (id: number): Promise<any> => {
  const res = await clientAxios.delete(`/api/Teachers/delete-teacher/${id}`);
  return res.data;
};
