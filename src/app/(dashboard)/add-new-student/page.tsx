"use client";

import Link from "next/link";
import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  StudentFormValues, studentSchema } from "@/features/student/schema/studentSchema";
import { useClasses } from "@/features/classes/hooks/useClass";
import { useSections } from "@/features/sections/hooks/useSection";
import { useCategories } from "@/features/category/hooks/useCategory";
import { useAddStudent } from "@/features/student/hooks/useStudent";
import { useToast } from "@/components/Toast";

interface DropZoneFieldProps {
  label: string;
  file: File | null;
  setFile: (file: File | null) => void;
  required?: boolean;
}

const DropZoneField = ({
  label,
  file,
  setFile,
  required = false,
}: DropZoneFieldProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="col-xxl-3 col-xl-4 col-sm-6">
      <div>
        <label className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
          {label} {required && <span className="text-danger-600">*</span>}
        </label>
        <div
          onClick={() => inputRef.current?.click()}
          className="drop-zone height-44-px p-4 d-flex justify-content-center align-items-center text-center fw-medium text-md cursor-pointer border border-neutral-400 radius-8 border-dashed bg-hover-neutral-200"
        >
          <span className="drop-zone__prompt text-truncate px-2">
            {file ? file.name : "Drag & drop a file here or click"}
          </span>
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

export default function AddNewStudentPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Fetch dropdown data
  const { data: classes } = useClasses();
  const { data: sections } = useSections();
  const { data: categories } = useCategories();

  // Add Mutation
  const addStudentMutation = useAddStudent();

  // Files state
  const [studentPhoto, setStudentPhoto] = useState<File | null>(null);
  const [fatherPhoto, setFatherPhoto] = useState<File | null>(null);
  const [motherPhoto, setMotherPhoto] = useState<File | null>(null);
  const [guardianPhoto, setGuardianPhoto] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [guardianType, setGuardianType] = useState<"father" | "mother" | "others">("others");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema) as any,
    defaultValues: {
      admissionNumber: "",
      rollNumber: "",
      academicYear: "Jun 2025/2026",
      status: true,
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
      bloodGroup: "",
      emailAddress: "",
      categoryId: 0,
      classId: 0,
      sectionId: 0,
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
      roomNo: "",
      fatherName: "",
      fatherPhone: "",
      fatherOccupation: "",
      motherName: "",
      motherPhone: "",
      motherOccupation: "",
      guardianName: "",
      guardianEmail: "",
      guardianPhone: "",
      guardianOccupation: "",
      guardianAddress: "",
      guardianRelation: "Other",
      documentName: "",
      phoneNumber: "",
      details: "",
      password: "",
    },
  });

  const fatherName = watch("fatherName");
  const fatherPhone = watch("fatherPhone");
  const fatherOccupation = watch("fatherOccupation");
  const motherName = watch("motherName");
  const motherPhone = watch("motherPhone");
  const motherOccupation = watch("motherOccupation");
  const emailAddress = watch("emailAddress");

  React.useEffect(() => {
    if (guardianType === "father") {
      setValue("guardianName", fatherName || "");
      setValue("guardianPhone", fatherPhone || "");
      setValue("guardianOccupation", fatherOccupation || "");
      setValue("guardianRelation", "Father");
      setValue("guardianEmail", emailAddress || "");
      setGuardianPhoto(fatherPhoto);
    } else if (guardianType === "mother") {
      setValue("guardianName", motherName || "");
      setValue("guardianPhone", motherPhone || "");
      setValue("guardianOccupation", motherOccupation || "");
      setValue("guardianRelation", "Mother");
      setValue("guardianEmail", emailAddress || "");
      setGuardianPhoto(motherPhoto);
    } else {
      setValue("guardianRelation", "Other");
    }
  }, [
    guardianType,
    fatherName,
    fatherPhone,
    fatherOccupation,
    motherName,
    motherPhone,
    motherOccupation,
    emailAddress,
    fatherPhoto,
    motherPhoto,
    setValue,
  ]);

  const onSubmit = (data: StudentFormValues) => {
    const finalData = { ...data };
    if (guardianType === "father") {
      finalData.guardianName = fatherName;
      finalData.guardianPhone = fatherPhone;
      finalData.guardianOccupation = fatherOccupation;
      finalData.guardianRelation = "Father";
      finalData.guardianEmail = emailAddress;
    } else if (guardianType === "mother") {
      finalData.guardianName = motherName;
      finalData.guardianPhone = motherPhone;
      finalData.guardianOccupation = motherOccupation;
      finalData.guardianRelation = "Mother";
      finalData.guardianEmail = emailAddress;
    }

    const payload = new FormData();

    payload.append("AdmissionNumber", finalData.admissionNumber || "");
    payload.append("RollNumber", finalData.rollNumber || "");
    payload.append("AcademicYear", finalData.academicYear || "Jun 2025/2026");
    payload.append("Status", String(finalData.status !== false));
    payload.append("FirstName", finalData.firstName);
    payload.append("LastName", finalData.lastName);
    payload.append("Gender", finalData.gender || "");
    payload.append("DateOfBirth", finalData.dateOfBirth || "");
    payload.append("BloodGroup", finalData.bloodGroup || "");
    payload.append("EmailAddress", finalData.emailAddress);
    payload.append("CategoryId", String(finalData.categoryId));
    payload.append("ClassId", String(finalData.classId));
    payload.append("SectionId", String(finalData.sectionId));
    payload.append("Height", finalData.height || "");
    payload.append("Weight", finalData.weight || "");
    payload.append("BankAccountNumber", finalData.bankAccountNumber || "");
    payload.append("BankName", finalData.bankName || "");
    payload.append("IFSCCode", finalData.ifscCode || "");
    payload.append("NationalIdentificationNumber", finalData.nationalIdentificationNumber || "");
    payload.append("PreviousSchoolName", finalData.previousSchoolName || "");
    payload.append("PreviousSchoolAddress", finalData.previousSchoolAddress || "");
    payload.append("CurrentAddress", finalData.currentAddress || "");
    payload.append("PermanentAddress", finalData.permanentAddress || "");
    payload.append("RoomNo", finalData.roomNo || "");
    payload.append("FatherName", finalData.fatherName || "");
    payload.append("FatherPhone", finalData.fatherPhone || "");
    payload.append("FatherOccupation", finalData.fatherOccupation || "");
    payload.append("MotherName", finalData.motherName || "");
    payload.append("MotherPhone", finalData.motherPhone || "");
    payload.append("MotherOccupation", finalData.motherOccupation || "");
    payload.append("GuardianName", finalData.guardianName || "");
    payload.append("GuardianEmail", finalData.guardianEmail || "");
    payload.append("GuardianPhone", finalData.guardianPhone || "");
    payload.append("GuardianOccupation", finalData.guardianOccupation || "");
    payload.append("GuardianAddress", finalData.guardianAddress || "");
    payload.append("GuardianRelation", finalData.guardianRelation || "Other");
    payload.append("DocumentName", finalData.documentName || "");
    payload.append("PhoneNumber", finalData.phoneNumber || "");
    payload.append("Details", finalData.details || "");
    payload.append("Password", finalData.password || "");

    // Append files
    if (studentPhoto) payload.append("StudentPhoto", studentPhoto);
    if (fatherPhoto) payload.append("FatherPhoto", fatherPhoto);
    if (motherPhoto) payload.append("MotherPhoto", motherPhoto);
    if (guardianPhoto) payload.append("GuardianPhoto", guardianPhoto);
    if (documentFile) payload.append("DocumentFile", documentFile);

    addStudentMutation.mutate(payload, {
      onSuccess: () => {
        showToast("success", "Student Added", `Successfully registered student ${finalData.firstName}`);
        router.push("/student-list");
      },
      onError: (err: any) => {
        const errorMsg = err?.response?.data?.message || err?.message || "Failed to add student";
        showToast("error", "Submission Error", errorMsg);
      },
    });
  };

  return (
    <>
      <div className="breadcrumb d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h1 className="fw-semibold mb-4 h6 text-primary-light">Add New Student</h1>
          <div>
            <Link href="/" className="text-secondary-light hover-text-primary hover-underline">Dashboard </Link>
            <Link href="/student-list" className="text-secondary-light hover-text-primary hover-underline"> / Student</Link>
            <span className="text-secondary-light">/ Add New Student</span>
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
                      <label htmlFor="academicYear" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Academic Year <span className="text-danger-600">*</span>
                      </label>
                      <select id="academicYear" className="form-control form-select" {...register("academicYear")}>
                        <option value="Jun 2025/2026">Jun 2025/2026</option>
                        <option value="Jun 2026/2027">Jun 2026/2027</option>
                        <option value="Jun 2027/2028">Jun 2027/2028</option>
                        <option value="Jun 2028/2029">Jun 2028/2029</option>
                      </select>
                      {errors.academicYear && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.academicYear.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="classId" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Class <span className="text-danger-600">*</span>
                      </label>
                      <select id="classId" className="form-control form-select" {...register("classId")}>
                        <option value="0">Select Class</option>
                        {classes?.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
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
                      <label htmlFor="sectionId" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Section <span className="text-danger-600">*</span>
                      </label>
                      <select id="sectionId" className="form-control form-select" {...register("sectionId")}>
                        <option value="0">Select Section</option>
                        {sections?.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      {errors.sectionId && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.sectionId.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="rollNumber" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Roll Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="rollNumber"
                        placeholder="Enter roll number"
                        {...register("rollNumber")}
                      />
                      {errors.rollNumber && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.rollNumber.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="admissionNumber" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Admission No <span className="text-danger-600">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="admissionNumber"
                        placeholder="Enter admission number"
                        {...register("admissionNumber")}
                      />
                      {errors.admissionNumber && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.admissionNumber.message}
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
                      <label htmlFor="categoryId" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Category <span className="text-danger-600">*</span>
                      </label>
                      <select id="categoryId" className="form-control form-select" {...register("categoryId")}>
                        <option value="0">Select Category</option>
                        {categories?.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {errors.categoryId && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.categoryId.message}
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
                        <option value="male">Male</option>
                        <option value="female">Female</option>
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
                        Date Of Birth <span className="text-danger-600">*</span>
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
                      <label htmlFor="phoneNumber" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="phoneNumber"
                        placeholder="Enter Phone Number"
                        {...register("phoneNumber")}
                      />
                      {errors.phoneNumber && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.phoneNumber.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="emailAddress" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Email Address <span className="text-danger-600">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="emailAddress"
                        placeholder="Enter Email"
                        {...register("emailAddress")}
                      />
                      {errors.emailAddress && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.emailAddress.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <DropZoneField label="Student Photo" file={studentPhoto} setFile={setStudentPhoto} required={true} />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Parent & Guardian Info */}
          <div className="col-lg-12">
            <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                <h6 className="text-lg fw-semibold mb-0">Parent & Guardian Info</h6>
              </div>
              <div className="card-body p-20">
                <div className="row gy-3">
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
                      {errors.fatherName && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.fatherName.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="fatherPhone" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Father's Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="fatherPhone"
                        placeholder="Enter Father's Number"
                        {...register("fatherPhone")}
                      />
                      {errors.fatherPhone && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.fatherPhone.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="fatherOccupation" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Father's Occupation
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="fatherOccupation"
                        placeholder="Enter Father's Occupation"
                        {...register("fatherOccupation")}
                      />
                      {errors.fatherOccupation && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.fatherOccupation.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <DropZoneField label="Father's Photo" file={fatherPhoto} setFile={setFatherPhoto} />

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
                      {errors.motherName && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.motherName.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="motherPhone" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Mother's Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="motherPhone"
                        placeholder="Enter Mother's Number"
                        {...register("motherPhone")}
                      />
                      {errors.motherPhone && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.motherPhone.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="motherOccupation" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Mother's Occupation
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="motherOccupation"
                        placeholder="Enter Mother's Occupation"
                        {...register("motherOccupation")}
                      />
                      {errors.motherOccupation && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.motherOccupation.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <DropZoneField label="Mother's Photo" file={motherPhoto} setFile={setMotherPhoto} />

                  <div className="col-12">
                    <div className="mt-24">
                      <span className="text-lg fw-bold text-primary-light d-inline-block mb-8">Select a Guardian</span>
                      <div className="d-flex align-items-center flex-wrap gap-28">
                        <div className="form-check checked-primary d-flex align-items-center gap-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="guardianSelect"
                            id="selectFather"
                            checked={guardianType === "father"}
                            onChange={() => setGuardianType("father")}
                          />
                          <label className="form-check-label line-height-1 fw-medium text-secondary-light" htmlFor="selectFather">
                            Father
                          </label>
                        </div>
                        <div className="form-check checked-secondary d-flex align-items-center gap-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="guardianSelect"
                            id="selectMother"
                            checked={guardianType === "mother"}
                            onChange={() => setGuardianType("mother")}
                          />
                          <label className="form-check-label line-height-1 fw-medium text-secondary-light" htmlFor="selectMother">
                            Mother
                          </label>
                        </div>
                        <div className="form-check checked-success d-flex align-items-center gap-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="guardianSelect"
                            id="selectOthers"
                            checked={guardianType === "others"}
                            onChange={() => setGuardianType("others")}
                          />
                          <label className="form-check-label line-height-1 fw-medium text-secondary-light" htmlFor="selectOthers">
                            Others
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="guardianName" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Guardian Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="guardianName"
                        placeholder="Enter Guardian Name"
                        disabled={guardianType !== "others"}
                        {...register("guardianName")}
                      />
                      {errors.guardianName && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.guardianName.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="guardianEmail" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Guardian Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="guardianEmail"
                        placeholder="Enter Guardian Email"
                        disabled={guardianType !== "others"}
                        {...register("guardianEmail")}
                      />
                      {errors.guardianEmail && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.guardianEmail.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="guardianPhone" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Guardian Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="guardianPhone"
                        placeholder="Enter Guardian Number"
                        disabled={guardianType !== "others"}
                        {...register("guardianPhone")}
                      />
                      {errors.guardianPhone && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.guardianPhone.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="guardianOccupation" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Guardian Occupation
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="guardianOccupation"
                        placeholder="Enter Occupation"
                        disabled={guardianType !== "others"}
                        {...register("guardianOccupation")}
                      />
                      {errors.guardianOccupation && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.guardianOccupation.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-xl-9 col-sm-6">
                    <div>
                      <label htmlFor="guardianAddress" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Guardian Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="guardianAddress"
                        placeholder="Enter Guardian Address"
                        disabled={guardianType !== "others"}
                        {...register("guardianAddress")}
                      />
                      {errors.guardianAddress && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.guardianAddress.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <DropZoneField label="Guardian Photo" file={guardianPhoto} setFile={setGuardianPhoto} />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Medical Details */}
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
                        <option value="">Select blood group</option>
                        <option value="A+">A+</option>
                        <option value="AB+">AB+</option>
                        <option value="B+">B+</option>
                        <option value="O+">O+</option>
                        <option value="A-">A-</option>
                        <option value="AB-">AB-</option>
                        <option value="B-">B-</option>
                        <option value="O-">O-</option>
                      </select>
                      {errors.bloodGroup && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.bloodGroup.message}
                        </span>
                      )}
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
                        placeholder="Enter height"
                        {...register("height")}
                      />
                      {errors.height && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.height.message}
                        </span>
                      )}
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
                      {errors.weight && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.weight.message}
                        </span>
                      )}
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
                        placeholder="Enter bank account number"
                        {...register("bankAccountNumber")}
                      />
                      {errors.bankAccountNumber && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.bankAccountNumber.message}
                        </span>
                      )}
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
                        placeholder="Enter bank name"
                        {...register("bankName")}
                      />
                      {errors.bankName && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.bankName.message}
                        </span>
                      )}
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
                      {errors.ifscCode && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.ifscCode.message}
                        </span>
                      )}
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
                        placeholder="Enter national identification number"
                        {...register("nationalIdentificationNumber")}
                      />
                      {errors.nationalIdentificationNumber && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.nationalIdentificationNumber.message}
                        </span>
                      )}
                    </div>
                  </div>
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
                      {errors.previousSchoolName && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.previousSchoolName.message}
                        </span>
                      )}
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
                      {errors.previousSchoolAddress && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.previousSchoolAddress.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Address */}
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
                      {errors.currentAddress && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.currentAddress.message}
                        </span>
                      )}
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
                      {errors.permanentAddress && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.permanentAddress.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Hostel Details */}
          <div className="col-xxl-6">
            <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                <h6 className="text-lg fw-semibold mb-0">Hostel Details</h6>
              </div>
              <div className="card-body p-20">
                <div className="row gy-3">
                  <div className="col-sm-12">
                    <div>
                      <label htmlFor="roomNo" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Room No
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="roomNo"
                        placeholder="Enter Room No"
                        {...register("roomNo")}
                      />
                      {errors.roomNo && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.roomNo.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Upload Documents */}
          <div className="col-xxl-6">
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
                      {errors.documentName && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.documentName.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <DropZoneField label="Document File" file={documentFile} setFile={setDocumentFile} />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Student Details */}
          <div className="col-xl-12">
            <div className="shadow-1 radius-12 bg-base h-100 overflow-hidden">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                <h6 className="text-lg fw-semibold mb-0">Student Details</h6>
              </div>
              <div className="card-body p-20">
                <div className="row gy-3">
                  <div className="col-sm-12">
                    <div>
                      <label htmlFor="details" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Details
                      </label>
                      <textarea
                        id="details"
                        className="form-control"
                        placeholder="Enter details"
                        {...register("details")}
                      ></textarea>
                      {errors.details && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.details.message}
                        </span>
                      )}
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
                <h6 className="text-lg fw-semibold mb-0">Login Details</h6>
              </div>
              <div className="card-body p-20">
                <div className="row gy-3">
                  <div className="col-sm-6">
                    <div>
                      <label htmlFor="emailAddress" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Email Address <span className="text-danger-600">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter Login Email"
                        id="emailAddress"
                        {...register("emailAddress")}
                      />
                      {errors.emailAddress && (
                        <span className="text-danger-600 text-sm mt-8 d-inline-block">
                          {errors.emailAddress.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div>
                      <label htmlFor="password" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Password <span className="text-danger-600">*</span>
                      </label>
                      <div className="position-relative">
                        <input
                          type="password"
                          id="password"
                          className="form-control"
                          placeholder="Enter your password"
                          {...register("password")}
                        />
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
          </div>

          {/* Action Buttons */}
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-center gap-3 mt-8">
              <button
                type="button"
                onClick={() => router.push("/student-list")}
                className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-50 py-11 radius-8 bg-transparent"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addStudentMutation.isPending}
                className="btn btn-primary-600 border border-primary-600 text-md px-28 py-12 radius-8"
              >
                {addStudentMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
