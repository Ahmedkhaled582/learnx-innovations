"use client";

import Link from "next/link";
import * as React from "react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useClasses } from "@/features/classes/hooks/useClass";
import { useSections } from "@/features/sections/hooks/useSection";
import { useCategories } from "@/features/category/hooks/useCategory";
import { useStudentDetails, useDeleteStudent } from "@/features/student/hooks/useStudent";
import { useToast } from "@/components/Toast";

function StudentDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const idStr = searchParams.get("id");
  const studentId = idStr ? Number(idStr) : 0;

  // Fetch student details
  const { data: student, isLoading: isStudentLoading, error: studentError } = useStudentDetails(studentId);

  // Fetch dropdown data for ID mapping
  const { data: classes } = useClasses();
  const { data: sections } = useSections();
  const { data: categories } = useCategories();

  // Delete/Suspend mutation
  const deleteMutation = useDeleteStudent();

  // Active Sidebar State
  const [activeSidebar, setActiveSidebar] = useState<"login" | "leave" | "fees" | null>(null);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<"details" | "attendance" | "leave" | "fees" | "exam" | "library">("details");

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(studentId, {
      onSuccess: () => {
        showToast("success", "Student Suspended", "Successfully suspended the student record");
        
        // Hide modal
        const modalElement = document.getElementById("exampleModalDelete");
        if (modalElement && typeof window !== "undefined") {
          const bootstrap = (window as any).bootstrap;
          if (bootstrap) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();
          }
        }
        router.push("/student-list");
      },
      onError: (err: any) => {
        const errorMsg = err?.response?.data?.message || err?.message || "Failed to suspend student";
        showToast("error", "Error", errorMsg);
      }
    });
  };

  if (isStudentLoading) {
    return (
      <div className="text-center py-50">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading student profile...</span>
        </div>
      </div>
    );
  }

  if (studentError || !student) {
    return (
      <div className="text-center py-50 text-danger">
        Failed to load student details. Verify the student ID or try again.
      </div>
    );
  }

  // Lookups
  const classNameVal = classes?.find((c) => c.id === student.classId)?.name || `Class (ID: ${student.classId})`;
  const sectionNameVal = sections?.find((s) => s.id === student.sectionId)?.name || `Section (ID: ${student.sectionId})`;
  const categoryNameVal = categories?.find((cat) => cat.id === student.categoryId)?.name || `Category (ID: ${student.categoryId})`;

  // Image helpers
  const studentPhotoUrl = student.studentImage
    ? (student.studentImage.startsWith("http") ? student.studentImage : `https://schooliq.runasp.net/${student.studentImage}`)
    : "/assets/images/thumbs/student-details-img.png";

  return (
    <>
      <div className="breadcrumb d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h1 className="fw-semibold mb-4 h6 text-primary-light">Student Details</h1>
          <div>
            <Link href="/" className="text-secondary-light hover-text-primary hover-underline">Dashboard </Link>
            <Link href="/student-list" className="text-secondary-light hover-text-primary hover-underline"> / Student</Link>
            <span className="text-secondary-light">/ Student Details</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setActiveSidebar("login")}
          className="btn btn-primary-600 d-flex align-items-center gap-6 bg-base text-primary-light bg-hover-primary-600"
        >
          <span className="d-flex text-md">
            <i className="ri-lock-2-line"></i>
          </span>
          Login Details
        </button>
      </div>

      <div className="mt-24">
        {/* Main Card */}
        <div className="card h-100">
          <div className="card-body p-24">
            <div className="d-flex gap-32 flex-md-row flex-column">
              <div className="max-w-300-px w-100 text-center">
                <figure className="mb-24 w-120-px h-120-px mx-auto rounded-circle overflow-hidden">
                  <img
                    src={studentPhotoUrl}
                    alt={`${student.firstName} Photo`}
                    className="w-100 h-100 object-fit-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/assets/images/thumbs/student-details-img.png";
                    }}
                  />
                </figure>
                <h2 className="h6 text-primary-light mb-16 fw-semibold">{student.firstName} {student.lastName}</h2>
                <p className="mb-0">
                  Admission No: <span className="text-primary-600 fw-semibold">{student.admissionNumber}</span>
                </p>
                <p className="mb-0">
                  Roll No: <span className="text-primary-light fw-semibold">{student.rollNumber || "N/A"}</span>
                </p>
                <div className="mt-32 d-flex gap-16 w-100">
                  <button
                    type="button"
                    className="btn border fw-medium border-danger-600 bg-hover-danger-200 text-danger-600 text-md d-flex justify-content-center align-items-center gap-8 flex-grow-1 px-12 py-8 radius-8"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalDelete"
                  >
                    <span className="d-flex text-lg">
                      <i className="ri-delete-bin-2-line"></i>
                    </span>
                    Suspend
                  </button>
                  <Link
                    href={`/edit-student?id=${studentId}`}
                    className="btn btn-primary-600 border fw-medium border-primary-600 text-md d-flex justify-content-center align-items-center gap-8 flex-grow-1 px-12 py-8 radius-8"
                  >
                    <span className="d-flex text-lg">
                      <i className="ri-edit-line"></i>
                    </span>
                    Edit
                  </Link>
                </div>
              </div>
              <div>
                <span className="h-100 w-1-px bg-neutral-200 d-md-block d-none"></span>
              </div>
              <div className="flex-grow-1">
                <div className="pb-16 border-bottom d-flex align-items-center justify-content-between gap-20">
                  <h3 className="h6 text-primary-light text-lg mb-0 fw-semibold">Personal Info</h3>
                  <span className={`px-16 py-4 radius-4 fw-medium text-sm ${student.status ? "bg-success-100 text-success-600" : "bg-neutral-200 text-secondary-light"}`}>
                    {student.status ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="mt-16 d-flex flex-column gap-8">
                  <div className="d-flex gap-4">
                    <span className="fw-semibold text-sm text-primary-light w-110-px">Class</span>
                    <span className="fw-normal text-sm text-secondary-light">: {classNameVal}</span>
                  </div>
                  <div className="d-flex gap-4">
                    <span className="fw-semibold text-sm text-primary-light w-110-px">Section</span>
                    <span className="fw-normal text-sm text-secondary-light">: {sectionNameVal}</span>
                  </div>
                  <div className="d-flex gap-4">
                    <span className="fw-semibold text-sm text-primary-light w-110-px">Roll No</span>
                    <span className="fw-normal text-sm text-secondary-light">: {student.rollNumber || "N/A"}</span>
                  </div>
                  <div className="d-flex gap-4">
                    <span className="fw-semibold text-sm text-primary-light w-110-px">Gender</span>
                    <span className="fw-normal text-sm text-secondary-light">: {student.gender || "N/A"}</span>
                  </div>
                  <div className="d-flex gap-4">
                    <span className="fw-semibold text-sm text-primary-light w-110-px">Date Of Birth</span>
                    <span className="fw-normal text-sm text-secondary-light">
                      : {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="d-flex gap-4">
                    <span className="fw-semibold text-sm text-primary-light w-110-px">Category</span>
                    <span className="fw-normal text-sm text-secondary-light">: {categoryNameVal}</span>
                  </div>
                  <div className="d-flex gap-4">
                    <span className="fw-semibold text-sm text-primary-light w-110-px">Academic Year</span>
                    <span className="fw-normal text-sm text-secondary-light">: {student.academicYear}</span>
                  </div>
                  <div className="d-flex gap-4">
                    <span className="fw-semibold text-sm text-primary-light w-110-px">Phone Number</span>
                    <span className="fw-normal text-sm text-primary-600">: {student.phoneNumber || "N/A"}</span>
                  </div>
                  <div className="d-flex gap-4">
                    <span className="fw-semibold text-sm text-primary-light w-110-px">Email</span>
                    <span className="fw-normal text-sm text-primary-600">: {student.emailAddress}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Pill Headers */}
        <div className="my-16">
          <ul className="nav nav-pills bordered-tab mb-3" id="pills-tab" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link d-flex align-items-center gap-8 fw-medium text-sm text-capitalize bg-transparent px-20 py-12 ${activeTab === "details" ? "active" : "text-secondary-light"}`}
                onClick={() => setActiveTab("details")}
                type="button"
              >
                <span className="d-flex tab-icon line-height-1 text-md">
                  <i className="ri-group-line"></i>
                </span>
                Student Details
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link d-flex align-items-center gap-8 fw-medium text-sm text-capitalize bg-transparent px-20 py-12 ${activeTab === "attendance" ? "active" : "text-secondary-light"}`}
                onClick={() => setActiveTab("attendance")}
                type="button"
              >
                <span className="d-flex tab-icon line-height-1 text-md">
                  <i className="ri-calendar-check-line"></i>
                </span>
                Attendance
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link d-flex align-items-center gap-8 fw-medium text-sm text-capitalize bg-transparent px-20 py-12 ${activeTab === "leave" ? "active" : "text-secondary-light"}`}
                onClick={() => setActiveTab("leave")}
                type="button"
              >
                <span className="d-flex tab-icon line-height-1 text-md">
                  <i className="ri-login-box-line"></i>
                </span>
                Leave
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link d-flex align-items-center gap-8 fw-medium text-sm text-capitalize bg-transparent px-20 py-12 ${activeTab === "fees" ? "active" : "text-secondary-light"}`}
                onClick={() => setActiveTab("fees")}
                type="button"
              >
                <span className="d-flex tab-icon line-height-1 text-md">
                  <i className="ri-money-dollar-box-line"></i>
                </span>
                Fees
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link d-flex align-items-center gap-8 fw-medium text-sm text-capitalize bg-transparent px-20 py-12 ${activeTab === "exam" ? "active" : "text-secondary-light"}`}
                onClick={() => setActiveTab("exam")}
                type="button"
              >
                <span className="d-flex tab-icon line-height-1 text-md">
                  <i className="ri-file-edit-line"></i>
                </span>
                Exam
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link d-flex align-items-center gap-8 fw-medium text-sm text-capitalize bg-transparent px-20 py-12 ${activeTab === "library" ? "active" : "text-secondary-light"}`}
                onClick={() => setActiveTab("library")}
                type="button"
              >
                <span className="d-flex tab-icon line-height-1 text-md">
                  <i className="ri-book-line"></i>
                </span>
                Library
              </button>
            </li>
          </ul>

          <div className="tab-content" id="pills-tabContent">
            {/* Tab Pane: Details */}
            {activeTab === "details" && (
              <div className="tab-pane fade show active">
                <div className="row gy-4">
                  <div className="col-12">
                    <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
                      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                        <h6 className="text-lg fw-semibold mb-0">Parent & Guardian Details</h6>
                      </div>
                      <div className="card-body p-0">
                        {/* Father Info */}
                        {student.fatherName && (
                          <div className="bg-hover-neutral-50 p-20 border-bottom">
                            <div className="row g-4 align-items-center">
                              <div className="col-sm-4">
                                <div className="d-flex align-items-center gap-12">
                                  <figure className="w-48-px h-48-px rounded-circle overflow-hidden mb-0">
                                    <img src="/assets/images/thumbs/guardian-img1.png" alt="Father" className="w-100 h-100 object-fit-cover" />
                                  </figure>
                                  <div>
                                    <h6 className="text-md mb-2 fw-medium">{student.fatherName}</h6>
                                    <span className="text-secondary-light text-sm">Father</span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <h6 className="text-md mb-2 fw-medium">Phone</h6>
                                <span className="text-secondary-light text-sm">{student.fatherPhone || "N/A"}</span>
                              </div>
                              <div className="col-sm-4">
                                <h6 className="text-md mb-2 fw-medium">Occupation</h6>
                                <span className="text-secondary-light text-sm">{student.fatherOccupation || "N/A"}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Mother Info */}
                        {student.motherName && (
                          <div className="bg-hover-neutral-50 p-20 border-bottom">
                            <div className="row g-4 align-items-center">
                              <div className="col-sm-4">
                                <div className="d-flex align-items-center gap-12">
                                  <figure className="w-48-px h-48-px rounded-circle overflow-hidden mb-0">
                                    <img src="/assets/images/thumbs/guardian-img2.png" alt="Mother" className="w-100 h-100 object-fit-cover" />
                                  </figure>
                                  <div>
                                    <h6 className="text-md mb-2 fw-medium">{student.motherName}</h6>
                                    <span className="text-secondary-light text-sm">Mother</span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <h6 className="text-md mb-2 fw-medium">Phone</h6>
                                <span className="text-secondary-light text-sm">{student.motherPhone || "N/A"}</span>
                              </div>
                              <div className="col-sm-4">
                                <h6 className="text-md mb-2 fw-medium">Occupation</h6>
                                <span className="text-secondary-light text-sm">{student.motherOccupation || "N/A"}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Guardian Info */}
                        {student.guardianName && (
                          <div className="bg-hover-neutral-50 p-20">
                            <div className="row g-4 align-items-center">
                              <div className="col-sm-4">
                                <div className="d-flex align-items-center gap-12">
                                  <figure className="w-48-px h-48-px rounded-circle overflow-hidden mb-0">
                                    <img src="/assets/images/thumbs/guardian-img1.png" alt="Guardian" className="w-100 h-100 object-fit-cover" />
                                  </figure>
                                  <div>
                                    <h6 className="text-md mb-2 fw-medium">{student.guardianName}</h6>
                                    <span className="text-secondary-light text-sm">Guardian ({student.guardianRelation || "Other"})</span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <h6 className="text-md mb-2 fw-medium">Phone / Email</h6>
                                <span className="text-secondary-light text-sm">
                                  {student.guardianPhone || "N/A"} {student.guardianEmail ? ` / ${student.guardianEmail}` : ""}
                                </span>
                              </div>
                              <div className="col-sm-4">
                                <h6 className="text-md mb-2 fw-medium">Occupation & Address</h6>
                                <span className="text-secondary-light text-sm">
                                  {student.guardianOccupation || "N/A"} ({student.guardianAddress || "No Address"})
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Previous School Details */}
                  <div className="col-md-6">
                    <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
                      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                        <h6 className="text-lg fw-semibold mb-0">Previous School Details</h6>
                      </div>
                      <div className="card-body p-20">
                        <div className="row gy-4">
                          <div className="col-sm-12">
                            <h6 className="text-md mb-2 fw-medium">Previous School Name</h6>
                            <span className="text-secondary-light text-sm">{student.previousSchoolName || "N/A"}</span>
                          </div>
                          <div className="col-sm-12">
                            <h6 className="text-md mb-2 fw-medium">Previous School Address</h6>
                            <span className="text-secondary-light text-sm">{student.previousSchoolAddress || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="col-md-6">
                    <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
                      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                        <h6 className="text-lg fw-semibold mb-0">Address</h6>
                      </div>
                      <div className="card-body p-20">
                        <div className="row gy-4">
                          <div className="col-sm-12">
                            <h6 className="text-md mb-2 fw-medium">Current Address</h6>
                            <span className="text-secondary-light text-sm">{student.currentAddress || "N/A"}</span>
                          </div>
                          <div className="col-sm-12">
                            <h6 className="text-md mb-2 fw-medium">Permanent Address</h6>
                            <span className="text-secondary-light text-sm">{student.permanentAddress || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="col-md-6">
                    <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
                      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                        <h6 className="text-lg fw-semibold mb-0">Bank Details</h6>
                      </div>
                      <div className="card-body p-20">
                        <div className="row gy-4">
                          <div className="col-sm-4">
                            <h6 className="text-md mb-2 fw-medium">Bank Name</h6>
                            <span className="text-secondary-light text-sm">{student.bankName || "N/A"}</span>
                          </div>
                          <div className="col-sm-4">
                            <h6 className="text-md mb-2 fw-medium">Account Number</h6>
                            <span className="text-secondary-light text-sm">{student.bankAccountNumber || "N/A"}</span>
                          </div>
                          <div className="col-sm-4">
                            <h6 className="text-md mb-2 fw-medium">IFSC Code</h6>
                            <span className="text-secondary-light text-sm">{student.ifscCode || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Medical Details */}
                  <div className="col-md-6">
                    <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
                      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                        <h6 className="text-lg fw-semibold mb-0">Medical Details</h6>
                      </div>
                      <div className="card-body p-20">
                        <div className="row gy-4">
                          <div className="col-sm-4">
                            <h6 className="text-md mb-2 fw-medium">Blood Group</h6>
                            <span className="text-secondary-light text-sm">{student.bloodGroup || "N/A"}</span>
                          </div>
                          <div className="col-sm-4">
                            <h6 className="text-md mb-2 fw-medium">Height</h6>
                            <span className="text-secondary-light text-sm">{student.height || "N/A"}</span>
                          </div>
                          <div className="col-sm-4">
                            <h6 className="text-md mb-2 fw-medium">Weight</h6>
                            <span className="text-secondary-light text-sm">{student.weight || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upload Documents Details */}
                  <div className="col-md-6">
                    <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
                      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                        <h6 className="text-lg fw-semibold mb-0">Documents</h6>
                      </div>
                      <div className="card-body p-20">
                        {student.documentName ? (
                          <div className="p-10 border radius-8">
                            <div className="d-flex align-items-center justify-content-between gap-20">
                              <div className="d-flex align-items-center gap-12">
                                <span className="w-36-px h-36-px radius-4 bg-neutral-50 d-flex justify-content-center align-items-center text-xl">
                                  <i className="ri-file-text-line"></i>
                                </span>
                                <span className="text-md text-secondary-light">{student.documentName}</span>
                              </div>
                              {student.documentName && (
                                <a
                                  href={student.documentName.startsWith("http") ? student.documentName : `https://schooliq.runasp.net/${student.documentName}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="w-36-px h-36-px radius-4 bg-primary-50 bg-hover-primary-100 text-primary-600 d-flex justify-content-center align-items-center text-xl"
                                >
                                  <i className="ri-download-2-line"></i>
                                </a>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-secondary-light text-sm">No documents uploaded.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hostel Details */}
                  <div className="col-md-6">
                    <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
                      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                        <h6 className="text-lg fw-semibold mb-0">Hostel</h6>
                      </div>
                      <div className="card-body p-20">
                        <div className="row gy-4">
                          <div className="col-sm-6">
                            <h6 className="text-md mb-2 fw-medium">Room No.</h6>
                            <span className="text-secondary-light text-sm">{student.roomNo || "N/A"}</span>
                          </div>
                          <div className="col-sm-6">
                            <h6 className="text-md mb-2 fw-medium">Hostel ID</h6>
                            <span className="text-secondary-light text-sm">{student.hostelId || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Student Description Details */}
                  <div className="col-12">
                    <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
                      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                        <h6 className="text-lg fw-semibold mb-0">Description</h6>
                      </div>
                      <div className="card-body p-20">
                        <p className="text-secondary-light text-sm mb-0">
                          {student.details || "No custom details provided for this student record."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Static Mock Tab: Attendance */}
            {activeTab === "attendance" && (
              <div className="tab-pane fade show active">
                <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
                  <div className="card-header border-bottom bg-base py-16 px-24">
                    <h6 className="text-lg fw-semibold mb-0">Attendance Status (Mock Record)</h6>
                  </div>
                  <div className="card-body p-20">
                    <div className="d-flex align-items-center justify-content-around flex-wrap gap-16 py-12">
                      <span className="text-success-600 fw-semibold text-lg">Present: 227</span>
                      <span className="text-danger-600 fw-semibold text-lg">Absent: 12</span>
                      <span className="text-info-600 fw-semibold text-lg">Late: 5</span>
                    </div>
                    <div className="table-responsive mt-12">
                      <table className="table border">
                        <thead>
                          <tr>
                            <th>Month</th>
                            {Array.from({ length: 30 }, (_, i) => (
                              <th key={i}>{i + 1}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>May</td>
                            {Array.from({ length: 30 }, (_, i) => (
                              <td key={i} className="text-success-600 fw-semibold">
                                {i % 7 === 0 ? "A" : "P"}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Static Mock Tab: Leave */}
            {activeTab === "leave" && (
              <div className="tab-pane fade show active">
                <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
                  <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                    <h6 className="text-lg fw-semibold mb-0">Leave Applications</h6>
                    <button
                      type="button"
                      onClick={() => setActiveSidebar("leave")}
                      className="btn btn-primary-600 btn-sm"
                    >
                      Apply Leave
                    </button>
                  </div>
                  <div className="card-body p-20">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Leave Type</th>
                          <th>From Date</th>
                          <th>To Date</th>
                          <th>Reason</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Sickness</td>
                          <td>01 May 2025</td>
                          <td>03 May 2025</td>
                          <td>Fever and cold</td>
                          <td><span className="bg-success-100 text-success-600 px-8 py-2 radius-4 text-xs">Approved</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Static Mock Tab: Fees */}
            {activeTab === "fees" && (
              <div className="tab-pane fade show active">
                <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
                  <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                    <h6 className="text-lg fw-semibold mb-0">Fees Summary</h6>
                    <button
                      type="button"
                      onClick={() => setActiveSidebar("fees")}
                      className="btn btn-primary-600 btn-sm"
                    >
                      Collect Fees
                    </button>
                  </div>
                  <div className="card-body p-20">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Invoice No</th>
                          <th>Fees Type</th>
                          <th>Amount</th>
                          <th>Date</th>
                          <th>Payment Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>#INV-10928</td>
                          <td>Tuition Fees</td>
                          <td>$700.50</td>
                          <td>12 May 2025</td>
                          <td>Bank Transfer</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Static Mock Tab: Exam */}
            {activeTab === "exam" && (
              <div className="tab-pane fade show active">
                <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
                  <div className="card-header border-bottom bg-base py-16 px-24">
                    <h6 className="text-lg fw-semibold mb-0">Exam Results</h6>
                  </div>
                  <div className="card-body p-20">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Max Marks</th>
                          <th>Passing Marks</th>
                          <th>Marks Obtained</th>
                          <th>Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Mathematics</td>
                          <td>100</td>
                          <td>40</td>
                          <td>92</td>
                          <td>A+</td>
                        </tr>
                        <tr>
                          <td>Physics</td>
                          <td>100</td>
                          <td>40</td>
                          <td>88</td>
                          <td>A</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Static Mock Tab: Library */}
            {activeTab === "library" && (
              <div className="tab-pane fade show active">
                <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
                  <div className="card-header border-bottom bg-base py-16 px-24">
                    <h6 className="text-lg fw-semibold mb-0">Library Issued Books</h6>
                  </div>
                  <div className="card-body p-20">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Book Title</th>
                          <th>Author</th>
                          <th>Issue Date</th>
                          <th>Return Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Objective Physics</td>
                          <td>D.C. Pandey</td>
                          <td>05 May 2025</td>
                          <td>05 Jun 2025</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* React Slide-over Sidebar: Login Details */}
      <div className={`my-sidebar bg-white position-fixed end-0 top-0 h-100vh overflow-y-auto z-99 max-w-700-px w-100 translate-x-full duration-300 ${activeSidebar === "login" ? "active-translate-0" : ""}`}>
        <div className="px-20 py-12 border-bottom d-flex align-items-center justify-content-between gap-20">
          <h5 className="text-lg mb-0">Login Details</h5>
          <button type="button" onClick={() => setActiveSidebar(null)} className="close-my-sidebar text-danger-600 text-lg d-flex bg-transparent border-0">
            <i className="ri-close-large-line"></i>
          </button>
        </div>
        <div className="p-20">
          <div className="d-flex align-items-center gap-20 mb-24">
            <figure className="w-72-px h-72-px rounded-circle overflow-hidden mb-0">
              <img src={studentPhotoUrl} alt="Student" className="w-100 h-100 object-fit-cover" />
            </figure>
            <div className="flex-grow-1">
              <h2 className="text-xl text-primary-light mb-4">{student.firstName} {student.lastName}</h2>
              <p className="mb-0">Roll No: <span className="text-primary-light fw-semibold">{student.rollNumber || "N/A"}</span></p>
            </div>
          </div>
          <table className="table bordered-table w-100">
            <thead>
              <tr>
                <th className="text-start">User Type</th>
                <th className="text-start">Email</th>
                <th className="text-start">Password</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-start">Student</td>
                <td className="text-start">{student.emailAddress}</td>
                <td className="text-start">••••••••</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* React Slide-over Sidebar: Apply Leave */}
      <div className={`my-sidebar bg-white position-fixed end-0 top-0 h-100vh overflow-y-auto z-99 max-w-700-px w-100 translate-x-full duration-300 ${activeSidebar === "leave" ? "active-translate-0" : ""}`}>
        <div className="px-20 py-12 border-bottom d-flex align-items-center justify-content-between gap-20">
          <h5 className="text-lg mb-0">Apply Leave</h5>
          <button type="button" onClick={() => setActiveSidebar(null)} className="close-apply-leave text-danger-600 text-lg d-flex bg-transparent border-0">
            <i className="ri-close-large-line"></i>
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); showToast("success", "Leave Applied", "Your mock leave request has been submitted successfully!"); setActiveSidebar(null); }} className="d-flex flex-column p-20">
          <div className="row g-3">
            <div className="col-sm-6">
              <div>
                <label htmlFor="leaveType" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">Leave Type</label>
                <select id="leaveType" className="form-control form-select" required>
                  <option value="">Select a leave type</option>
                  <option value="Sickness">Sickness</option>
                  <option value="Accident">Accident</option>
                  <option value="Travel">Travel</option>
                </select>
              </div>
            </div>
            <div className="col-sm-6">
              <div>
                <label htmlFor="fromDate" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">From Date</label>
                <input type="date" className="form-control" id="fromDate" required />
              </div>
            </div>
            <div className="col-sm-6">
              <div>
                <label htmlFor="toDate" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">To Date</label>
                <input type="date" className="form-control" id="toDate" required />
              </div>
            </div>
            <div className="col-sm-6">
              <div>
                <label htmlFor="leaveDays" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">Leave Days</label>
                <select id="leaveDays" className="form-control form-select">
                  <option value="Full Day">Full Day</option>
                  <option value="First Half">First Half</option>
                  <option value="Second Half">Second Half</option>
                </select>
              </div>
            </div>
            <div className="col-sm-12">
              <div>
                <label htmlFor="ReasonForLeave" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">Reason for Leave</label>
                <textarea id="ReasonForLeave" className="form-control" placeholder="Enter reason for leave..." required></textarea>
              </div>
            </div>
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-center gap-3 mt-8">
                <button type="button" onClick={() => setActiveSidebar(null)} className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-50 py-11 radius-8 bg-transparent">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary-600 border border-primary-600 text-md px-28 py-12 radius-8">
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* React Slide-over Sidebar: Collect Fees */}
      <div className={`my-sidebar bg-white position-fixed end-0 top-0 h-100vh overflow-y-auto z-99 max-w-700-px w-100 translate-x-full duration-300 ${activeSidebar === "fees" ? "active-translate-0" : ""}`}>
        <div className="px-20 py-12 border-bottom d-flex align-items-center justify-content-between gap-20">
          <h5 className="text-lg mb-0">Collect Fees</h5>
          <button type="button" onClick={() => setActiveSidebar(null)} className="close-collect-fees text-danger-600 text-lg d-flex bg-transparent border-0">
            <i className="ri-close-large-line"></i>
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); showToast("success", "Fees Collected", "Fees have been successfully logged!"); setActiveSidebar(null); }} className="d-flex flex-column p-20">
          <div className="row g-3">
            <div className="col-sm-6">
              <div>
                <label htmlFor="feesType" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">Fees Type</label>
                <select id="feesType" className="form-control form-select" required>
                  <option value="">Select a fees type</option>
                  <option value="May month fees">May month fees</option>
                  <option value="June month fees">June month fees</option>
                  <option value="July month fees">July month fees</option>
                </select>
              </div>
            </div>
            <div className="col-sm-6">
              <div>
                <label htmlFor="feesDate" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">Payment Date</label>
                <input type="date" className="form-control" id="feesDate" required />
              </div>
            </div>
            <div className="col-sm-6">
              <div>
                <label htmlFor="feesAmount" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">Amount</label>
                <input type="text" className="form-control" id="feesAmount" value="$700.50" disabled />
              </div>
            </div>
            <div className="col-sm-6">
              <div>
                <label htmlFor="feesPaymentType" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">Payment Type</label>
                <select id="feesPaymentType" className="form-control form-select">
                  <option value="Bank">Bank</option>
                  <option value="bKash">bKash</option>
                </select>
              </div>
            </div>
            <div className="col-sm-12">
              <div>
                <label htmlFor="feesNote" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">Note</label>
                <textarea id="feesNote" className="form-control" placeholder="Enter note..."></textarea>
              </div>
            </div>
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-center gap-3 mt-8">
                <button type="button" onClick={() => setActiveSidebar(null)} className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-50 py-11 radius-8 bg-transparent">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary-600 border border-primary-600 text-md px-28 py-12 radius-8">
                  Pay
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Suspend Confirmation Modal */}
      <div className="modal fade" id="exampleModalDelete" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-sm modal-dialog-centered max-w-340-px">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-body pt-32 px-36 pb-24 text-center">
              <span className="mb-16 fs-1 line-height-1 text-danger">
                <i className="ri-delete-bin-2-line"></i>
              </span>
              <h6 className="text-lg fw-semibold text-primary-light mb-0">Are you sure you want to Suspend this Student?</h6>
              <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                <button
                  type="button"
                  data-bs-dismiss="modal"
                  className="flex-grow-1 border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-24 py-11 radius-8 bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteMutation.isPending}
                  onClick={handleDeleteConfirm}
                  className="flex-grow-1 btn btn-primary-600 border border-primary-600 text-md px-16 py-12 radius-8"
                >
                  {deleteMutation.isPending ? "Suspending..." : "Yes, Suspend"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop overlay for sidebars */}
      {activeSidebar !== null && (
        <div
          className="overlay active"
          onClick={() => setActiveSidebar(null)}
          style={{ zIndex: 98, cursor: "pointer" }}
        />
      )}
    </>
  );
}

export default function StudentDetailsPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-50">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading student details...</span>
        </div>
      </div>
    }>
      <StudentDetailsContent />
    </Suspense>
  );
}
