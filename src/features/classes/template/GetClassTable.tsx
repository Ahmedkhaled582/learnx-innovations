import * as React from "react";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Class } from "../api/classesApi";
import { UniTable } from "@/components/shared/UniTable";

interface GetClassTableProps {
  data?: Class[];
  isLoading: boolean;
  error: any;
  sections?: { id: number; name: string }[];
  onEdit: (classItem: Class) => void;
  onDelete: (id: number) => void;
}

export function GetClassTable({
  data,
  isLoading,
  error,
  sections,
  onEdit,
  onDelete,
}: GetClassTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);

  // Helper to fetch section name by ID
  const getSectionName = React.useCallback((secId: number) => {
    const sec = sections?.find((s) => s.id === secId);
    return sec ? sec.name : `Section ${secId}`;
  }, [sections]);

  // Define Columns
  const columns = React.useMemo<ColumnDef<Class, any>[]>(() => [
    {
      id: "index",
      header: "S.L",
      cell: ({ row }) => (row.index + 1).toString().padStart(2, "0"),
      size: 60,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "section",
      header: "Section",
      cell: ({ row }) => row.original.sectionName || getSectionName(row.original.sectionId),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        row.original.status ? (
          <span className="bg-success-100 text-success-600 px-24 py-4 radius-4 fw-medium text-sm">Active</span>
        ) : (
          <span className="bg-danger-100 text-danger-600 px-24 py-4 radius-4 fw-medium text-sm">Inactive</span>
        )
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="btn-group">
          <button type="button" className="text-primary-light text-xl border-0 bg-transparent"
            data-bs-toggle="dropdown" aria-expanded="false">
            <iconify-icon icon="tabler:dots-vertical"></iconify-icon>
          </button>
          <ul className="dropdown-menu dropdown-menu-lg-end border p-12">
            <li>
              <button
                type="button"
                onClick={() => onEdit(row.original)}
                className="dropdown-item rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2 py-6 border-0 bg-transparent w-100 text-start"
              >
                <i className="ri-edit-2-line"></i>Edit
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onDelete(row.original.id)}
                className="dropdown-item rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2 py-6 w-100 text-start border-0 bg-transparent"
                data-bs-toggle="modal" data-bs-target="#exampleModalDelete">
                <i className="ri-delete-bin-6-line"></i>Delete
              </button>
            </li>
          </ul>
        </div>
      ),
    },
  ], [getSectionName, onEdit, onDelete]);

  // Filter Data
  const filteredClasses = React.useMemo(() => {
    if (!data) return [];
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((c) =>
      (c.name && c.name.toLowerCase().includes(term)) ||
      (getSectionName(c.sectionId) && getSectionName(c.sectionId).toLowerCase().includes(term))
    );
  }, [data, searchTerm, getSectionName]);

  return (
    <div className="card h-100">
      <div className="card-body p-0 dataTable-wrapper">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-16 px-20 py-12 border-bottom border-neutral-200">
          <div className="d-flex flex-wrap align-items-center gap-16">
            <div className="dropdown">
              <button
                type="button"
                className="px-12 py-5-px border border-neutral-300 radius-8 d-flex align-items-center gap-20"
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
                  >
                    <i className="ri-file-3-line"></i>
                    PDF
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
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
                name="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <iconify-icon icon="ion:search-outline" className="icon"></iconify-icon>
            </form>
          </div>
          <div className="d-flex align-items-center gap-8 text-secondary-light">
            <span>Rows per page:</span>
            <div className="dt-length">
              <select
                name="dataTable_length"
                className="dt-input form-control form-select"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
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
          {isLoading ? (
            <div className="text-center py-20">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-danger">
              Error loading classes.
            </div>
          ) : (
            <UniTable
              data={filteredClasses}
              columns={columns}
              pageSize={pageSize}
              enablePagination={true}
              itemLabel="classes"
            />
          )}
        </div>
      </div>
    </div>
  );
}
