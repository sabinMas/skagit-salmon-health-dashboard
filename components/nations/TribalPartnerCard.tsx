import Link from 'next/link';
import { Card } from '@/components/ui/Card';

interface TribalPartnerCardProps {
  tribe: {
    name: string;
    slug: string;
    tagline: string;
  };
}

export function TribalPartnerCard({ tribe }: TribalPartnerCardProps) {
  return (
    <Link href={`/nations/${tribe.slug}`}>
      <Card className="hover:shadow-xl transition-all duration-300 h-full">
        <div className="p-6">
          {/* Placeholder for tribal image/logo */}
          <div className="w-full h-48 bg-gradient-to-br from-primary to-accent rounded-lg mb-4 flex items-center justify-center">
            <span className="text-6xl text-white">🦅</span>
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">{tribe.name}</h3>
          <p className="text-gray-700 text-sm leading-relaxed">{tribe.tagline}</p>
          <div className="mt-4 text-primary font-semibold text-sm">
            Visit Page →
          </div>
        </div>
      </Card>
    </Link>
  );
}