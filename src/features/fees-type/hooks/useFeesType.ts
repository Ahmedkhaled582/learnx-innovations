import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFeeTypes,
  addFeeType,
  updateFeeType,
  deleteFeeType,
  FeeType,
  AddFeeTypePayload,
  UpdateFeeTypePayload,
} from "../api/feesTypeApi";

export const useFeeTypes = () => {
  return useQuery<FeeType[]>({
    queryKey: ["feeTypes"],
    queryFn: getFeeTypes,
  });
};

export const useAddFeeType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddFeeTypePayload) => addFeeType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeTypes"] });
    },
  });
};

export const useUpdateFeeType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateFeeTypePayload) => updateFeeType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeTypes"] });
    },
  });
};

export const useDeleteFeeType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteFeeType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeTypes"] });
    },
  });
};
