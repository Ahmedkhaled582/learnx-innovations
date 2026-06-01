import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { UniTable } from "@/components/shared/UniTable";

interface GetGuardianTableProps {
  data?: any[];
  isLoading: boolean;
  error: any;
  onDelete: (id: number) => void;
}

export function GetGuardianTable({
  data,
  isLoading,
  error,
  onDelete,
}: GetGuardianTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);

  // Define Columns
  const columns = React.useMemo<ColumnDef<any, any>[]>(() => [
    {
      id: "index",
      header: "S.L",
      cell: ({ row }) => (row.index + 1).toString().padStart(2, "0"),
      size: 60,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <span className="text-primary-600">GD-{row.original.id}</span>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <div>
            <h6 className="text-md mb-0 fw-medium flex-grow-1 text-secondary-light">
              {row.original.name}
            </h6>
            <span className="text-secondary-light text-xs">{row.original.relation}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "occupation",
      header: "Occupation",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
    },
    {
      id: "studentDetails",
      header: "Student Details",
      cell: ({ row }) => (
        <div className="d-flex align-items-center">
          <img src={row.original.studentProfile}
            alt="Student Avatar" className="flex-shrink-0 me-12 radius-8" width={32} height={32} />
          <div>
            <h6 className="text-sm mb-0 fw-medium text-secondary-light">
              Student ID: {row.original.studentId}
            </h6>
            <h6 className="text-sm mb-0 fw-medium text-secondary-light">
              Student Name: {row.original.studentName}
            </h6>
          </div>
        </div>
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
              <Link href={`/edit-guardian?id=${row.original.id}`}
                className="dropdown-item rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2 py-6">
                <i className="ri-edit-2-line"></i>Edit
              </Link>
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
  ], [onDelete]);

  // Filter Data
  const filteredGuardians = React.useMemo(() => {
    if (!data) return [];
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((guardian) =>
      (guardian.name && guardian.name.toLowerCase().includes(term)) ||
      (guardian.relation && guardian.relation.toLowerCase().includes(term)) ||
      (guardian.occupation && guardian.occupation.toLowerCase().includes(term)) ||
      (guardian.phone && guardian.phone.toLowerCase().includes(term)) ||
      (guardian.studentName && guardian.studentName.toLowerCase().includes(term))
    );
  }, [data, searchTerm]);

  return (
    <div className="card h-100">
      <div className="card-body p-0 dataTable-wrapper">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-16 px-20 py-12 border-bottom border-neutral-200">
          <div className="d-flex flex-wrap align-items-center gap-16">
            <div className="dropdown">
              <button type="button"
                className="px-12 py-5-px border border-neutral-300 radius-8 d-flex align-items-center gap-20"
                data-bs-toggle="dropdown" aria-expanded="false">
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
                  <button type="button"
                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10">
                    <i className="ri-file-3-line"></i>
                    PDF
                  </button>
                </li>
                <li>
                  <button type="button"
                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10">
                    <i className="ri-file-excel-line"></i>
                    Excel
                  </button>
                </li>
              </ul>
            </div>
            <form className="navbar-search dt-search m-0" onSubmit={(e) => e.preventDefault()}>
              <input type="text" className="dt-input bg-transparent radius-4"
                name="search" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <iconify-icon icon="ion:search-outline" className="icon"></iconify-icon>
            </form>
          </div>
          <div className="d-flex align-items-center gap-8 text-secondary-light">
            <span>
              Rows per page:
            </span>
            <div className="dt-length">
              <select name="dataTable_length"
                className="dt-input form-control form-select" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
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
              Error loading guardians.
            </div>
          ) : (
            <UniTable
              data={filteredGuardians}
              columns={columns}
              pageSize={pageSize}
              enablePagination={true}
              itemLabel="guardians"
            />
          )}
        </div>
      </div>
    </div>
  );
}
