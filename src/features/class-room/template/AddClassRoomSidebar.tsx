import * as React from "react";
import { AddClassRoomPayload } from "../api/classRoomApi";

interface AddClassRoomSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formState: AddClassRoomPayload;
  onChange: (state: AddClassRoomPayload) => void;
  isPending: boolean;
}

export function AddClassRoomSidebar({
  isOpen,
  onClose,
  onSubmit,
  formState,
  onChange,
  isPending,
}: AddClassRoomSidebarProps) {
  return (
    <div
      className={`my-sidebar bg-white position-fixed end-0 top-0 h-100vh overflow-y-auto z-99 max-w-700-px w-100 duration-300 ${
        isOpen ? "active-translate-0" : "translate-x-full"
      }`}
    >
      <div className="px-20 py-12 border-bottom d-flex align-items-center justify-content-between gap-20">
        <h5 className="text-lg mb-0">Add New Class Room</h5>
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
            <div className="">
              <label
                htmlFor="className"
                className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
              >
                Class Name
              </label>
              <input
                type="text"
                className="form-control"
                id="className"
                placeholder="Enter class name"
                value={formState.className}
                onChange={(e) => onChange({ ...formState, className: e.target.value })}
              />
            </div>
          </div>
          <div className="col-sm-12">
            <div className="">
              <label
                htmlFor="roomNumber"
                className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
              >
                Room Number
              </label>
              <input
                type="text"
                className="form-control"
                id="roomNumber"
                placeholder="Enter room number"
                value={formState.roomNumber}
                onChange={(e) => onChange({ ...formState, roomNumber: e.target.value })}
              />
            </div>
          </div>
          <div className="col-sm-12">
            <div className="">
              <label
                htmlFor="capacity"
                className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
              >
                Capacity
              </label>
              <input
                type="number"
                className="form-control"
                id="capacity"
                placeholder="Enter capacity"
                value={formState.capacity || ""}
                onChange={(e) => onChange({ ...formState, capacity: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="col-sm-12">
            <div className="">
              <label
                htmlFor="floor"
                className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
              >
                Floor
              </label>
              <input
                type="text"
                className="form-control"
                id="floor"
                placeholder="Enter floor"
                value={formState.floor}
                onChange={(e) => onChange({ ...formState, floor: e.target.value })}
              />
            </div>
          </div>
          <div className="col-sm-12">
            <div className="">
              <label
                htmlFor="status"
                className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
              >
                Status
              </label>
              <select
                id="status"
                className="form-control form-select"
                value={formState.isActive ? "true" : "false"}
                onChange={(e) => onChange({ ...formState, isActive: e.target.value === "true" })}
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
