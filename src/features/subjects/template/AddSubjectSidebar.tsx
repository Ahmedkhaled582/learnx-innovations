import * as React from "react";
import { AddSubjectPayload } from "../api/subjectsApi";

interface AddSubjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formState: AddSubjectPayload;
  onChange: (state: AddSubjectPayload) => void;
  isPending: boolean;
}

export function AddSubjectSidebar({
  isOpen,
  onClose,
  onSubmit,
  formState,
  onChange,
  isPending,
}: AddSubjectSidebarProps) {
  return (
    <div
      className={`my-sidebar bg-white position-fixed end-0 top-0 h-100vh overflow-y-auto z-99 max-w-700-px w-100 duration-300 ${
        isOpen ? "active-translate-0" : "translate-x-full"
      }`}
    >
      <div className="px-20 py-12 border-bottom d-flex align-items-center justify-content-between gap-20">
        <h5 className="text-lg mb-0">Add New Subject</h5>
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
                htmlFor="subjectName"
                className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
              >
                Subject Name
              </label>
              <input
                type="text"
                className="form-control"
                id="subjectName"
                placeholder="Enter subject name"
                value={formState.name}
                onChange={(e) => onChange({ ...formState, name: e.target.value })}
              />
            </div>
          </div>
          <div className="col-sm-12">
            <div>
              <label
                htmlFor="subjectCode"
                className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
              >
                Subject Code
              </label>
              <input
                type="text"
                className="form-control"
                id="subjectCode"
                placeholder="Enter subject code"
                value={formState.code}
                onChange={(e) => onChange({ ...formState, code: e.target.value })}
              />
            </div>
          </div>
          <div className="col-sm-12">
            <div>
              <label
                htmlFor="teacherId"
                className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
              >
                Teacher ID
              </label>
              <input
                type="number"
                className="form-control"
                id="teacherId"
                placeholder="Enter teacher ID"
                value={formState.teacherId || ""}
                onChange={(e) => onChange({ ...formState, teacherId: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="col-sm-12">
            <div>
              <label
                htmlFor="subjectStatus"
                className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
              >
                Status
              </label>
              <select
                id="subjectStatus"
                className="form-control form-select"
                value={formState.status ? "true" : "false"}
                onChange={(e) => onChange({ ...formState, status: e.target.value === "true" })}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
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
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
