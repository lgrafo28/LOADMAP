type SectionHeaderProps = {
  kicker: string;
  title: string;
  description: string;
};

export function SectionHeader({ kicker, title, description }: SectionHeaderProps) {
  return (
    <div className="relative space-y-4">
      <p className="tech-label text-[11px] text-brand-300">{kicker}</p>
      <div className="space-y-3">
        <h2 className="display max-w-[18ch] text-3xl text-ink md:text-[40px]">{title}</h2>
        <p className="max-w-2xl text-sm leading-7 text-ink-muted md:text-base">{description}</p>
      </div>
    </div>
  );
}
