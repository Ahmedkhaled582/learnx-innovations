import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSections,
  addSection,
  updateSection,
  deleteSection,
  Section,
  AddSectionPayload,
  UpdateSectionPayload,
} from "../api/sectionsApi";

export const useSections = () => {
  return useQuery<Section[]>({
    queryKey: ["sections"],
    queryFn: getSections,
  });
};

export const useAddSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddSectionPayload) => addSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSectionPayload) => updateSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });
};

export const useDeleteSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });
};
