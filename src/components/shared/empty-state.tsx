interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center">
      <p className="font-mono text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
