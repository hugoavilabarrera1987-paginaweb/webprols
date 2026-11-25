import { Suspense } from "react";
import { LoginForm } from "../ui/AuthForms";

export const instant = false;

export default function AdminLoginPage() {
  return <Suspense fallback={<div className="auth-loading">Cargando acceso seguro…</div>}><LoginForm /></Suspense>;
}
