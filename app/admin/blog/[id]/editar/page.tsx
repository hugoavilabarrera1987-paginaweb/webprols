import BlogEditor from "../../../ui/BlogEditor";

export const instant = false;

export default async function EditBlogPostPage({
  params,
}: PageProps<"/admin/blog/[id]/editar">) {
  const { id } = await params;
  return <BlogEditor postId={id} />;
}
