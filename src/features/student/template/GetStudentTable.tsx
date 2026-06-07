import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Student } from "../api/studentsApi";
import { UniTable } from "@/components/shared/UniTable";
import { Class } from "@/features/classes/api/classesApi";
import { Section } from "@/features/sections/api/sectionsApi";
import { Category } from "@/features/category/api/categoryApi";

interface GetStudentTableProps {
  data?: Student[];
  classes?: Class[];
  sections?: Section[];
  categories?: Category[];
  isLoading: boolean;
  error: any;
  onDelete: (id: number) => void;
}

export function GetStudentTable({
  data,
  classes,
  sections,
  categories,
  isLoading,
  error,
  onDelete,
}: GetStudentTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);

  // Helper resolvers
  const getClassName = (classId: number, sectionId: number) => {
    const cls = classes?.find((c) => c.id === classId);
    const sec = sections?.find((s) => s.id === sectionId);
    if (cls && sec) return `${cls.name} (${sec.name})`;
    if (cls) return cls.name;
    return `Class ${classId}`;
  };

  const getCategoryName = (categoryId: number) => {
    const cat = categories?.find((c) => c.id === categoryId);
    return cat ? cat.name : `Category ${categoryId}`;
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
  const columns = React.useMemo<ColumnDef<Student, any>[]>(() => [
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
      accessorKey: "admissionNumber",
      header: "Admission No",
      cell: ({ row }) => (
        <span className="text-primary-600">{row.original.admissionNumber || "-"}</span>
      ),
    },
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => {
        const student = row.original;
        const imgPath = student.studentImage;
        const imageSrc = imgPath
          ? imgPath.startsWith("http")
            ? imgPath
            : `https://schooliq.runasp.net/${imgPath}`
          : "/assets/images/thumbs/avatar-img1.png";

        return (
          <div className="d-flex align-items-center">
            <img
              src={imageSrc}
              alt={`${student.firstName} ${student.lastName}`}
              className="flex-shrink-0 me-12 radius-8 object-fit-cover"
              style={{ width: "36px", height: "36px" }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/images/thumbs/avatar-img1.png";
              }}
            />
            <div>
              <h6 className="text-md mb-0 fw-medium flex-grow-1">
                {student.firstName} {student.lastName}
              </h6>
              <span className="text-xs text-secondary-light">
                Roll No: <span className="fw-semibold">{student.rollNumber || "-"}</span>
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: "class",
      header: "Class",
      cell: ({ row }) => getClassName(row.original.classId, row.original.sectionId),
    },
    {
      accessorKey: "dateOfBirth",
      header: "Date of Birth",
      cell: ({ row }) => formatDate(row.original.dateOfBirth),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => (
        <span className="text-capitalize">{row.original.gender || "-"}</span>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Mobile Number",
      cell: ({ row }) => row.original.phoneNumber || row.original.fatherPhone || "-",
    },
    {
      id: "category",
      header: "Category",
      cell: ({ row }) => getCategoryName(row.original.categoryId),
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
                href={`/student-details?id=${row.original.id}`}
                className="dropdown-item rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2 py-6"
              >
                <i className="ri-user-3-line"></i>View Student
              </Link>
            </li>
            <li>
              <Link
                href={`/edit-student?id=${row.original.id}`}
                className="dropdown-item rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2 py-6"
              >
                <i className="ri-edit-2-line"></i>Edit
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-2 py-6 border-0 bg-transparent w-100 text-start"
              >
                <i className="ri-money-dollar-box-line"></i>Collect Fees
              </button>
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
  ], [classes, sections, categories, onDelete]);

  // Filter Data
  const filteredStudents = React.useMemo(() => {
    if (!data) return [];
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const email = (student.emailAddress || "").toLowerCase();
      const roll = (student.rollNumber || "").toLowerCase();
      const admission = (student.admissionNumber || "").toLowerCase();
      return (
        fullName.includes(term) ||
        email.includes(term) ||
        roll.includes(term) ||
        admission.includes(term)
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
              Error loading students. Please try again.
            </div>
          ) : (
            <UniTable
              data={filteredStudents}
              columns={columns}
              pageSize={pageSize}
              enablePagination={true}
              itemLabel="students"
            />
          )}
        </div>
      </div>
    </div>
  );
}
