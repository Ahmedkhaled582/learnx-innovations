"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/Toast";
import {
  useClasses,
  useAddClass,
  useUpdateClass,
  useDeleteClass,
} from "@/features/classes/hooks/useClass";
import { useSections } from "@/features/sections/hooks/useSection";
import { Class } from "@/features/classes/api/classesApi";
import { classSchema, ClassFormValues } from "@/features/classes/schema/classSchema";

export default function ClassListPage() {
  const { data: classes, isLoading, error } = useClasses();
  const { data: sections } = useSections();
  const addMutation = useAddClass();
  const updateMutation = useUpdateClass();
  const deleteMutation = useDeleteClass();

  const { showToast } = useToast();

  // Selected class for deletion
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  // Selected class for editing
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  // Sidebar visibility
  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const [showEditSidebar, setShowEditSidebar] = useState(false);

  // React Hook Form for Add Class
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema) as any,
    defaultValues: {
      name: "",
      sectionId: 0,
      status: true,
    },
  });

  // React Hook Form for Edit Class
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema) as any,
    defaultValues: {
      name: "",
      sectionId: 0,
      status: true,
    },
  });

  // Re-initialize jQuery DataTables when the data changes
  useEffect(() => {
    if (typeof window !== "undefined" && classes && classes.length > 0) {
      const $ = (window as any).$;
      const DataTable = (window as any).DataTable;

      if ($ && DataTable) {
        // Destroy existing instance if it exists to prevent duplicate tables
        if ($.fn.DataTable.isDataTable('#dataTable')) {
          $('#dataTable').DataTable().destroy();
        }

        // Initialize DataTable
        const tableInstance = new DataTable('#dataTable', {
          searching: true,
          lengthChange: true,
          pageLength: 10,
          order: [] // Disable initial sorting to keep the default API order
        });

        // Bind custom search input
        $('.dt-search .dt-input').off('keyup').on('keyup', function (this: any) {
          tableInstance.search(this.value).draw();
        });

        // Bind custom page length select
        $('.dt-length .dt-input').off('change').on('change', function (this: any) {
          const value = $(this).val();
          tableInstance.page.len(value).draw();
        });

        return () => {
          if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').DataTable().destroy();
          }
        };
      }
    }
  }, [classes, isLoading]);

  // Helper to fetch section name by ID
  const getSectionName = (secId: number) => {
    const sec = sections?.find((s) => s.id === secId);
    return sec ? sec.name : `Section ${secId}`;
  };

  // Handle Add Form Submission
  const onAddSubmit = (data: ClassFormValues) => {
    addMutation.mutate(data, {
      onSuccess: () => {
        showToast("success", "Class Added", `Successfully added class "${data.name}"`);
        setShowAddSidebar(false);
        resetAdd();
      },
      onError: (error: any) => {
        const errorMsg = error?.response?.data?.message || error?.message || "Failed to add class";
        showToast("error", "Error Adding Class", errorMsg);
      },
    });
  };

  // Open Edit Sidebar and prepopulate form
  const openEditSidebar = (classItem: Class) => {
    setEditingClass(classItem);
    resetEdit({
      name: classItem.name,
      sectionId: classItem.sectionId,
      status: classItem.status,
    });
    setShowEditSidebar(true);
  };

  // Handle Edit Form Submission
  const onEditSubmit = (data: ClassFormValues) => {
    if (!editingClass) return;

    updateMutation.mutate(
      {
        id: editingClass.id,
        name: data.name,
        sectionId: data.sectionId,
        status: data.status,
      },
      {
        onSuccess: () => {
          showToast("success", "Class Updated", `Successfully updated class "${data.name}"`);
          setShowEditSidebar(false);
          setEditingClass(null);
          resetEdit();
        },
        onError: (error: any) => {
          const errorMsg = error?.response?.data?.message || error?.message || "Failed to update class";
          showToast("error", "Error Updating Class", errorMsg);
        },
      }
    );
  };

  // Handle Delete Class Confirmation
  const handleDelete = () => {
    if (selectedClassId !== null) {
      deleteMutation.mutate(selectedClassId, {
        onSuccess: () => {
          showToast("success", "Class Deleted", "Successfully deleted class");
          // Close modal using Bootstrap instance API
          const modalElement = document.getElementById("exampleModalDelete");
          if (modalElement && typeof window !== "undefined") {
            const bootstrap = (window as any).bootstrap;
            if (bootstrap) {
              const modalInstance =
                bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
              modalInstance.hide();
            }
          }
          setSelectedClassId(null);
        },
        onError: (error: any) => {
          const errorMsg = error?.response?.data?.message || error?.message || "Failed to delete class";
          showToast("error", "Error Deleting Class", errorMsg);
        },
      });
    }
  };

  return (
    <>
      <div className="breadcrumb d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h1 className="fw-semibold mb-4 h6 text-primary-light">Class List</h1>
          <div>
            <Link href="/" className="text-secondary-light hover-text-primary hover-underline">
              Dashboard{" "}
            </Link>
            <span className="text-secondary-light">/ Class List</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAddSidebar(true)}
          className="btn btn-primary-600 d-flex align-items-center gap-6"
        >
          <span className="d-flex text-md">
            <i className="ri-add-large-line"></i>
          </span>
          Add Class
        </button>
      </div>

      <div className="mt-24">
        <div className="card h-100">
          <div className="card-body p-0 dataTable-wrapper">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-16 px-20 py-12 border-bottom border-neutral-200">
              <div className="d-flex flex-wrap align-items-center gap-16">
                <div className="dropdown">
                  <button
                    type="button"
                    className="px-12 py-5-px border border-neutral-300 radius-8 d-flex align-items-center gap-20 "
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="d-flex align-items-center gap-1 text-secondary-light text-sm">
                      <i className="ri-file-upload-line text-md line-height-1"></i>
                      Export
                    </span>
                    <span>
                      <i className="ri-arrow-down-s-line"></i>
                    </span>
                  </button>
                  <ul className="dropdown-menu p-12 border bg-base shadow">
                    <li>
                      <button
                        type="button"
                        className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModalView"
                      >
                        <i className="ri-file-3-line"></i>
                        PDF
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModalEdit"
                      >
                        <i className="ri-file-excel-line"></i>
                        Excel
                      </button>
                    </li>
                  </ul>
                </div>
                <form className="navbar-search dt-search m-0" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="text"
                    className="dt-input bg-transparent radius-4"
                    aria-controls="dataTable"
                    name="search"
                    placeholder="Search..."
                  />
                  <iconify-icon icon="ion:search-outline" className="icon"></iconify-icon>
                </form>
              </div>
              <div className="d-flex align-items-center gap-8 text-secondary-light">
                <span>Rows per page:</span>
                <div className="dt-length">
                  <select
                    name="dataTable_length"
                    aria-controls="dataTable"
                    className="dt-input form-control form-select"
                    defaultValue="10"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-0">
              <table
                className="table bordered-table mb-0 data-table"
                id="dataTable"
                data-page-length="10"
              >
                <thead>
                  <tr>
                    <th scope="col">
                      <div className="form-check style-check d-flex align-items-center">
                        <input className="form-check-input" type="checkbox" />
                        <label className="form-check-label">S.L</label>
                      </div>
                    </th>
                    <th scope="col">Name</th>
                    <th scope="col">Section</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-20">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={5} className="text-center py-20 text-danger">
                        Error loading classes.
                      </td>
                    </tr>
                  ) : classes && classes.length > 0 ? (
                    classes.map((classItem, index) => (
                      <tr key={classItem.id}>
                        <td>
                          <div className="form-check style-check d-flex align-items-center">
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label">
                              {(index + 1).toString().padStart(2, "0")}
                            </label>
                          </div>
                        </td>
                        <td>{classItem.name}</td>
                        <td>{classItem.sectionName || getSectionName(classItem.sectionId)}</td>
                        <td>
                          {classItem.status ? (
                            <span className="bg-success-100 text-success-600 px-24 py-4 radius-4 fw-medium text-sm">
                              Active
                            </span>
                          ) : (
                            <span className="bg-danger-100 text-danger-600 px-24 py-4 radius-4 fw-medium text-sm">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="btn-group">
                            <button
                              type="button"
                              className="text-primary-light text-xl"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <iconify-icon icon="tabler:dots-vertical"></iconify-icon>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-lg-end border p-12">
                              <li>
                                <button
                                  type="button"
                                  onClick={() => openEditSidebar(classItem)}
                                  className="dropdown-item rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2 py-6 w-100 text-start"
                                >
                                  <i className="ri-edit-2-line"></i>
                                  Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  onClick={() => setSelectedClassId(classItem.id)}
                                  className="dropdown-item rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2 py-6 w-100 text-start"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModalDelete"
                                >
                                  <i className="ri-delete-bin-6-line"></i>
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-20">
                        No classes found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {(showAddSidebar || showEditSidebar) && (
        <div
          className="overlay active"
          onClick={() => {
            setShowAddSidebar(false);
            setShowEditSidebar(false);
            resetAdd();
            resetEdit();
          }}
        ></div>
      )}

      {/* Add Sidebar */}
      <div
        className={`my-sidebar bg-white position-fixed end-0 top-0 h-100vh overflow-y-auto z-99 max-w-700-px w-100 duration-300 ${
          showAddSidebar ? "active-translate-0" : "translate-x-full"
        }`}
      >
        <div className="px-20 py-12 border-bottom d-flex align-items-center justify-content-between gap-20">
          <h5 className="text-lg mb-0">Add New Class</h5>
          <button
            type="button"
            onClick={() => {
              setShowAddSidebar(false);
              resetAdd();
            }}
            className="text-danger-600 text-lg d-flex"
          >
            <i className="ri-close-large-line"></i>
          </button>
        </div>
        <form onSubmit={handleSubmitAdd(onAddSubmit)} className="d-flex flex-column p-20">
          <div className="row g-3">
            <div className="col-sm-12">
              <div>
                <label
                  htmlFor="classNameInput"
                  className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
                >
                  Class Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="classNameInput"
                  placeholder="Enter Class name"
                  {...registerAdd("name")}
                />
                {errorsAdd.name && (
                  <span className="text-danger-600 text-sm mt-8 d-inline-block">
                    {errorsAdd.name.message}
                  </span>
                )}
              </div>
            </div>
            <div className="col-sm-12">
              <div>
                <label
                  htmlFor="selectSectionTwo"
                  className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
                >
                  Section
                </label>
                <select
                  id="selectSectionTwo"
                  className="form-control form-select"
                  {...registerAdd("sectionId")}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Section
                  </option>
                  {sections?.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name}
                    </option>
                  ))}
                </select>
                {errorsAdd.sectionId && (
                  <span className="text-danger-600 text-sm mt-8 d-inline-block">
                    {errorsAdd.sectionId.message}
                  </span>
                )}
              </div>
            </div>
            <div className="col-sm-12">
              <div>
                <label
                  htmlFor="sectionStatus"
                  className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
                >
                  Status
                </label>
                <select
                  id="sectionStatus"
                  className="form-control form-select"
                  {...registerAdd("status")}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                {errorsAdd.status && (
                  <span className="text-danger-600 text-sm mt-8 d-inline-block">
                    {errorsAdd.status.message}
                  </span>
                )}
              </div>
            </div>
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-center gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddSidebar(false);
                    resetAdd();
                  }}
                  className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-50 py-11 radius-8"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="btn btn-primary-600 border border-primary-600 text-md px-28 py-12 radius-8 max-w-156-px w-100"
                >
                  {addMutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Edit Sidebar */}
      <div
        className={`edit-sidebar bg-white position-fixed end-0 top-0 h-100vh overflow-y-auto z-99 max-w-700-px w-100 duration-300 ${
          showEditSidebar ? "active-translate-0" : "translate-x-full"
        }`}
      >
        <div className="px-20 py-12 border-bottom d-flex align-items-center justify-content-between gap-20">
          <h5 className="text-lg mb-0">Edit Class</h5>
          <button
            type="button"
            onClick={() => {
              setShowEditSidebar(false);
              resetEdit();
            }}
            className="text-danger-600 text-lg d-flex"
          >
            <i className="ri-close-large-line"></i>
          </button>
        </div>
        <form onSubmit={handleSubmitEdit(onEditSubmit)} className="d-flex flex-column p-20">
          <div className="row g-3">
            <div className="col-sm-12">
              <div>
                <label
                  htmlFor="sectionNameEdit"
                  className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
                >
                  Class Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="sectionNameEdit"
                  placeholder="Enter Class name"
                  {...registerEdit("name")}
                />
                {errorsEdit.name && (
                  <span className="text-danger-600 text-sm mt-8 d-inline-block">
                    {errorsEdit.name.message}
                  </span>
                )}
              </div>
            </div>
            <div className="col-sm-12">
              <div>
                <label
                  htmlFor="selectSectionEdit"
                  className="text-sm fw-semibold text-primary-light d-inline-block mb-8"
                >
                  Section
                </label>
                <select
                  id="selectSectionEdit"
                  className="form-control form-select"
                  {...registerEdit("sectionId")}
                >
                  <option value="" disabled>
                    Select Section
                  </option>
                  {sections?.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name}
                    </option>
                  ))}
                </select>
                {errorsEdit.sectionId && (
                  <span className="text-danger-600 text-sm mt-8 d-inline-block">
                    {errorsEdit.sectionId.message}
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
                  {...registerEdit("status")}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                {errorsEdit.status && (
                  <span className="text-danger-600 text-sm mt-8 d-inline-block">
                    {errorsEdit.status.message}
                  </span>
                )}
              </div>
            </div>
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-center gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditSidebar(false);
                    resetEdit();
                  }}
                  className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-50 py-11 radius-8"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="btn btn-primary-600 border border-primary-600 text-md px-28 py-12 radius-8"
                >
                  {updateMutation.isPending ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Modal */}
      <div className="modal fade" id="exampleModalDelete" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-sm modal-dialog-centered max-w-340-px">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-body pt-32 px-36 pb-24 text-center">
              <span className="mb-16 fs-1 line-height-1 text-danger">
                <iconify-icon icon="fluent:delete-24-regular" className="menu-icon"></iconify-icon>
              </span>
              <h6 className="text-lg fw-semibold text-primary-light mb-0">
                Are you sure you want to delete this class?
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
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-grow-1 btn btn-primary-600 border border-primary-600 text-md px-16 py-12 radius-8"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
