"use client";
import { logoutAction } from "@/app/actions/auth";

export default function LogoutButton() {
  return (
    <button className="btn-logout" onClick={() => logoutAction()}>
      Me déconnecter
    </button>
  );
}
