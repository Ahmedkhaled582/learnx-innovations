import clientAxios from "@/lib/axios/clientaxios";

export interface Class {
  id: number;
  name: string;
  sectionId: number;
  sectionName?: string;
  status: boolean;
}

export interface AddClassPayload {
  name: string;
  sectionId: number;
  status: boolean;
}

export interface UpdateClassPayload {
  id: number;
  name: string;
  sectionId: number;
  status: boolean;
}

export const getClasses = async (): Promise<Class[]> => {
  const res = await clientAxios.get<Class[]>("/api/Classes/get-class");
  return res.data;
};

export const addClass = async (data: AddClassPayload) => {
  const res = await clientAxios.post("/api/Classes/add-class", data);
  return res.data;
};

export const updateClass = async (data: UpdateClassPayload) => {
  const res = await clientAxios.put("/api/Classes/update-class", data);
  return res.data;
};

export const deleteClass = async (id: number) => {
  const res = await clientAxios.delete(`/api/Classes/delete-class/${id}`);
  return res.data;
};
