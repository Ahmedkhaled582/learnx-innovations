"use client";

import Link from "next/link";
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/Toast";
import {
  useSections,
  useAddSection,
  useUpdateSection,
  useDeleteSection,
} from "@/features/sections/hooks/useSection";
import { Section } from "@/features/sections/api/sectionsApi";
import { sectionSchema, SectionFormValues } from "@/features/sections/schema/sectionSchema";
import { AddSectionSidebar } from "@/features/sections/template/AddSectionSidebar";
import { EditSectionSidebar } from "@/features/sections/template/EditSectionSidebar";
import { DeleteSectionModal } from "@/features/sections/template/DeleteSectionModal";
import { GetSectionTable } from "@/features/sections/template/GetSectionTable";

export default function SectionListPage() {
  const { data: sections, isLoading, error } = useSections();
  const addMutation = useAddSection();
  const updateMutation = useUpdateSection();
  const deleteMutation = useDeleteSection();

  const { showToast } = useToast();

  // Selected section for deletion
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  
  // Selected section for editing
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  // Sidebar visibility
  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const [showEditSidebar, setShowEditSidebar] = useState(false);

  // React Hook Form for Add Section
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd },
  } = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema) as any,
    defaultValues: {
      name: "",
      status: true,
    },
  });

  // React Hook Form for Edit Section
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema) as any,
    defaultValues: {
      name: "",
      status: true,
    },
  });

  // Handle Add Form Submission
  const onAddSubmit = (data: SectionFormValues) => {
    addMutation.mutate(data, {
      onSuccess: () => {
        showToast("success", "Section Added", `Successfully added section "${data.name}"`);
        setShowAddSidebar(false);
        resetAdd();
      },
      onError: (error: any) => {
        const errorMsg = error?.response?.data?.message || error?.message || "Failed to add section";
        showToast("error", "Error Adding Section", errorMsg);
      },
    });
  };

  // Open Edit Sidebar and prepopulate form
  const openEditSidebar = (section: Section) => {
    setEditingSection(section);
    resetEdit({
      name: section.name,
      status: section.status,
    });
    setShowEditSidebar(true);
  };

  // Handle Edit Form Submission
  const onEditSubmit = (data: SectionFormValues) => {
    if (!editingSection) return;

    updateMutation.mutate(
      {
        id: editingSection.id,
        name: data.name,
        status: data.status,
      },
      {
        onSuccess: () => {
          showToast("success", "Section Updated", `Successfully updated section "${data.name}"`);
          setShowEditSidebar(false);
          setEditingSection(null);
          resetEdit();
        },
        onError: (error: any) => {
          const errorMsg = error?.response?.data?.message || error?.message || "Failed to update section";
          showToast("error", "Error Updating Section", errorMsg);
        },
      }
    );
  };

  // Handle Delete Section Confirmation
  const handleDelete = () => {
    if (selectedSectionId !== null) {
      deleteMutation.mutate(selectedSectionId, {
        onSuccess: () => {
          showToast("success", "Section Deleted", "Successfully deleted section");
          // Close modal using Bootstrap instance API
          const modalElement = document.getElementById("exampleModalDelete");
          if (modalElement && typeof window !== "undefined") {
            const bootstrap = (window as any).bootstrap;
            if (bootstrap) {
              const modalInstance =
                bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
              modalInstance.hide();
            }
          }
          setSelectedSectionId(null);
        },
        onError: (error: any) => {
          const errorMsg = error?.response?.data?.message || error?.message || "Failed to delete section";
          showToast("error", "Error Deleting Section", errorMsg);
        },
      });
    }
  };

  return (
    <>
      <div className="breadcrumb d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h1 className="fw-semibold mb-4 h6 text-primary-light">Section Details</h1>
          <div>
            <Link href="/" className="text-secondary-light hover-text-primary hover-underline">
              Dashboard{" "}
            </Link>
            <span className="text-secondary-light">/ Section Details</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAddSidebar(true)}
          className="btn btn-primary-600 d-flex align-items-center gap-6"
        >
          <span className="d-flex text-md">
            <i className="ri-add-large-line"></i>
          </span>
          Add Section
        </button>
      </div>

      <div className="mt-24">
        <GetSectionTable
          data={sections}
          isLoading={isLoading}
          error={error}
          onEdit={openEditSidebar}
          onDelete={setSelectedSectionId}
        />
      </div>

      {/* Overlay */}
      {(showAddSidebar || showEditSidebar) && (
        <div
          className="overlay active"
          onClick={() => {
            setShowAddSidebar(false);
            setShowEditSidebar(false);
            resetAdd();
            resetEdit();
          }}
        ></div>
      )}

      {/* Add Sidebar Component */}
      <AddSectionSidebar
        isOpen={showAddSidebar}
        onClose={() => {
          setShowAddSidebar(false);
          resetAdd();
        }}
        onSubmit={handleSubmitAdd(onAddSubmit)}
        register={registerAdd}
        errors={errorsAdd}
        isPending={addMutation.isPending}
      />

      {/* Edit Sidebar Component */}
      <EditSectionSidebar
        isOpen={showEditSidebar}
        onClose={() => {
          setShowEditSidebar(false);
          resetEdit();
        }}
        onSubmit={handleSubmitEdit(onEditSubmit)}
        register={registerEdit}
        errors={errorsEdit}
        isPending={updateMutation.isPending}
      />

      {/* Delete Modal Component */}
      <DeleteSectionModal
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}
