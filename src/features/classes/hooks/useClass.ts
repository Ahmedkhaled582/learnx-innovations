import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getClasses,
  addClass,
  updateClass,
  deleteClass,
  Class,
  AddClassPayload,
  UpdateClassPayload,
} from "../api/classesApi";

export const useClasses = () => {
  return useQuery<Class[]>({
    queryKey: ["classes"],
    queryFn: getClasses,
  });
};

export const useAddClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddClassPayload) => addClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateClassPayload) => updateClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};
