"use client";

import Link from "next/link";
import * as React from "react";
import { useState } from "react";
import { useTeachers, useDeleteTeacher } from "@/features/teacher/hooks/useTeacher";
import { useClasses } from "@/features/classes/hooks/useClass";
import { useSubjects } from "@/features/subjects/hooks/useSubject";
import { useToast } from "@/components/Toast";
import { GetTeacherTable } from "@/features/teacher/template/GetTeacherTable";
import { DeleteTeacherModal } from "@/features/teacher/template/DeleteTeacherModal";

export default function TeacherListPage() {
  const { data: teachers, isLoading, error } = useTeachers();
  const { data: classes } = useClasses();
  const { data: subjects } = useSubjects();

  const deleteMutation = useDeleteTeacher();
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const { showToast } = useToast();

  const handleDeleteConfirm = () => {
    if (selectedTeacherId !== null) {
      deleteMutation.mutate(selectedTeacherId, {
        onSuccess: () => {
          showToast("success", "Teacher Deleted", "Successfully deleted the teacher record");
          
          // Close modal using bootstrap instance
          const modalElement = document.getElementById("exampleModalDelete");
          if (modalElement && typeof window !== "undefined") {
            const bootstrap = (window as any).bootstrap;
            if (bootstrap) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
              modalInstance.hide();
            }
          }
          setSelectedTeacherId(null);
        },
        onError: (err: any) => {
          const errorMsg = err?.response?.data?.message || err?.message || "Failed to delete teacher";
          showToast("error", "Error Deleting Teacher", errorMsg);
        }
      });
    }
  };

  const handleOpenDeleteModal = (id: number) => {
    setSelectedTeacherId(id);
    // Open modal using Bootstrap
    const modalElement = document.getElementById("exampleModalDelete");
    if (modalElement && typeof window !== "undefined") {
      const bootstrap = (window as any).bootstrap;
      if (bootstrap) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modalInstance.show();
      }
    }
  };

  return (
    <>
      <div className="breadcrumb d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h1 className="fw-semibold mb-4 h6 text-primary-light">Teacher List</h1>
          <div>
            <Link href="/" className="text-secondary-light hover-text-primary hover-underline">Dashboard </Link>
            <span className="text-secondary-light">/ Teacher List</span>
          </div>
        </div>
        <Link href="/add-new-teacher" className="btn btn-primary-600 d-flex align-items-center gap-6">
          <span className="d-flex text-md">
            <i className="ri-add-large-line"></i>
          </span>
          Add Teacher
        </Link>
      </div>

      <div className="mt-24">
        <GetTeacherTable
          data={teachers}
          classes={classes}
          subjects={subjects}
          isLoading={isLoading}
          error={error}
          onDelete={handleOpenDeleteModal}
        />
      </div>

      <DeleteTeacherModal
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}
