interface AuthHeaderProps {
  title: string;
  description?: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="text-center flex flex-col gap-3 items-center">
      {/* <Link href="/" className="flex items-center gap-1 mb-4 text-sm">
        <IconLogo size={18} />
        <span className="font-semibold">{APP_NAME}</span>
      </Link> */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
