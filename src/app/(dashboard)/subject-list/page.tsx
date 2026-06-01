"use client"

import Link from "next/link";
import * as React from "react";
import { useState } from "react";
import { useSubjects, useAddSubject, useUpdateSubject, useDeleteSubject } from "@/features/subjects/hooks/useSubject";
import { useToast } from "@/components/Toast";
import { subject, AddSubjectPayload, UpdateSubjectPayload } from "@/features/subjects/api/subjectsApi";
import { AddSubjectSidebar } from "@/features/subjects/template/AddSubjectSidebar";
import { EditSubjectSidebar } from "@/features/subjects/template/EditSubjectSidebar";
import { DeleteSubjectModal } from "@/features/subjects/template/DeleteSubjectModal";
import { GetSubjectTable } from "@/features/subjects/template/GetSubjectTable";

export default function SubjectListPage() {
  const { data: subjects, isLoading, error } = useSubjects();
  const deleteMutation = useDeleteSubject();
  const addMutation = useAddSubject();
  const updateMutation = useUpdateSubject();

  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const { showToast } = useToast();

  // Sidebar visibility
  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const [showEditSidebar, setShowEditSidebar] = useState(false);

  // Add form state
  const [addForm, setAddForm] = useState<AddSubjectPayload>({
    name: "",
    code: "",
    teacherId: 0,
    status: true,
  });

  // Edit form state
  const [editForm, setEditForm] = useState<UpdateSubjectPayload>({
    id: 0,
    name: "",
    code: "",
    teacherId: 0,
    status: true,
  });

  // Handle Add
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(addForm, {
      onSuccess: () => {
        showToast("success", "Subject Added", `Successfully added subject "${addForm.name}"`);
        setShowAddSidebar(false);
        setAddForm({ name: "", code: "", teacherId: 0, status: true });
      },
      onError: (error: any) => {
        const errorMsg = error?.response?.data?.message || error?.message || "Failed to add subject";
        showToast("error", "Error Adding Subject", errorMsg);
      }
    });
  };

  // Handle Edit
  const openEditSidebar = (subj: subject) => {
    setEditForm({
      id: subj.id,
      name: subj.name,
      code: subj.code,
      teacherId: subj.teacherId,
      status: subj.status,
    });
    setShowEditSidebar(true);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(editForm, {
      onSuccess: () => {
        showToast("success", "Subject Updated", `Successfully updated subject "${editForm.name}"`);
        setShowEditSidebar(false);
      },
      onError: (error: any) => {
        const errorMsg = error?.response?.data?.message || error?.message || "Failed to update subject";
        showToast("error", "Error Updating Subject", errorMsg);
      }
    });
  };

  // Handle Delete
  const handleDelete = () => {
    if (selectedSubjectId !== null) {
      deleteMutation.mutate(selectedSubjectId, {
        onSuccess: () => {
          showToast("success", "Subject Deleted", "Successfully deleted subject");
          // Close modal using Bootstrap instance API
          const modalElement = document.getElementById("exampleModalDelete");
          if (modalElement && typeof window !== "undefined") {
            const bootstrap = (window as any).bootstrap;
            if (bootstrap) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
              modalInstance.hide();
            }
          }
          setSelectedSubjectId(null);
        },
        onError: (error: any) => {
          const errorMsg = error?.response?.data?.message || error?.message || "Failed to delete subject";
          showToast("error", "Error Deleting Subject", errorMsg);
        }
      });
    }
  };

  return (
    <>
      <div className="breadcrumb d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div className="">
          <h1 className="fw-semibold mb-4 h6 text-primary-light">Subjects List </h1>
          <div className="">
            <Link href="/" className="text-secondary-light hover-text-primary hover-underline">Dashboard </Link>
            <span className="text-secondary-light">/ Subjects List </span>
          </div>
        </div>
        <button type="button" onClick={() => setShowAddSidebar(true)} className="btn btn-primary-600 d-flex align-items-center gap-6">
          <span className="d-flex text-md">
            <i className="ri-add-large-line"></i>
          </span>
          Add Subject
        </button>
      </div>

      <div className="mt-24">
        <GetSubjectTable
          data={subjects}
          isLoading={isLoading}
          error={error}
          onEdit={openEditSidebar}
          onDelete={setSelectedSubjectId}
        />
      </div>

      {/* Overlay */}
      {(showAddSidebar || showEditSidebar) && (
        <div className="overlay active" onClick={() => { setShowAddSidebar(false); setShowEditSidebar(false); }}></div>
      )}

      {/* Add Sidebar Component */}
      <AddSubjectSidebar
        isOpen={showAddSidebar}
        onClose={() => setShowAddSidebar(false)}
        onSubmit={handleAdd}
        formState={addForm}
        onChange={setAddForm}
        isPending={addMutation.isPending}
      />

      {/* Edit Sidebar Component */}
      <EditSubjectSidebar
        isOpen={showEditSidebar}
        onClose={() => setShowEditSidebar(false)}
        onSubmit={handleEdit}
        formState={editForm}
        onChange={setEditForm}
        isPending={updateMutation.isPending}
      />

      {/* Delete Modal Component */}
      <DeleteSubjectModal
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}
