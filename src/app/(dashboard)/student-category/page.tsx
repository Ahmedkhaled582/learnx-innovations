"use client";

import Link from "next/link";
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/Toast";
import {
  useCategories,
  useAddCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/features/category/hooks/useCategory";
import { Category } from "@/features/category/api/categoryApi";
import { categorySchema, CategoryFormValues } from "@/features/category/schema/categorySchema";
import { AddCategorySidebar } from "@/features/category/template/AddCategorySidebar";
import { EditCategorySidebar } from "@/features/category/template/EditCategorySidebar";
import { DeleteCategoryModal } from "@/features/category/template/DeleteCategoryModal";
import { GetCategoryTable } from "@/features/category/template/GetCategoryTable";

export default function StudentCategoryPage() {
  const { data: categories, isLoading, error } = useCategories();
  const addMutation = useAddCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const { showToast } = useToast();

  // Selected category for deletion
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Selected category for editing
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Sidebar visibility
  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const [showEditSidebar, setShowEditSidebar] = useState(false);

  // React Hook Form for Add Category
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      name: "",
      status: true,
    },
  });

  // React Hook Form for Edit Category
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      name: "",
      status: true,
    },
  });

  // Handle Add Form Submission
  const onAddSubmit = (data: CategoryFormValues) => {
    addMutation.mutate(data, {
      onSuccess: () => {
        showToast("success", "Category Added", `Successfully added category "${data.name}"`);
        setShowAddSidebar(false);
        resetAdd();
      },
      onError: (error: any) => {
        const errorMsg = error?.response?.data?.message || error?.message || "Failed to add category";
        showToast("error", "Error Adding Category", errorMsg);
      },
    });
  };

  // Open Edit Sidebar and prepopulate form
  const openEditSidebar = (category: Category) => {
    setEditingCategory(category);
    resetEdit({
      name: category.name,
      status: category.status,
    });
    setShowEditSidebar(true);
  };

  // Handle Edit Form Submission
  const onEditSubmit = (data: CategoryFormValues) => {
    if (!editingCategory) return;

    updateMutation.mutate(
      {
        id: editingCategory.id,
        name: data.name,
        status: data.status,
      },
      {
        onSuccess: () => {
          showToast("success", "Category Updated", `Successfully updated category "${data.name}"`);
          setShowEditSidebar(false);
          setEditingCategory(null);
          resetEdit();
        },
        onError: (error: any) => {
          const errorMsg = error?.response?.data?.message || error?.message || "Failed to update category";
          showToast("error", "Error Updating Category", errorMsg);
        },
      }
    );
  };

  // Handle Delete Category Confirmation
  const handleDelete = () => {
    if (selectedCategoryId !== null) {
      deleteMutation.mutate(selectedCategoryId, {
        onSuccess: () => {
          showToast("success", "Category Deleted", "Successfully deleted category");
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
          setSelectedCategoryId(null);
        },
        onError: (error: any) => {
          const errorMsg = error?.response?.data?.message || error?.message || "Failed to delete category";
          showToast("error", "Error Deleting Category", errorMsg);
        },
      });
    }
  };

  return (
    <>
      <div className="breadcrumb d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h1 className="fw-semibold mb-4 h6 text-primary-light">Student Categories</h1>
          <div>
            <Link href="/" className="text-secondary-light hover-text-primary hover-underline">
              Dashboard{" "}
            </Link>
            <span className="text-secondary-light">/ Student Categories</span>
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
          New Category
        </button>
      </div>

      <div className="mt-24">
        <GetCategoryTable
          data={categories}
          isLoading={isLoading}
          error={error}
          onEdit={openEditSidebar}
          onDelete={setSelectedCategoryId}
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
      <AddCategorySidebar
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
      <EditCategorySidebar
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
      <DeleteCategoryModal
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}
