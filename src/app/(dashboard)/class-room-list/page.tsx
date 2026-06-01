"use client"

import Link from "next/link";
import * as React from "react";
import { useState } from "react";
import { useClassRooms, useDeleteClassRoom, useAddClassRoom, useUpdateClassRoom } from "@/features/class-room/hooks/useClassRoom";
import { useToast } from "@/components/Toast";
import { ClassRoom, AddClassRoomPayload, UpdateClassRoomPayload } from "@/features/class-room/api/classRoomApi";
import { AddClassRoomSidebar } from "@/features/class-room/template/AddClassRoomSidebar";
import { EditClassRoomSidebar } from "@/features/class-room/template/EditClassRoomSidebar";
import { DeleteClassRoomModal } from "@/features/class-room/template/DeleteClassRoomModal";
import { GetClassRoomTable } from "@/features/class-room/template/GetClassRoomTable";

export default function ClassRoomListPage() {
  const { data: classRooms, isLoading, error } = useClassRooms();
  const deleteMutation = useDeleteClassRoom();
  const addMutation = useAddClassRoom();
  const updateMutation = useUpdateClassRoom();

  const [selectedClassRoomId, setSelectedClassRoomId] = useState<number | null>(null);
  const { showToast } = useToast();

  // Sidebar visibility
  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const [showEditSidebar, setShowEditSidebar] = useState(false);

  // Add form state
  const [addForm, setAddForm] = useState<AddClassRoomPayload>({
    className: "",
    roomNumber: "",
    capacity: 0,
    floor: "",
    isActive: true,
  });

  // Edit form state
  const [editForm, setEditForm] = useState<UpdateClassRoomPayload>({
    id: 0,
    className: "",
    roomNumber: "",
    capacity: 0,
    floor: "",
    isActive: true,
  });

  // Handle Add
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(addForm, {
      onSuccess: () => {
        showToast("success", "ClassRoom Added", `Successfully added classroom "${addForm.className}"`);
        setShowAddSidebar(false);
        setAddForm({ className: "", roomNumber: "", capacity: 0, floor: "", isActive: true });
      },
      onError: (error: any) => {
        const errorMsg = error?.response?.data?.message || error?.message || "Failed to add classroom";
        showToast("error", "Error Adding ClassRoom", errorMsg);
      }
    });
  };

  // Handle Edit
  const openEditSidebar = (room: ClassRoom) => {
    setEditForm({
      id: room.id,
      className: room.className,
      roomNumber: room.roomNumber,
      capacity: room.capacity,
      floor: room.floor,
      isActive: room.isActive,
    });
    setShowEditSidebar(true);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(editForm, {
      onSuccess: () => {
        showToast("success", "ClassRoom Updated", `Successfully updated classroom "${editForm.className}"`);
        setShowEditSidebar(false);
      },
      onError: (error: any) => {
        const errorMsg = error?.response?.data?.message || error?.message || "Failed to update classroom";
        showToast("error", "Error Updating ClassRoom", errorMsg);
      }
    });
  };

  // Handle Delete
  const handleDelete = () => {
    if (selectedClassRoomId !== null) {
      deleteMutation.mutate(selectedClassRoomId, {
        onSuccess: () => {
          showToast("success", "ClassRoom Deleted", "Successfully deleted classroom");
          // Close modal using Bootstrap instance API
          const modalElement = document.getElementById("exampleModalDelete");
          if (modalElement && typeof window !== "undefined") {
            const bootstrap = (window as any).bootstrap;
            if (bootstrap) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
              modalInstance.hide();
            }
          }
          setSelectedClassRoomId(null);
        },
        onError: (error: any) => {
          const errorMsg = error?.response?.data?.message || error?.message || "Failed to delete classroom";
          showToast("error", "Error Deleting ClassRoom", errorMsg);
        }
      });
    }
  };

  return (
    <>
      <div className="breadcrumb d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h1 className="fw-semibold mb-4 h6 text-primary-light">Class Room List</h1>
          <div>
            <Link href="/" className="text-secondary-light hover-text-primary hover-underline">Dashboard </Link>
            <span className="text-secondary-light">/ Class Room List</span>
          </div>
        </div>
        <button type="button" onClick={() => setShowAddSidebar(true)} className="btn btn-primary-600 d-flex align-items-center gap-6">
          <span className="d-flex text-md">
            <i className="ri-add-large-line"></i>
          </span>
          Add Class Room
        </button>
      </div>

      <div className="mt-24">
        <GetClassRoomTable
          data={classRooms}
          isLoading={isLoading}
          error={error}
          onEdit={openEditSidebar}
          onDelete={setSelectedClassRoomId}
        />
      </div>

      {/* Overlay */}
      {(showAddSidebar || showEditSidebar) && (
        <div className="overlay active" onClick={() => { setShowAddSidebar(false); setShowEditSidebar(false); }}></div>
      )}

      {/* Add Sidebar Component */}
      <AddClassRoomSidebar
        isOpen={showAddSidebar}
        onClose={() => setShowAddSidebar(false)}
        onSubmit={handleAdd}
        formState={addForm}
        onChange={setAddForm}
        isPending={addMutation.isPending}
      />

      {/* Edit Sidebar Component */}
      <EditClassRoomSidebar
        isOpen={showEditSidebar}
        onClose={() => setShowEditSidebar(false)}
        onSubmit={handleEdit}
        formState={editForm}
        onChange={setEditForm}
        isPending={updateMutation.isPending}
      />

      {/* Delete Modal Component */}
      <DeleteClassRoomModal
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}
