import * as React from "react";

interface DeleteFeesTypeModalProps {
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteFeesTypeModal({ onConfirm, isPending }: DeleteFeesTypeModalProps) {
  return (
    <div className="modal fade" id="exampleModalDelete" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-sm modal-dialog-centered max-w-340-px">
        <div className="modal-content radius-16 bg-base">
          <div className="modal-body pt-32 px-36 pb-24 text-center">
            <span className="mb-16 fs-1 line-height-1 text-danger">
              <iconify-icon icon="fluent:delete-24-regular" className="menu-icon"></iconify-icon>
            </span>
            <h6 className="text-lg fw-semibold text-primary-light mb-0">
              Are you sure you want to delete this fees type?
            </h6>
            <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
              <button
                type="button"
                data-bs-dismiss="modal"
                className="flex-grow-1 border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-24 py-11 radius-8"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isPending}
                className="flex-grow-1 btn btn-primary-600 border border-primary-600 text-md px-16 py-12 radius-8"
              >
                {isPending ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
