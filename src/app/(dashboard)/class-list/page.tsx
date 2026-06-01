"use client";

import Link from "next/link";
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/Toast";
import {
  useClasses,
  useAddClass,
  useUpdateClass,
  useDeleteClass,
} from "@/features/classes/hooks/useClass";
import { useSections } from "@/features/sections/hooks/useSection";
import { Class } from "@/features/classes/api/classesApi";
import { classSchema, ClassFormValues } from "@/features/classes/schema/classSchema";
import { AddClassSidebar } from "@/features/classes/template/AddClassSidebar";
import { EditClassSidebar } from "@/features/classes/template/EditClassSidebar";
import { DeleteClassModal } from "@/features/classes/template/DeleteClassModal";
import { GetClassTable } from "@/features/classes/template/GetClassTable";

export default function ClassListPage() {
  const { data: classes, isLoading, error } = useClasses();
  const { data: sections } = useSections();
  const addMutation = useAddClass();
  const updateMutation = useUpdateClass();
  const deleteMutation = useDeleteClass();

  const { showToast } = useToast();

  // Selected class for deletion
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  // Selected class for editing
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  // Sidebar visibility
  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const [showEditSidebar, setShowEditSidebar] = useState(false);

  // React Hook Form for Add Class
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema) as any,
    defaultValues: {
      name: "",
      sectionId: 0,
      status: true,
    },
  });

  // React Hook Form for Edit Class
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema) as any,
    defaultValues: {
      name: "",
      sectionId: 0,
      status: true,
    },
  });

  // Handle Add Form Submission
  const onAddSubmit = (data: ClassFormValues) => {
    addMutation.mutate(data, {
      onSuccess: () => {
        showToast("success", "Class Added", `Successfully added class "${data.name}"`);
        setShowAddSidebar(false);
        resetAdd();
      },
      onError: (error: any) => {
        const errorMsg = error?.response?.data?.message || error?.message || "Failed to add class";
        showToast("error", "Error Adding Class", errorMsg);
      },
    });
  };

  // Open Edit Sidebar and prepopulate form
  const openEditSidebar = (classItem: Class) => {
    setEditingClass(classItem);
    resetEdit({
      name: classItem.name,
      sectionId: classItem.sectionId,
      status: classItem.status,
    });
    setShowEditSidebar(true);
  };

  // Handle Edit Form Submission
  const onEditSubmit = (data: ClassFormValues) => {
    if (!editingClass) return;

    updateMutation.mutate(
      {
        id: editingClass.id,
        name: data.name,
        sectionId: data.sectionId,
        status: data.status,
      },
      {
        onSuccess: () => {
          showToast("success", "Class Updated", `Successfully updated class "${data.name}"`);
          setShowEditSidebar(false);
          setEditingClass(null);
          resetEdit();
        },
        onError: (error: any) => {
          const errorMsg = error?.response?.data?.message || error?.message || "Failed to update class";
          showToast("error", "Error Updating Class", errorMsg);
        },
      }
    );
  };

  // Handle Delete Class Confirmation
  const handleDelete = () => {
    if (selectedClassId !== null) {
      deleteMutation.mutate(selectedClassId, {
        onSuccess: () => {
          showToast("success", "Class Deleted", "Successfully deleted class");
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
          setSelectedClassId(null);
        },
        onError: (error: any) => {
          const errorMsg = error?.response?.data?.message || error?.message || "Failed to delete class";
          showToast("error", "Error Deleting Class", errorMsg);
        },
      });
    }
  };

  return (
    <>
      <div className="breadcrumb d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h1 className="fw-semibold mb-4 h6 text-primary-light">Class List</h1>
          <div>
            <Link href="/" className="text-secondary-light hover-text-primary hover-underline">Dashboard </Link>
            <span className="text-secondary-light">/ Class List</span>
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
          Add Class
        </button>
      </div>

      <div className="mt-24">
        <GetClassTable
          data={classes}
          isLoading={isLoading}
          error={error}
          sections={sections}
          onEdit={openEditSidebar}
          onDelete={setSelectedClassId}
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
      <AddClassSidebar
        isOpen={showAddSidebar}
        onClose={() => {
          setShowAddSidebar(false);
          resetAdd();
        }}
        onSubmit={handleSubmitAdd(onAddSubmit)}
        register={registerAdd}
        errors={errorsAdd}
        sections={sections}
        isPending={addMutation.isPending}
      />

      {/* Edit Sidebar Component */}
      <EditClassSidebar
        isOpen={showEditSidebar}
        onClose={() => {
          setShowEditSidebar(false);
          resetEdit();
        }}
        onSubmit={handleSubmitEdit(onEditSubmit)}
        register={registerEdit}
        errors={errorsEdit}
        sections={sections}
        isPending={updateMutation.isPending}
      />

      {/* Delete Modal Component */}
      <DeleteClassModal
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}
