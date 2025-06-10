import { Badge } from "@/components/ui/badge";

export default function TagBadges({ tags }: { tags: string[] }) {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, 2).map((tag) => (
        <Badge key={tag} variant="outline" className="text-xs">
          {tag}
        </Badge>
      ))}
      {tags.length > 2 && (
        <Badge variant="outline" className="text-xs">
          +{tags.length - 2}
        </Badge>
      )}
    </div>
  );
}
