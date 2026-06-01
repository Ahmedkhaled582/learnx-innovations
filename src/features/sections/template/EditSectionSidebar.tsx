import * as React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SectionFormValues } from "../schema/sectionSchema";

interface EditSectionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<SectionFormValues>;
  errors: FieldErrors<SectionFormValues>;
  isPending: boolean;
}

export function EditSectionSidebar({
  isOpen,
  onClose,
  onSubmit,
  register,
  errors,
  isPending,
}: EditSectionSidebarProps) {
  return (
    <div
      className={`edit-sidebar bg-white position-fixed end-0 top-0 h-100vh overflow-y-auto z-99 max-w-700-px w-100 duration-300 ${
        isOpen ? "active-translate-0" : "translate-x-full"
      }`}
    >
      <div className="px-20 py-12 border-bottom d-flex align-items-center justify-content-between gap-20">
        <h5 className="text-lg mb-0">Edit Section</h5>
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
                htmlFor="sectionNameEdit"
                className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
              >
                Section Name
              </label>
              <input
                type="text"
                className="form-control"
                id="sectionNameEdit"
                placeholder="Enter section name"
                {...register("name")}
              />
              {errors.name && (
                <span className="text-danger-600 text-sm mt-8 d-inline-block">
                  {errors.name.message}
                </span>
              )}
            </div>
          </div>
          <div className="col-sm-12">
            <div>
              <label
                htmlFor="sectionStatusEdit"
                className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
              >
                Status
              </label>
              <select
                id="sectionStatusEdit"
                className="form-control form-select"
                {...register("status", {
                  setValueAs: (value) => value === "true",
                })}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              {errors.status && (
                <span className="text-danger-600 text-sm mt-8 d-inline-block">
                  {errors.status.message}
                </span>
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
                className="btn btn-primary-600 border border-primary-600 text-md px-28 py-12 radius-8"
              >
                {isPending ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
