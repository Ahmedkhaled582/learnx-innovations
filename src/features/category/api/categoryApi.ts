import clientAxios from "@/lib/axios/clientaxios";

export interface Category {
  id: number;
  name: string;
  status: boolean;
}

export interface AddCategoryPayload {
  name: string;
  status: boolean;
}

export interface UpdateCategoryPayload {
  id: number;
  name: string;
  status: boolean;
}

export const getCategories = async (): Promise<Category[]> => {
  const res = await clientAxios.get<Category[]>("/api/Categories/get-categories");
  return res.data;
};

export const addCategory = async (data: AddCategoryPayload) => {
  const res = await clientAxios.post("/api/Categories/add-category", data);
  return res.data;
};

export const updateCategory = async (data: UpdateCategoryPayload) => {
  const res = await clientAxios.put("/api/Categories/update-category", data);
  return res.data;
};

export const deleteCategory = async (id: number) => {
  const res = await clientAxios.delete(`/api/Categories/delete-category/${id}`);
  return res.data;
};
