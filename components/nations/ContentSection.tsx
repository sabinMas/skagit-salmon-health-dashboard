import { Placeholder } from '@/components/ui/Placeholder';

interface ContentSectionProps {
  title: string;
  children?: React.ReactNode;
  tribeName?: string;
  sectionType?: string;
  showPlaceholder?: boolean;
}

export function ContentSection({
  title,
  children,
  tribeName,
  sectionType,
  showPlaceholder = false,
}: ContentSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-primary mb-4">{title}</h2>
      {showPlaceholder && tribeName ? (
        <Placeholder
          owner={tribeName}
          section={sectionType || title.toLowerCase().replace(/\s+/g, '-')}
        />
      ) : (
        <div className="prose max-w-none text-gray-700 leading-relaxed">{children}</div>
      )}
    </section>
  );
}