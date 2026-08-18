import { AdminLink } from "@/components/admin/AdminUi";

export function QuestionAdminActions({
  id,
  onDelete,
}: {
  id: string;
  onDelete?: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <AdminLink href={`/admin/questions/${id}`}>View</AdminLink>
      <AdminLink href={`/admin/questions/${id}/edit`}>Edit</AdminLink>
      {onDelete ? (
        <button
          type="button"
          className="font-semibold text-hard hover:text-red-700"
          onClick={onDelete}
        >
          Delete
        </button>
      ) : null}
    </div>
  );
}
