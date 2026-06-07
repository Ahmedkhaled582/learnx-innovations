"use client";

import Link from "next/link";
import * as React from "react";
import { useState } from "react";
import { useStudents, useDeleteStudent } from "@/features/student/hooks/useStudent";
import { useClasses } from "@/features/classes/hooks/useClass";
import { useSections } from "@/features/sections/hooks/useSection";
import { useCategories } from "@/features/category/hooks/useCategory";
import { useToast } from "@/components/Toast";
import { GetStudentTable } from "@/features/student/template/GetStudentTable";
import { DeleteStudentModal } from "@/features/student/template/DeleteStudentModal";

export default function StudentListPage() {
  const { data: students, isLoading, error } = useStudents();
  const { data: classes } = useClasses();
  const { data: sections } = useSections();
  const { data: categories } = useCategories();

  const deleteMutation = useDeleteStudent();
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const { showToast } = useToast();

  const handleDeleteConfirm = () => {
    if (selectedStudentId !== null) {
      deleteMutation.mutate(selectedStudentId, {
        onSuccess: () => {
          showToast("success", "Student Deleted", "Successfully deleted the student record");
          
          // Close modal using bootstrap instance
          const modalElement = document.getElementById("exampleModalDelete");
          if (modalElement && typeof window !== "undefined") {
            const bootstrap = (window as any).bootstrap;
            if (bootstrap) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
              modalInstance.hide();
            }
          }
          setSelectedStudentId(null);
        },
        onError: (err: any) => {
          const errorMsg = err?.response?.data?.message || err?.message || "Failed to delete student";
          showToast("error", "Error Deleting Student", errorMsg);
        }
      });
    }
  };

  const handleOpenDeleteModal = (id: number) => {
    setSelectedStudentId(id);
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
          <h1 className="fw-semibold mb-4 h6 text-primary-light">Student List</h1>
          <div>
            <Link href="/" className="text-secondary-light hover-text-primary hover-underline">Dashboard </Link>
            <span className="text-secondary-light">/ Student List</span>
          </div>
        </div>
        <Link href="/add-new-student" className="btn btn-primary-600 d-flex align-items-center gap-6">
          <span className="d-flex text-md">
            <i className="ri-add-large-line"></i>
          </span>
          Add Student
        </Link>
      </div>

      <div className="mt-24">
        <GetStudentTable
          data={students}
          classes={classes}
          sections={sections}
          categories={categories}
          isLoading={isLoading}
          error={error}
          onDelete={handleOpenDeleteModal}
        />
      </div>

      <DeleteStudentModal
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}
