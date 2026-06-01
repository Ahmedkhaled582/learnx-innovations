import * as React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ExamFormValues } from "../schema/examSchema";

interface AddExamSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<ExamFormValues>;
  errors: FieldErrors<ExamFormValues>;
  isPending: boolean;
}

export function AddExamSidebar({
  isOpen,
  onClose,
  onSubmit,
  register,
  errors,
  isPending,
}: AddExamSidebarProps) {
  return (
    <div
      className={`my-sidebar bg-white position-fixed end-0 top-0 h-100vh overflow-y-auto z-99 max-w-700-px w-100 duration-300 ${
        isOpen ? "active-translate-0" : "translate-x-full"
      }`}
    >
      <div className="px-20 py-12 border-bottom d-flex align-items-center justify-content-between gap-20">
        <h5 className="text-lg mb-0">Add New Exam</h5>
        <button
          type="button"
          onClick={onClose}
          className="text-danger-600 text-lg d-flex border-0 bg-transparent"
        >
          <i className="ri-close-large-line"></i>
        </button>
      </div>
      <form onSubmit={onSubmit} className="d-flex flex-column p-20">
        <div className="row g-3">
          <div className="col-sm-12">
            <div>
              <label
                htmlFor="examNm"
                className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
              >
                Exam Name
              </label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                id="examNm"
                placeholder="Enter Exam name"
                {...register("name")}
              />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>
          </div>
          <div className="col-sm-6">
            <div>
              <label
                htmlFor="examDate"
                className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
              >
                Exam Date
              </label>
              <input
                type="date"
                className={`form-control ${errors.examDate ? "is-invalid" : ""}`}
                id="examDate"
                {...register("examDate")}
              />
              {errors.examDate && (
                <div className="invalid-feedback">{errors.examDate.message}</div>
              )}
            </div>
          </div>
          <div className="col-sm-6">
            <div>
              <label
                htmlFor="startTime"
                className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
              >
                Start Time
              </label>
              <input
                type="datetime-local"
                className={`form-control ${errors.startTime ? "is-invalid" : ""}`}
                id="startTime"
                {...register("startTime")}
              />
              {errors.startTime && (
                <div className="invalid-feedback">{errors.startTime.message}</div>
              )}
            </div>
          </div>
          <div className="col-sm-6">
            <div>
              <label
                htmlFor="endTime"
                className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
              >
                End Time
              </label>
              <input
                type="datetime-local"
                className={`form-control ${errors.endTime ? "is-invalid" : ""}`}
                id="endTime"
                {...register("endTime")}
              />
              {errors.endTime && (
                <div className="invalid-feedback">{errors.endTime.message}</div>
              )}
            </div>
          </div>
          <div className="col-sm-6">
            <div>
              <label
                htmlFor="maxMarks"
                className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
              >
                Max Marks
              </label>
              <input
                type="number"
                className={`form-control ${errors.maxMarks ? "is-invalid" : ""}`}
                id="maxMarks"
                placeholder="Enter Max Marks"
                {...register("maxMarks")}
              />
              {errors.maxMarks && (
                <div className="invalid-feedback">{errors.maxMarks.message}</div>
              )}
            </div>
          </div>
          <div className="col-sm-6">
            <div>
              <label
                htmlFor="passingMarks"
                className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
              >
                Passing Marks
              </label>
              <input
                type="number"
                className={`form-control ${errors.passingMarks ? "is-invalid" : ""}`}
                id="passingMarks"
                placeholder="Enter Passing Marks"
                {...register("passingMarks")}
              />
              {errors.passingMarks && (
                <div className="invalid-feedback">{errors.passingMarks.message}</div>
              )}
            </div>
          </div>
          <div className="col-sm-6">
            <div>
              <label
                htmlFor="subjectId"
                className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
              >
                Subject ID
              </label>
              <input
                type="number"
                className={`form-control ${errors.subjectId ? "is-invalid" : ""}`}
                id="subjectId"
                placeholder="Enter Subject ID"
                {...register("subjectId")}
              />
              {errors.subjectId && (
                <div className="invalid-feedback">{errors.subjectId.message}</div>
              )}
            </div>
          </div>
          <div className="col-sm-6">
            <div>
              <label
                htmlFor="classId"
                className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
              >
                Class ID
              </label>
              <input
                type="number"
                className={`form-control ${errors.classId ? "is-invalid" : ""}`}
                id="classId"
                placeholder="Enter Class ID"
                {...register("classId")}
              />
              {errors.classId && (
                <div className="invalid-feedback">{errors.classId.message}</div>
              )}
            </div>
          </div>
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-center gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-50 py-11 radius-8"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="btn btn-primary-600 border border-primary-600 text-md px-28 py-12 radius-8 max-w-156-px w-100"
              >
                {isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
