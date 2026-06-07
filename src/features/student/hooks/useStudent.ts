import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudents,
  getStudent,
  addStudent,
  updateStudent,
  deleteStudent,
  Student,
} from "../api/studentsApi";

export const useStudents = () => {
  return useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: getStudents,
  });
};

export const useStudentDetails = (id: number) => {
  return useQuery<Student>({
    queryKey: ["student", id],
    queryFn: () => getStudent(id),
    enabled: !!id && !isNaN(id),
  });
};

export const useAddStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => addStudent(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useUpdateStudent = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => updateStudent(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["student", id] });
      }
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
