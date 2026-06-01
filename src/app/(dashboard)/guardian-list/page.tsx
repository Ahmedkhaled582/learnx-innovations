"use client";

import Link from "next/link";
import * as React from "react";
import { useState } from "react";
import { useGuardians, useDeleteGuardian } from "@/features/guardian/hooks/useGuardian";
import { useToast } from "@/components/Toast";
import { DeleteGuardianModal } from "@/features/guardian/template/DeleteGuardianModal";
import { GetGuardianTable } from "@/features/guardian/template/GetGuardianTable";

export default function GuardianListPage() {
  const { data: guardians, isLoading, error } = useGuardians();
  const deleteMutation = useDeleteGuardian();
  const [selectedGuardianId, setSelectedGuardianId] = useState<number | null>(null);
  const { showToast } = useToast();

  const handleDelete = () => {
    if (selectedGuardianId !== null) {
      const deletedGuardian = guardians?.find((g) => g.id === selectedGuardianId);
      
      deleteMutation.mutate(selectedGuardianId, {
        onSuccess: () => {
          showToast("success", "Guardian Deleted", `Successfully deleted ${deletedGuardian?.relation || "Guardian"} "${deletedGuardian?.name || ""}"`);
          // Close modal using Bootstrap instance API
          const modalElement = document.getElementById("exampleModalDelete");
          if (modalElement && typeof window !== "undefined") {
            const bootstrap = (window as any).bootstrap;
            if (bootstrap) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
              modalInstance.hide();
            }
          }
          setSelectedGuardianId(null);
        },
        onError: (error: any) => {
          const errorMsg = error?.response?.data?.message || error?.message || "Failed to delete guardian";
          showToast("error", "Error Deleting Guardian", errorMsg);
        }
      });
    }
  };

  return (
    <>
      <div className="breadcrumb d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h1 className="fw-semibold mb-4 h6 text-primary-light">Guardian List</h1>
          <div>
            <Link href="/" className="text-secondary-light hover-text-primary hover-underline">Dashboard </Link>
            <span className="text-secondary-light">/ Guardian List</span>
          </div>
        </div>
        <Link href="/add-new-guardian" className="btn btn-primary-600 d-flex align-items-center gap-6">
          <span className="d-flex text-md">
            <i className="ri-add-large-line"></i>
          </span>
          Add Guardian
        </Link>
      </div>

      <div className="mt-24">
        <GetGuardianTable
          data={guardians}
          isLoading={isLoading}
          error={error}
          onDelete={setSelectedGuardianId}
        />
      </div>

      {/* Delete Modal Component */}
      <DeleteGuardianModal
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}
