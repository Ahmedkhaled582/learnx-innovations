"use client";

import { useAuthStore } from "@/store/useAuthStore";


export default function ProFilePage() {
const {user} = useAuthStore();
 

  return (
    <div>
      <h1>name</h1>
      <h1>{user?.fullName}</h1>

    </div>
  );
}
