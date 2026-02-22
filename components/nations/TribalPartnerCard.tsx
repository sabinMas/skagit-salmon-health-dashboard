import Link from 'next/link';
import { Card } from '@/components/ui/Card';

interface TribalPartnerCardProps {
  tribe: {
    name: string;
    displayName?: string;
    slug: string;
    tagline: string;
    hasContent?: boolean;
  };
}

export function TribalPartnerCard({ tribe }: TribalPartnerCardProps) {
  const label = tribe.displayName ?? tribe.name;
  return (
    <Link href={`/nations/${tribe.slug}`}>
      <Card className="hover:shadow-xl transition-all duration-300 h-full">
        <div className="p-6">
          {/* Placeholder for tribal image/logo */}
          <div className="w-full h-48 bg-gradient-to-br from-primary to-accent rounded-lg mb-4 flex items-center justify-center">
            <span className="text-4xl font-bold text-white opacity-30 select-none">
              {label.charAt(0)}
            </span>
          </div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold text-primary leading-snug">{label}</h3>
            {tribe.hasContent && (
              <span className="shrink-0 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                Content live
              </span>
            )}
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{tribe.tagline}</p>
          <div className="mt-4 text-primary font-semibold text-sm">
            Visit Page →
          </div>
        </div>
      </Card>
    </Link>
  );
}