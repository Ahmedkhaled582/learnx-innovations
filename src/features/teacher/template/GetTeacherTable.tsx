import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Teacher } from "../api/teachersApi";
import { UniTable } from "@/components/shared/UniTable";
import { Class } from "@/features/classes/api/classesApi";
import { subject as Subject } from "@/features/subjects/api/subjectsApi";

interface GetTeacherTableProps {
  data?: Teacher[];
  classes?: Class[];
  subjects?: Subject[];
  isLoading: boolean;
  error: any;
  onDelete: (id: number) => void;
}

export function GetTeacherTable({
  data,
  classes,
  subjects,
  isLoading,
  error,
  onDelete,
}: GetTeacherTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);

  // Helper resolvers
  const getClassName = (classId?: number) => {
    if (!classId) return "-";
    const cls = classes?.find((c) => c.id === classId);
    return cls ? cls.name : `Class ${classId}`;
  };

  const getSubjectName = (subjectId?: number) => {
    if (!subjectId) return "-";
    const sub = subjects?.find((s) => s.id === subjectId);
    return sub ? sub.name : `Subject ${subjectId}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Define Columns
  const columns = React.useMemo<ColumnDef<Teacher, any>[]>(() => [
    {
      id: "index",
      header: "S.L",
      cell: ({ row }) => (
        <div className="form-check style-check d-flex align-items-center">
          <input className="form-check-input" type="checkbox" />
          <label className="form-check-label">
            {(row.index + 1).toString().padStart(2, "0")}
          </label>
        </div>
      ),
      size: 60,
    },
    {
      accessorKey: "teacherCode",
      header: "ID",
      cell: ({ row }) => (
        <span className="text-primary-600">{row.original.teacherCode || "-"}</span>
      ),
    },
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => {
        const teacher = row.original;
        const imgPath = teacher.teacherImage;
        const imageSrc = imgPath
          ? imgPath.startsWith("http")
            ? imgPath
            : `https://schooliq.runasp.net/${imgPath}`
          : "/assets/images/thumbs/avatar-img1.png";

        return (
          <div className="d-flex align-items-center">
            <img
              src={imageSrc}
              alt={`${teacher.firstName} ${teacher.lastName}`}
              className="flex-shrink-0 me-12 radius-8 object-fit-cover"
              style={{ width: "36px", height: "36px" }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/images/thumbs/avatar-img1.png";
              }}
            />
            <div>
              <h6 className="text-md mb-0 fw-medium flex-grow-1">
                {teacher.firstName} {teacher.lastName}
              </h6>
            </div>
          </div>
        );
      },
    },
    {
      id: "subject",
      header: "Subject",
      cell: ({ row }) => getSubjectName(row.original.subjectId),
    },
    {
      id: "class",
      header: "Class",
      cell: ({ row }) => getClassName(row.original.classId),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.email || "-",
    },
    {
      accessorKey: "mobileNumber",
      header: "Phone Number",
      cell: ({ row }) => row.original.mobileNumber || "-",
    },
    {
      accessorKey: "joiningDate",
      header: "Join Date",
      cell: ({ row }) => formatDate(row.original.joiningDate),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.status ? (
          <span className="bg-success-100 text-success-600 px-24 py-4 radius-4 fw-medium text-sm">Active</span>
        ) : (
          <span className="bg-danger-100 text-danger-600 px-24 py-4 radius-4 fw-medium text-sm">Inactive</span>
        ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="btn-group">
          <button
            type="button"
            className="text-primary-light text-xl border-0 bg-transparent"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <iconify-icon icon="tabler:dots-vertical"></iconify-icon>
          </button>
          <ul className="dropdown-menu dropdown-menu-lg-end border p-12">
            <li>
              <Link
                href={`/teacher-details?id=${row.original.id}`}
                className="dropdown-item rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2 py-6"
              >
                <i className="ri-user-3-line"></i>View Teacher
              </Link>
            </li>
            <li>
              <Link
                href={`/edit-teacher?id=${row.original.id}`}
                className="dropdown-item rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2 py-6"
              >
                <i className="ri-edit-2-line"></i>Edit
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onDelete(row.original.id)}
                className="dropdown-item rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2 py-6 border-0 bg-transparent w-100 text-start"
              >
                <i className="ri-delete-bin-6-line"></i>Delete
              </button>
            </li>
          </ul>
        </div>
      ),
    },
  ], [classes, subjects, onDelete]);

  // Filter Data
  const filteredTeachers = React.useMemo(() => {
    if (!data) return [];
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((teacher) => {
      const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
      const email = (teacher.email || "").toLowerCase();
      const code = (teacher.teacherCode || "").toLowerCase();
      const phone = (teacher.mobileNumber || "").toLowerCase();
      return (
        fullName.includes(term) ||
        email.includes(term) ||
        code.includes(term) ||
        phone.includes(term)
      );
    });
  }, [data, searchTerm]);

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
                <span className="">
                  <i className="ri-arrow-down-s-line"></i>
                </span>
              </button>
              <ul className="dropdown-menu p-12 border bg-base shadow">
                <li>
                  <button
                    type="button"
                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10 border-0 bg-transparent"
                  >
                    <i className="ri-file-3-line"></i>
                    PDF
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10 border-0 bg-transparent"
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
            <span className="">Rows per page:</span>
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
              Error loading teachers. Please try again.
            </div>
          ) : (
            <UniTable
              data={filteredTeachers}
              columns={columns}
              pageSize={pageSize}
              enablePagination={true}
              itemLabel="teachers"
            />
          )}
        </div>
      </div>
    </div>
  );
}
