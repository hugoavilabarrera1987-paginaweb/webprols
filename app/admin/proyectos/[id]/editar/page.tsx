import { ProjectEditor } from "../../../ui/ProjectEditor";

export const instant = false;

export default async function EditProjectPage({ params }: PageProps<"/admin/proyectos/[id]/editar">) {
  const { id } = await params;
  return <ProjectEditor projectId={id} />;
}
