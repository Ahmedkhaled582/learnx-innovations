"use client";

import Link from "next/link";
import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const { data: classes, isLoading: isClassesLoading } = useClasses();
  const { data: sections, isLoading: isSectionsLoading } = useSections();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  // Add Mutation
  const addStudentMutation = useAddStudent();

  // Files state
  const [studentPhoto, setStudentPhoto] = useState<File | null>(null);
  const [fatherPhoto, setFatherPhoto] = useState<File | null>(null);
  const [motherPhoto, setMotherPhoto] = useState<File | null>(null);
  const [guardianPhoto, setGuardianPhoto] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  // Form fields state using PascalCase keys to match backend schema
  const [formData, setFormData] = useState({
    AdmissionNumber: "",
    RollNumber: "",
    AcademicYear: "Jun 2025/2026",
    Status: true,
    FirstName: "",
    LastName: "",
    Gender: "",
    DateOfBirth: "",
    BloodGroup: "",
    EmailAddress: "",
    CategoryId: 0,
    ClassId: 0,
    SectionId: 0,
    Height: "",
    Weight: "",
    BankAccountNumber: "",
    BankName: "",
    IFSCCode: "",
    NationalIdentificationNumber: "",
    PreviousSchoolName: "",
    PreviousSchoolAddress: "",
    CurrentAddress: "",
    PermanentAddress: "",
    RoomNo: "",
    FatherName: "",
    FatherPhone: "",
    FatherOccupation: "",
    MotherName: "",
    MotherPhone: "",
    MotherOccupation: "",
    GuardianName: "",
    GuardianEmail: "",
    GuardianPhone: "",
    GuardianOccupation: "",
    GuardianAddress: "",
    GuardianRelation: "",
    DocumentName: "",
    PhoneNumber: "",
    Details: "",
    Password: "",
  });

  const [guardianType, setGuardianType] = useState<"father" | "mother" | "others">("others");

  // Sync guardian fields if father or mother is selected
  React.useEffect(() => {
    if (guardianType === "father") {
      setFormData((prev) => ({
        ...prev,
        GuardianName: prev.FatherName,
        GuardianPhone: prev.FatherPhone,
        GuardianOccupation: prev.FatherOccupation,
        GuardianRelation: "Father",
        GuardianEmail: prev.EmailAddress, // Default or leave empty
      }));
      setGuardianPhoto(fatherPhoto);
    } else if (guardianType === "mother") {
      setFormData((prev) => ({
        ...prev,
        GuardianName: prev.MotherName,
        GuardianPhone: prev.MotherPhone,
        GuardianOccupation: prev.MotherOccupation,
        GuardianRelation: "Mother",
        GuardianEmail: prev.EmailAddress,
      }));
      setGuardianPhoto(motherPhoto);
    } else {
      setFormData((prev) => ({
        ...prev,
        GuardianRelation: "Other",
      }));
    }
  }, [guardianType, formData.FatherName, formData.FatherPhone, formData.FatherOccupation, formData.MotherName, formData.MotherPhone, formData.MotherOccupation, fatherPhoto, motherPhoto]);

  // Handle text input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };



  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.FirstName) {
      showToast("error", "Validation Error", "First Name is required");
      return;
    }
    if (!formData.LastName) {
      showToast("error", "Validation Error", "Last Name is required");
      return;
    }
    if (!formData.EmailAddress) {
      showToast("error", "Validation Error", "Email Address is required");
      return;
    }
    if (!formData.Password) {
      showToast("error", "Validation Error", "Password is required");
      return;
    }
    if (!formData.ClassId) {
      showToast("error", "Validation Error", "Please select a Class");
      return;
    }
    if (!formData.SectionId) {
      showToast("error", "Validation Error", "Please select a Section");
      return;
    }

    const payload = new FormData();

    // Append standard fields
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, String(value));
    });

    // Default fields not entered by user (omitted per user instructions)
    payload.append("StudentImage", "");
    payload.append("ParentId", "0");
    payload.append("UserId", "");
    payload.append("HostelId", "0");
    payload.append("FatherImage", "");
    payload.append("MotherImage", "");
    payload.append("GuardianImage", "");
    payload.append("DocumentImage", "");

    // Append files
    if (studentPhoto) payload.append("StudentPhoto", studentPhoto);
    if (fatherPhoto) payload.append("FatherPhoto", fatherPhoto);
    if (motherPhoto) payload.append("MotherPhoto", motherPhoto);
    if (guardianPhoto) payload.append("GuardianPhoto", guardianPhoto);
    if (documentFile) payload.append("DocumentFile", documentFile);

    addStudentMutation.mutate(payload, {
      onSuccess: () => {
        showToast("success", "Student Added", `Successfully registered student ${formData.FirstName}`);
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

      <form onSubmit={handleSubmit} className="mt-24">
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
                      <label htmlFor="AcademicYear" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Academic Year <span className="text-danger-600">*</span>
                      </label>
                      <select id="AcademicYear" className="form-control form-select" value={formData.AcademicYear} onChange={handleChange}>
                        <option value="Jun 2025/2026">Jun 2025/2026</option>
                        <option value="Jun 2026/2027">Jun 2026/2027</option>
                        <option value="Jun 2027/2028">Jun 2027/2028</option>
                        <option value="Jun 2028/2029">Jun 2028/2029</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="ClassId" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Class <span className="text-danger-600">*</span>
                      </label>
                      <select id="ClassId" className="form-control form-select" value={formData.ClassId} onChange={handleChange}>
                        <option value="0">Select Class</option>
                        {classes?.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="SectionId" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Section <span className="text-danger-600">*</span>
                      </label>
                      <select id="SectionId" className="form-control form-select" value={formData.SectionId} onChange={handleChange}>
                        <option value="0">Select Section</option>
                        {sections?.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="RollNumber" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Roll Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="RollNumber"
                        placeholder="Enter roll number"
                        value={formData.RollNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="AdmissionNumber" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Admission No <span className="text-danger-600">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="AdmissionNumber"
                        placeholder="Enter admission number"
                        value={formData.AdmissionNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="FirstName" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        First Name <span className="text-danger-600">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="FirstName"
                        placeholder="Enter First Name"
                        value={formData.FirstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="LastName" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Last Name <span className="text-danger-600">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="LastName"
                        placeholder="Enter Last Name"
                        value={formData.LastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="CategoryId" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Category <span className="text-danger-600">*</span>
                      </label>
                      <select id="CategoryId" className="form-control form-select" value={formData.CategoryId} onChange={handleChange}>
                        <option value="0">Select Category</option>
                        {categories?.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="Gender" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Gender
                      </label>
                      <select id="Gender" className="form-control form-select" value={formData.Gender} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="DateOfBirth" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Date Of Birth <span className="text-danger-600">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="DateOfBirth"
                        value={formData.DateOfBirth}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="PhoneNumber" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="PhoneNumber"
                        placeholder="Enter Phone Number"
                        value={formData.PhoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="EmailAddress" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Email Address <span className="text-danger-600">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="EmailAddress"
                        placeholder="Enter Email"
                        value={formData.EmailAddress}
                        onChange={handleChange}
                        required
                      />
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
                      <label htmlFor="FatherName" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Father's Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="FatherName"
                        placeholder="Enter Father's Name"
                        value={formData.FatherName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="FatherPhone" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Father's Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="FatherPhone"
                        placeholder="Enter Father's Number"
                        value={formData.FatherPhone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="FatherOccupation" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Father's Occupation
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="FatherOccupation"
                        placeholder="Enter Father's Occupation"
                        value={formData.FatherOccupation}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <DropZoneField label="Father's Photo" file={fatherPhoto} setFile={setFatherPhoto} />

                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="MotherName" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Mother's Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="MotherName"
                        placeholder="Enter Mother's Name"
                        value={formData.MotherName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="MotherPhone" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Mother's Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="MotherPhone"
                        placeholder="Enter Mother's Number"
                        value={formData.MotherPhone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="MotherOccupation" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Mother's Occupation
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="MotherOccupation"
                        placeholder="Enter Mother's Occupation"
                        value={formData.MotherOccupation}
                        onChange={handleChange}
                      />
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
                      <label htmlFor="GuardianName" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Guardian Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="GuardianName"
                        placeholder="Enter Guardian Name"
                        value={formData.GuardianName}
                        onChange={handleChange}
                        disabled={guardianType !== "others"}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="GuardianEmail" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Guardian Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="GuardianEmail"
                        placeholder="Enter Guardian Email"
                        value={formData.GuardianEmail}
                        onChange={handleChange}
                        disabled={guardianType !== "others"}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="GuardianPhone" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Guardian Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="GuardianPhone"
                        placeholder="Enter Guardian Number"
                        value={formData.GuardianPhone}
                        onChange={handleChange}
                        disabled={guardianType !== "others"}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="GuardianOccupation" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Guardian Occupation
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="GuardianOccupation"
                        placeholder="Enter Occupation"
                        value={formData.GuardianOccupation}
                        onChange={handleChange}
                        disabled={guardianType !== "others"}
                      />
                    </div>
                  </div>
                  <div className="col-xl-9 col-sm-6">
                    <div>
                      <label htmlFor="GuardianAddress" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Guardian Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="GuardianAddress"
                        placeholder="Enter Guardian Address"
                        value={formData.GuardianAddress}
                        onChange={handleChange}
                        disabled={guardianType !== "others"}
                      />
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
                      <label htmlFor="BloodGroup" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Blood Group
                      </label>
                      <select id="BloodGroup" className="form-control form-select" value={formData.BloodGroup} onChange={handleChange}>
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
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="Height" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Height
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="Height"
                        placeholder="Enter height"
                        value={formData.Height}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="Weight" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Weight
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="Weight"
                        placeholder="Enter Weight"
                        value={formData.Weight}
                        onChange={handleChange}
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
                      <label htmlFor="BankAccountNumber" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="BankAccountNumber"
                        placeholder="Enter bank account number"
                        value={formData.BankAccountNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="BankName" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="BankName"
                        placeholder="Enter bank name"
                        value={formData.BankName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="IFSCCode" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="IFSCCode"
                        placeholder="Enter IFSC Code"
                        value={formData.IFSCCode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-4 col-sm-6">
                    <div>
                      <label htmlFor="NationalIdentificationNumber" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        National Identification Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="NationalIdentificationNumber"
                        placeholder="Enter national identification number"
                        value={formData.NationalIdentificationNumber}
                        onChange={handleChange}
                      />
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
                      <label htmlFor="PreviousSchoolName" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        School Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="PreviousSchoolName"
                        placeholder="Enter School Name"
                        value={formData.PreviousSchoolName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div>
                      <label htmlFor="PreviousSchoolAddress" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="PreviousSchoolAddress"
                        placeholder="Enter Address"
                        value={formData.PreviousSchoolAddress}
                        onChange={handleChange}
                      />
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
                      <label htmlFor="CurrentAddress" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Current Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="CurrentAddress"
                        placeholder="Enter Current Address"
                        value={formData.CurrentAddress}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div>
                      <label htmlFor="PermanentAddress" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Permanent Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="PermanentAddress"
                        placeholder="Enter Permanent Address"
                        value={formData.PermanentAddress}
                        onChange={handleChange}
                      />
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
                      <label htmlFor="RoomNo" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Room No
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="RoomNo"
                        placeholder="Enter Room No"
                        value={formData.RoomNo}
                        onChange={handleChange}
                      />
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
                      <label htmlFor="DocumentName" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Doc Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="DocumentName"
                        placeholder="Enter Doc Name"
                        value={formData.DocumentName}
                        onChange={handleChange}
                      />
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
                      <label htmlFor="Details" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Details
                      </label>
                      <textarea
                        id="Details"
                        className="form-control"
                        placeholder="Enter details"
                        value={formData.Details}
                        onChange={handleChange}
                      ></textarea>
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
                      <label htmlFor="EmailAddress" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Email Address <span className="text-danger-600">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter Login Email"
                        id="EmailAddress"
                        value={formData.EmailAddress}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div>
                      <label htmlFor="Password" className="text-sm fw-semibold text-primary-light d-inline-block mb-8">
                        Password <span className="text-danger-600">*</span>
                      </label>
                      <div className="position-relative">
                        <input
                          type="password"
                          id="Password"
                          className="form-control"
                          placeholder="Enter your password"
                          value={formData.Password}
                          onChange={handleChange}
                          required
                        />
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
