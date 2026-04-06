interface Props {
  title: string;
  description?: string;
}

export function WorkspaceHeaderConfig({ title, description }: Props) {
  return (
    <div>
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">
        {description ??
          "Gerencie as informações e preferências do seu workspace."}
      </p>
    </div>
  );
}
