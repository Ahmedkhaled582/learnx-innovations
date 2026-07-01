"use client";

import Link from "next/link";
import * as React from "react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TeacherFormValues, teacherSchema } from "@/features/teacher/schema/teacherSchema";
import { useClasses } from "@/features/classes/hooks/useClass";
import { useSubjects } from "@/features/subjects/hooks/useSubject";
import { useTeacherDetails, useUpdateTeacher } from "@/features/teacher/hooks/useTeacher";
import { useToast } from "@/components/Toast";

interface DropZoneFieldProps {
  label: string;
  file: File | null;
  setFile: (file: File | null) => void;
  existingImagePath?: string;
  required?: boolean;
}

const DropZoneField = ({
  label,
  file,
  setFile,
  existingImagePath,
  required = false,
}: DropZoneFieldProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  let previewUrl = null;
  if (file) {
    previewUrl = URL.createObjectURL(file);
  } else if (existingImagePath) {
    previewUrl = existingImagePath.startsWith("http")
      ? existingImagePath
      : `https://schooliq.runasp.net/${existingImagePath}`;
  }

  return (
    <div className="col-xxl-3 col-xl-4 col-sm-6">
      <div>
        <label className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
          {label} {required && <span className="text-danger-600">*</span>}
        </label>
        <div
          onClick={() => inputRef.current?.click()}
          className="drop-zone height-44-px p-4 d-flex justify-content-center align-items-center text-center fw-medium text-md cursor-pointer border border-neutral-400 radius-8 border-dashed bg-hover-neutral-200 position-relative overflow-hidden"
        >
          {previewUrl ? (
            <div className="d-flex align-items-center gap-2 w-100 px-12">
              <img
                src={previewUrl}
                alt="preview"
                className="radius-4 object-fit-cover"
                style={{ width: "32px", height: "32px" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/images/thumbs/avatar-img1.png";
                }}
              />
              <span className="text-truncate text-xs text-secondary-light flex-grow-1 text-start">
                {file ? file.name : "Existing File"}
              </span>
            </div>
          ) : (
            <span className="drop-zone__prompt text-truncate px-2">
              {file ? file.name : "Drag & drop a file here or click"}
            </span>
          )}
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            className="d-none"
            accept="image/*,.pdf,.doc,.docx"
          />
        </div>
      </div>
    </div>
  );
};

function EditTeacherForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const idStr = searchParams.get("id");
  const teacherId = idStr ? Number(idStr) : 0;

  // Fetch teacher details
  const { data: teacher, isLoading: isTeacherLoading, error: teacherError } = useTeacherDetails(teacherId);

  // Fetch dropdown data
  const { data: classes } = useClasses();
  const { data: subjects } = useSubjects();

  // Update Mutation
  const updateTeacherMutation = useUpdateTeacher(teacherId);

  // Files state
  const [teacherPhoto, setTeacherPhoto] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema) as any,
    defaultValues: {
      teacherCode: "",
      firstName: "",
      lastName: "",
      subjectId: 0,
      classId: 0,
      gender: "",
      dateOfBirth: "",
      qualification: "",
      experience: "",
      mobileNumber: "",
      email: "",
      joiningDate: "",
      status: true,
      fatherName: "",
      motherName: "",
      maritalStatus: "",
      contractType: "",
      shift: "",
      workLocation: "",
      bloodGroup: "",
      height: "",
      weight: "",
      bankAccountNumber: "",
      bankName: "",
      ifscCode: "",
      nationalIdentificationNumber: "",
      previousSchoolName: "",
      previousSchoolAddress: "",
      currentAddress: "",
      permanentAddress: "",
      details: "",
      facebook: "",
      linkedIn: "",
      instagram: "",
      youtube: "",
      documentName: "",
      userId: "",
      password: "",
    },
  });

  // Prepopulate form when teacher details are loaded
  useEffect(() => {
    if (teacher) {
      reset({
        teacherCode: teacher.teacherCode || "",
        firstName: teacher.firstName || "",
        lastName: teacher.lastName || "",
        subjectId: teacher.subjectId || 0,
        classId: teacher.classId || 0,
        gender: teacher.gender || "",
        dateOfBirth: teacher.dateOfBirth ? teacher.dateOfBirth.split("T")[0] : "",
        qualification: teacher.qualification || "",
        experience: teacher.experience || "",
        mobileNumber: teacher.mobileNumber || "",
        email: teacher.email || "",
        joiningDate: teacher.joiningDate ? teacher.joiningDate.split("T")[0] : "",
        status: teacher.status !== false,
        fatherName: teacher.fatherName || "",
        motherName: teacher.motherName || "",
        maritalStatus: teacher.maritalStatus || "",
        contractType: teacher.contractType || "",
        shift: teacher.shift || "",
        workLocation: teacher.workLocation || "",
        bloodGroup: teacher.bloodGroup || "",
        height: teacher.height || "",
        weight: teacher.weight || "",
        bankAccountNumber: teacher.bankAccountNumber || "",
        bankName: teacher.bankName || "",
        ifscCode: teacher.ifscCode || "",
        nationalIdentificationNumber: teacher.nationalIdentificationNumber || "",
        previousSchoolName: teacher.previousSchoolName || "",
        previousSchoolAddress: teacher.previousSchoolAddress || "",
        currentAddress: teacher.currentAddress || "",
        permanentAddress: teacher.permanentAddress || "",
        details: teacher.details || "",
        facebook: teacher.facebook || "",
        linkedIn: teacher.linkedIn || "",
        instagram: teacher.instagram || "",
        youtube: teacher.youtube || "",
        documentName: teacher.documentName || "",
        userId: teacher.userId || "",
        password: "", // Optional on edit
      });
    }
  }, [teacher, reset]);

  if (isTeacherLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-80">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (teacherError || !teacher) {
    return (
      <div className="alert alert-danger py-20 text-center" role="alert">
        Failed to load teacher details. Please try again or go back.
      </div>
    );
  }

  const onSubmit = (data: TeacherFormValues) => {
    const payload = new FormData();

    // Map to PascalCase payload keys expected by backend API
    payload.append("Id", String(teacherId));
    payload.append("TeacherCode", data.teacherCode || "");
    payload.append("FirstName", data.firstName);
    payload.append("LastName", data.lastName);
    payload.append("SubjectId", String(data.subjectId));
    payload.append("ClassId", String(data.classId));
    payload.append("Gender", data.gender || "");
    payload.append("DateOfBirth", data.dateOfBirth ? `${data.dateOfBirth}T00:00:00Z` : "");
    payload.append("Qualification", data.qualification || "");
    payload.append("Experience", data.experience || "");
    payload.append("MobileNumber", data.mobileNumber || "");
    payload.append("Email", data.email);
    payload.append("JoiningDate", data.joiningDate ? `${data.joiningDate}T00:00:00Z` : "");
    payload.append("Status", String(data.status !== false));
    payload.append("FatherName", data.fatherName || "");
    payload.append("MotherName", data.motherName || "");
    payload.append("MaritalStatus", data.maritalStatus || "");
    payload.append("ContractType", data.contractType || "");
    payload.append("Shift", data.shift || "");
    payload.append("WorkLocation", data.workLocation || "");
    payload.append("BloodGroup", data.bloodGroup || "");
    payload.append("Height", data.height || "");
    payload.append("Weight", data.weight || "");
    payload.append("BankAccountNumber", data.bankAccountNumber || "");
    payload.append("BankName", data.bankName || "");
    payload.append("IFSCCode", data.ifscCode || "");
    payload.append("NationalIdentificationNumber", data.nationalIdentificationNumber || "");
    payload.append("PreviousSchoolName", data.previousSchoolName || "");
    payload.append("PreviousSchoolAddress", data.previousSchoolAddress || "");
    payload.append("CurrentAddress", data.currentAddress || "");
    payload.append("PermanentAddress", data.permanentAddress || "");
    payload.append("Details", data.details || "");
    payload.append("Facebook", data.facebook || "");
    payload.append("LinkedIn", data.linkedIn || "");
    payload.append("Instagram", data.instagram || "");
    payload.append("YouTube", data.youtube || "");
    payload.append("DocumentName", data.documentName || "");
    payload.append("UserId", data.userId || "");
    
    if (data.password) {
      payload.append("Password", data.password);
    }

    // Retain existing image URLs if files are not uploaded
    payload.append("TeacherImage", teacher.teacherImage || "");
    payload.append("DocumentImage", teacher.documentImage || "");

    // Append binary files if updated
    if (teacherPhoto) payload.append("TeacherPhoto", teacherPhoto);
    if (documentFile) payload.append("DocumentFile", documentFile);

    updateTeacherMutation.mutate(payload, {
      onSuccess: () => {
        showToast("success", "Teacher Updated", `Successfully updated profile of ${data.firstName} ${data.lastName}`);
        router.push("/teacher-list");
      },
      onError: (err: any) => {
        const errorMsg = err?.response?.data?.message || err?.message || "Failed to update teacher";
        showToast("error", "Update Error", errorMsg);
      },
    });
  };

  return (
    <>
      <div className="breadcrumb d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h1 className="fw-semibold mb-4 h6 text-primary-light">Edit Teacher</h1>
          <div>
            <Link href="/" className="text-secondary-light hover-text-primary hover-underline">Dashboard </Link>
            <Link href="/teacher-list" className="text-secondary-light hover-text-primary hover-underline"> / Teacher</Link>
            <span className="text-secondary-light">/ Edit Teacher</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-24">
        <div className="row gy-3">
          {/* Section: Personal Info */}
          <div className="col-lg-12">
            <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                <h6 className="text-lg fw-semibold mb-0">Personal Info</h6>
              </div>
              <div className="card-body p-20">
                <div className="row gy-3">
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="teacherCode" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Teacher ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="teacherCode"
                        placeholder="Enter Teacher ID"
                        {...register("teacherCode")}
                      />
                      {errors.teacherCode && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.teacherCode.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="firstName" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        First Name <span className="text-danger-600">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        placeholder="Enter First Name"
                        {...register("firstName")}
                      />
                      {errors.firstName && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.firstName.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="lastName" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Last Name <span className="text-danger-600">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        placeholder="Enter Last Name"
                        {...register("lastName")}
                      />
                      {errors.lastName && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.lastName.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="subjectId" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Subject
                      </label>
                      <select id="subjectId" className="form-control form-select" {...register("subjectId")}>
                        <option value="0">Select Subject</option>
                        {subjects?.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                      {errors.subjectId && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.subjectId.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="classId" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Class
                      </label>
                      <select id="classId" className="form-control form-select" {...register("classId")}>
                        <option value="0">Select Class</option>
                        {classes?.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                      {errors.classId && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.classId.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="gender" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Gender
                      </label>
                      <select id="gender" className="form-control form-select" {...register("gender")}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {errors.gender && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.gender.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="dateOfBirth" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Date Of Birth
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="dateOfBirth"
                        {...register("dateOfBirth")}
                      />
                      {errors.dateOfBirth && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.dateOfBirth.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="fatherName" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Father's Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="fatherName"
                        placeholder="Enter Father's Name"
                        {...register("fatherName")}
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="motherName" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Mother's Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="motherName"
                        placeholder="Enter Mother's Name"
                        {...register("motherName")}
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="maritalStatus" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Marital Status
                      </label>
                      <select id="maritalStatus" className="form-control form-select" {...register("maritalStatus")}>
                        <option value="">Select Marital Status</option>
                        <option value="Married">Married</option>
                        <option value="Unmarried">Unmarried</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="contractType" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Contract Type
                      </label>
                      <select id="contractType" className="form-control form-select" {...register("contractType")}>
                        <option value="">Select Contract Type</option>
                        <option value="Permanent">Permanent</option>
                        <option value="Contractual">Contractual</option>
                        <option value="Hourly">Hourly</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="shift" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Shift
                      </label>
                      <select id="shift" className="form-control form-select" {...register("shift")}>
                        <option value="">Select Shift</option>
                        <option value="Day Shift">Day Shift</option>
                        <option value="Night Shift">Night Shift</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="workLocation" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Work Location
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="workLocation"
                        placeholder="Enter Work Location"
                        {...register("workLocation")}
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="joiningDate" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Joining Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="joiningDate"
                        {...register("joiningDate")}
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="mobileNumber" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="mobileNumber"
                        placeholder="Enter Phone Number"
                        {...register("mobileNumber")}
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="experience" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Experience
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="experience"
                        placeholder="Enter Experience"
                        {...register("experience")}
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="qualification" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Qualification
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="qualification"
                        placeholder="Enter Qualification"
                        {...register("qualification")}
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="status" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Status
                      </label>
                      <select id="status" className="form-control form-select" {...register("status", { setValueAs: (v) => v === "true" || v === true })}>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <DropZoneField
                    label="Teacher Photo"
                    file={teacherPhoto}
                    setFile={setTeacherPhoto}
                    existingImagePath={teacher.teacherImage}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Medical Info */}
          <div className="col-lg-12">
            <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                <h6 className="text-lg fw-semibold mb-0">Medical Details</h6>
              </div>
              <div className="card-body p-20">
                <div className="row gy-3">
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="bloodGroup" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Blood Group
                      </label>
                      <select id="bloodGroup" className="form-control form-select" {...register("bloodGroup")}>
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="height" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Height
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="height"
                        placeholder="Enter Height"
                        {...register("height")}
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="weight" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Weight
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="weight"
                        placeholder="Enter Weight"
                        {...register("weight")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Bank Details */}
          <div className="col-lg-12">
            <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                <h6 className="text-lg fw-semibold mb-0">Bank Details</h6>
              </div>
              <div className="card-body p-20">
                <div className="row gy-3">
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="bankAccountNumber" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="bankAccountNumber"
                        placeholder="Enter Bank Account Number"
                        {...register("bankAccountNumber")}
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="bankName" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="bankName"
                        placeholder="Enter Bank Name"
                        {...register("bankName")}
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="ifscCode" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="ifscCode"
                        placeholder="Enter IFSC Code"
                        {...register("ifscCode")}
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="nationalIdentificationNumber" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        National Identification Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="nationalIdentificationNumber"
                        placeholder="Enter National ID Number"
                        {...register("nationalIdentificationNumber")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Upload Documents */}
          <div className="col-lg-12">
            <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                <h6 className="text-lg fw-semibold mb-0">Upload Documents</h6>
              </div>
              <div className="card-body p-20">
                <div className="row gy-3">
                  <div className="col-sm-6">
                    <div>
                      <label htmlFor="documentName" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Doc Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="documentName"
                        placeholder="Enter Doc Name"
                        {...register("documentName")}
                      />
                    </div>
                  </div>

                  <DropZoneField
                    label="Upload File"
                    file={documentFile}
                    setFile={setDocumentFile}
                    existingImagePath={teacher.documentImage}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Previous School Details */}
          <div className="col-xxl-6">
            <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                <h6 className="text-lg fw-semibold mb-0">Previous School Details</h6>
              </div>
              <div className="card-body p-20">
                <div className="row gy-3">
                  <div className="col-sm-6">
                    <div>
                      <label htmlFor="previousSchoolName" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        School Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="previousSchoolName"
                        placeholder="Enter School Name"
                        {...register("previousSchoolName")}
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div>
                      <label htmlFor="previousSchoolAddress" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="previousSchoolAddress"
                        placeholder="Enter Address"
                        {...register("previousSchoolAddress")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Addresses */}
          <div className="col-xxl-6">
            <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                <h6 className="text-lg fw-semibold mb-0">Address</h6>
              </div>
              <div className="card-body p-20">
                <div className="row gy-3">
                  <div className="col-sm-6">
                    <div>
                      <label htmlFor="currentAddress" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Current Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="currentAddress"
                        placeholder="Enter Current Address"
                        {...register("currentAddress")}
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div>
                      <label htmlFor="permanentAddress" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Permanent Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="permanentAddress"
                        placeholder="Enter Permanent Address"
                        {...register("permanentAddress")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Extra Details */}
          <div className="col-xl-12">
            <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                <h6 className="text-lg fw-semibold mb-0">Teacher Details</h6>
              </div>
              <div className="card-body p-20">
                <div className="row gy-3">
                  <div className="col-sm-12">
                    <div>
                      <label htmlFor="details" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Teacher Details
                      </label>
                      <textarea
                        id="details"
                        className="form-control"
                        placeholder="Enter Details"
                        {...register("details")}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Social Links */}
          <div className="col-xl-12">
            <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                <h6 className="text-lg fw-semibold mb-0">Social Links</h6>
              </div>
              <div className="card-body p-20">
                <div className="row gy-3">
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="facebook" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Facebook
                      </label>
                      <input
                        type="text"
                        id="facebook"
                        className="form-control"
                        placeholder="Enter Facebook Link"
                        {...register("facebook")}
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="linkedIn" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        LinkedIn
                      </label>
                      <input
                        type="text"
                        id="linkedIn"
                        className="form-control"
                        placeholder="Enter LinkedIn Link"
                        {...register("linkedIn")}
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="instagram" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Instagram
                      </label>
                      <input
                        type="text"
                        id="instagram"
                        className="form-control"
                        placeholder="Enter Instagram Link"
                        {...register("instagram")}
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="youtube" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        YouTube
                      </label>
                      <input
                        type="text"
                        id="youtube"
                        className="form-control"
                        placeholder="Enter YouTube Link"
                        {...register("youtube")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Login Details */}
          <div className="col-xl-12">
            <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                <h6 className="text-lg fw-semibold mb-0">Login Details <span className="text-xs text-neutral-400 font-normal ms-8">(Only enter password to change it)</span></h6>
              </div>
              <div className="card-body p-20">
                <div className="row gy-3">
                  <div className="col-sm-6">
                    <div>
                      <label htmlFor="email" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Email <span className="text-danger-600">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter Email"
                        {...register("email")}
                      />
                      {errors.email && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.email.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div>
                      <label htmlFor="password" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Password
                      </label>
                      <div className="position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          className="form-control"
                          placeholder="Enter New Password (Optional)"
                          {...register("password")}
                        />
                        <span
                          className={`toggle-password ri-eye${showPassword ? "-off" : ""}-line cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                          onClick={() => setShowPassword(!showPassword)}
                        ></span>
                      </div>
                      {errors.password && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.password.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-center gap-3 mt-8">
              <button
                type="button"
                onClick={() => router.push("/teacher-list")}
                className="border border-neutral-400 bg-hover-neutral-200 text-secondary-light text-md px-50 py-11 radius-8"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateTeacherMutation.isPending}
                className="btn btn-primary-600 border border-primary-600 text-md px-28 py-12 radius-8"
              >
                {updateTeacherMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default function EditTeacherPage() {
  return (
    <Suspense fallback={
      <div className="d-flex justify-content-center align-items-center py-80">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    }>
      <EditTeacherForm />
    </Suspense>
  );
}
