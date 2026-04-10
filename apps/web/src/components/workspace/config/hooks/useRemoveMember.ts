"use client";

import { useState } from "react";
import { useWorkspaceMembers } from "@/hook/workspace/useWorkspaceMembers";

export function useRemoveMember(
  memberId: string,
  memberEmail: string,
  onClose: () => void,
) {
  const [confirmEmail, setConfirmEmail] = useState("");
  const { removeMember, isRemoving } = useWorkspaceMembers();

  const isConfirmed = confirmEmail === memberEmail;

  function handleConfirm() {
    if (!isConfirmed) return;
    removeMember(memberId, { onSuccess: onClose });
  }

  function reset() {
    setConfirmEmail("");
  }

  return { confirmEmail, setConfirmEmail, handleConfirm, isRemoving, isConfirmed, reset };
}
