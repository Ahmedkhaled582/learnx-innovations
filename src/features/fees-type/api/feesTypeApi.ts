import clientAxios from "@/lib/axios/clientaxios";

export interface FeeType {
  id: number;
  name: string;
  isActive: boolean;
}

export interface AddFeeTypePayload {
  name: string;
  isActive: boolean;
}

export interface UpdateFeeTypePayload {
  id: number;
  name: string;
  isActive: boolean;
}

export const getFeeTypes = async (): Promise<FeeType[]> => {
  const res = await clientAxios.get<FeeType[]>("/api/FeeTypes/get-feetypes");
  return res.data;
};

export const addFeeType = async (data: AddFeeTypePayload) => {
  const res = await clientAxios.post("/api/FeeTypes/add-feetype", data);
  return res.data;
};

export const updateFeeType = async (data: UpdateFeeTypePayload) => {
  const res = await clientAxios.put("/api/FeeTypes/update-feetype", data);
  return res.data;
};

export const deleteFeeType = async (id: number) => {
  const res = await clientAxios.delete(`/api/FeeTypes/delete-feetype/${id}`);
  return res.data;
};
