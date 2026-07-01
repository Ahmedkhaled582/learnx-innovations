import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTeachers,
  getTeacher,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  Teacher,
} from "../api/teachersApi";

export const useTeachers = () => {
  return useQuery<Teacher[]>({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });
};

export const useTeacherDetails = (id: number) => {
  return useQuery<Teacher>({
    queryKey: ["teacher", id],
    queryFn: () => getTeacher(id),
    enabled: !!id && !isNaN(id),
  });
};

export const useAddTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => addTeacher(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

export const useUpdateTeacher = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => updateTeacher(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["teacher", id] });
      }
    },
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};
