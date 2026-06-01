"use client";

import Link from "next/link";
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/Toast";
import {
  useExams,
  useAddExam,
  useUpdateExam,
  useDeleteExam,
} from "@/features/exam/hooks/useExam";
import { examSchema, ExamFormValues } from "@/features/exam/schema/examSchema";
import { Exam } from "@/features/exam/api/examApi";
import { AddExamSidebar } from "@/features/exam/template/AddExamSidebar";
import { EditExamSidebar } from "@/features/exam/template/EditExamSidebar";
import { DeleteExamModal } from "@/features/exam/template/DeleteExamModal";
import { GetExamTable } from "@/features/exam/template/GetExamTable";

export default function ExamPage() {
  const { data: exams, isLoading, error } = useExams();
  const addMutation = useAddExam();
  const updateMutation = useUpdateExam();
  const deleteMutation = useDeleteExam();
  
  const { showToast } = useToast();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

  // Forms setup
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd },
  } = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema) as any,
    defaultValues: {
      name: "",
      examDate: "",
      startTime: "",
      endTime: "",
      maxMarks: 0,
      passingMarks: 0,
      subjectId: 1,
      classId: 1,
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema) as any,
  });

  // Handlers
  const handleEditClick = (exam: Exam) => {
    setSelectedExam(exam);
    resetEdit({
      name: exam.name,
      examDate: exam.examDate.split("T")[0],
      startTime: exam.startTime.slice(0, 16),
      endTime: exam.endTime.slice(0, 16),
      maxMarks: exam.maxMarks,
      passingMarks: exam.passingMarks,
      subjectId: exam.subjectId,
      classId: exam.classId,
    });
    setIsEditOpen(true);
  };

  const onSubmitAdd = (data: ExamFormValues) => {
    addMutation.mutate(
      {
        name: data.name,
        examDate: new Date(data.examDate).toISOString(),
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        maxMarks: Number(data.maxMarks),
        passingMarks: Number(data.passingMarks),
        subjectId: Number(data.subjectId),
        classId: Number(data.classId),
      },
      {
        onSuccess: () => {
          showToast("success", "Exam Added", `Successfully created exam "${data.name}"`);
          setIsAddOpen(false);
          resetAdd();
        },
        onError: (err: any) => {
          const errMsg = err?.response?.data?.message || err?.message || "Failed to add exam";
          showToast("error", "Error Adding Exam", errMsg);
        },
      }
    );
  };

  const onSubmitEdit = (data: ExamFormValues) => {
    if (!selectedExam) return;
    updateMutation.mutate(
      {
        id: selectedExam.id,
        name: data.name,
        examDate: new Date(data.examDate).toISOString(),
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        maxMarks: Number(data.maxMarks),
        passingMarks: Number(data.passingMarks),
        subjectId: Number(data.subjectId),
        classId: Number(data.classId),
      },
      {
        onSuccess: () => {
          showToast("success", "Exam Updated", `Successfully updated exam "${data.name}"`);
          setIsEditOpen(false);
          resetEdit();
          setSelectedExam(null);
        },
        onError: (err: any) => {
          const errMsg = err?.response?.data?.message || err?.message || "Failed to update exam";
          showToast("error", "Error Updating Exam", errMsg);
        },
      }
    );
  };

  const handleDelete = () => {
    if (selectedExamId !== null) {
      const targetExam = exams?.find((e) => e.id === selectedExamId);
      deleteMutation.mutate(selectedExamId, {
        onSuccess: () => {
          showToast("success", "Exam Deleted", `Successfully deleted exam "${targetExam?.name || ""}"`);
          // Close modal using Bootstrap API
          const modalElement = document.getElementById("exampleModalDelete");
          if (modalElement && typeof window !== "undefined") {
            const bootstrap = (window as any).bootstrap;
            if (bootstrap) {
              const modalInstance =
                bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
              modalInstance.hide();
            }
          }
          setSelectedExamId(null);
        },
        onError: (err: any) => {
          const errMsg = err?.response?.data?.message || err?.message || "Failed to delete exam";
          showToast("error", "Error Deleting Exam", errMsg);
        },
      });
    }
  };

  return (
    <>
      <div className="breadcrumb d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h1 className="fw-semibold mb-4 h6 text-primary-light">Exam List</h1>
          <div>
            <Link href="/" className="text-secondary-light hover-text-primary hover-underline">
              Dashboard
            </Link>
            <span className="text-secondary-light">/ Exam List</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="btn btn-primary-600 d-flex align-items-center gap-6"
        >
          <span className="d-flex text-md">
            <i className="ri-add-large-line"></i>
          </span>
          Add Exam
        </button>
      </div>

      <div className="mt-24">
        <GetExamTable
          data={exams}
          isLoading={isLoading}
          error={error}
          onEdit={handleEditClick}
          onDelete={setSelectedExamId}
        />
      </div>

      {/* Add Sidebar Component */}
      <AddExamSidebar
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleSubmitAdd(onSubmitAdd)}
        register={registerAdd}
        errors={errorsAdd}
        isPending={addMutation.isPending}
      />

      {/* Edit Sidebar Component */}
      <EditExamSidebar
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedExam(null);
        }}
        onSubmit={handleSubmitEdit(onSubmitEdit)}
        register={registerEdit}
        errors={errorsEdit}
        isPending={updateMutation.isPending}
      />

      {/* Delete Confirmation Modal Component */}
      <DeleteExamModal
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />

      {/* Controlled Overlay */}
      <div
        className={`overlay ${isAddOpen || isEditOpen ? "active" : ""}`}
        onClick={() => {
          setIsAddOpen(false);
          setIsEditOpen(false);
          setSelectedExam(null);
        }}
      />
    </>
  );
}
