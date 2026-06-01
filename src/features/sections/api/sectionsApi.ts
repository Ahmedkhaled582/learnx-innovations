import clientAxios from "@/lib/axios/clientaxios";

export interface Section {
  id: number;
  name: string;
  status: boolean;
}

export interface AddSectionPayload {
  name: string;
  status: boolean;
}

export interface UpdateSectionPayload {
  id: number;
  name: string;
  status: boolean;
}

export const getSections = async (): Promise<Section[]> => {
  const res = await clientAxios.get<Section[]>("/api/Sections/get-sections");
  return res.data;
};

export const addSection = async (data: AddSectionPayload) => {
  const res = await clientAxios.post("/api/Sections/add-section", data);
  return res.data;
};

export const updateSection = async (data: UpdateSectionPayload) => {
  const res = await clientAxios.put("/api/Sections/update-section", data);
  return res.data;
};

export const deleteSection = async (id: number) => {
  const res = await clientAxios.delete(`/api/Sections/delete-section/${id}`);
  return res.data;
};
