import { Card, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Creates a statistic card
 */
export default function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex-1 flex-col">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className="space-y-2 pt-4 pb-2">
          <div className="text-2xl font-semibold tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}