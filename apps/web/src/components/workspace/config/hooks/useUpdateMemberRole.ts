"use client";

import { useState } from "react";
import { useWorkspaceMembers } from "@/hook/workspace/useWorkspaceMembers";

export function useUpdateMemberRole(
  memberId: string,
  currentRole: string,
  onClose: () => void,
) {
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const { updateRole, isUpdatingRole } = useWorkspaceMembers();

  function handleConfirm() {
    updateRole(
      { memberId, role: selectedRole },
      { onSuccess: onClose },
    );
  }

  return { selectedRole, setSelectedRole, handleConfirm, isUpdatingRole };
}
