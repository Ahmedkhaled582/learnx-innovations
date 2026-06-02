"use client";

import Link from "next/link";
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/Toast";
import {
  useFeeTypes,
  useAddFeeType,
  useUpdateFeeType,
  useDeleteFeeType,
} from "@/features/fees-type/hooks/useFeesType";
import { FeeType } from "@/features/fees-type/api/feesTypeApi";
import { feesTypeSchema, FeesTypeFormValues } from "@/features/fees-type/schema/feesTypeSchema";
import { AddFeesTypeSidebar } from "@/features/fees-type/template/AddFeesTypeSidebar";
import { EditFeesTypeSidebar } from "@/features/fees-type/template/EditFeesTypeSidebar";
import { DeleteFeesTypeModal } from "@/features/fees-type/template/DeleteFeesTypeModal";
import { GetFeesTypeTable } from "@/features/fees-type/template/GetFeesTypeTable";

export default function FeesTypePage() {
  const { data: feeTypes, isLoading, error } = useFeeTypes();
  const addMutation = useAddFeeType();
  const updateMutation = useUpdateFeeType();
  const deleteMutation = useDeleteFeeType();

  const { showToast } = useToast();

  // Selected fee type for deletion
  const [selectedFeeTypeId, setSelectedFeeTypeId] = useState<number | null>(null);

  // Selected fee type for editing
  const [editingFeeType, setEditingFeeType] = useState<FeeType | null>(null);

  // Sidebar visibility
  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const [showEditSidebar, setShowEditSidebar] = useState(false);

  // React Hook Form for Add Fees Type
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd },
  } = useForm<FeesTypeFormValues>({
    resolver: zodResolver(feesTypeSchema) as any,
    defaultValues: {
      name: "",
      isActive: true,
    },
  });

  // React Hook Form for Edit Fees Type
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<FeesTypeFormValues>({
    resolver: zodResolver(feesTypeSchema) as any,
    defaultValues: {
      name: "",
      isActive: true,
    },
  });

  // Handle Add Form Submission
  const onAddSubmit = (data: FeesTypeFormValues) => {
    addMutation.mutate(data, {
      onSuccess: () => {
        showToast("success", "Fees Type Added", `Successfully added fees type "${data.name}"`);
        setShowAddSidebar(false);
        resetAdd();
      },
      onError: (error: any) => {
        const errorMsg = error?.response?.data?.message || error?.message || "Failed to add fees type";
        showToast("error", "Error Adding Fees Type", errorMsg);
      },
    });
  };

  // Open Edit Sidebar and prepopulate form
  const openEditSidebar = (feeType: FeeType) => {
    setEditingFeeType(feeType);
    resetEdit({
      name: feeType.name,
      isActive: feeType.isActive,
    });
    setShowEditSidebar(true);
  };

  // Handle Edit Form Submission
  const onEditSubmit = (data: FeesTypeFormValues) => {
    if (!editingFeeType) return;

    updateMutation.mutate(
      {
        id: editingFeeType.id,
        name: data.name,
        isActive: data.isActive,
      },
      {
        onSuccess: () => {
          showToast("success", "Fees Type Updated", `Successfully updated fees type "${data.name}"`);
          setShowEditSidebar(false);
          setEditingFeeType(null);
          resetEdit();
        },
        onError: (error: any) => {
          const errorMsg = error?.response?.data?.message || error?.message || "Failed to update fees type";
          showToast("error", "Error Updating Fees Type", errorMsg);
        },
      }
    );
  };

  // Handle Delete Fees Type Confirmation
  const handleDelete = () => {
    if (selectedFeeTypeId !== null) {
      deleteMutation.mutate(selectedFeeTypeId, {
        onSuccess: () => {
          showToast("success", "Fees Type Deleted", "Successfully deleted fees type");
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
          setSelectedFeeTypeId(null);
        },
        onError: (error: any) => {
          const errorMsg = error?.response?.data?.message || error?.message || "Failed to delete fees type";
          showToast("error", "Error Deleting Fees Type", errorMsg);
        },
      });
    }
  };

  return (
    <>
      <div className="breadcrumb d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h1 className="fw-semibold mb-4 h6 text-primary-light">Fees Type</h1>
          <div>
            <Link href="/" className="text-secondary-light hover-text-primary hover-underline">
              Dashboard{" "}
            </Link>
            <span className="text-secondary-light">/ Fees Type</span>
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
          Add Fees Type
        </button>
      </div>

      <div className="mt-24">
        <GetFeesTypeTable
          data={feeTypes}
          isLoading={isLoading}
          error={error}
          onEdit={openEditSidebar}
          onDelete={setSelectedFeeTypeId}
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
      <AddFeesTypeSidebar
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
      <EditFeesTypeSidebar
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
      <DeleteFeesTypeModal
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}
