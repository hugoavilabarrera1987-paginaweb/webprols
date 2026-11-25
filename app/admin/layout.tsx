import AdminLayoutShell from "./ui/AdminLayoutShell";

export const instant = false;

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
