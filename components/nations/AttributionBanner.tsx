interface AttributionBannerProps {
  tribeName: string;
  reviewDate?: string;
  approvedBy?: string;
}

export function AttributionBanner({
  tribeName,
  reviewDate,
  approvedBy,
}: AttributionBannerProps) {
  return (
    <div className="bg-blue-50 border-l-4 border-primary p-6 rounded-r-lg mb-8">
      <p className="text-sm text-gray-800 leading-relaxed">
        <strong className="font-semibold">Content Governance:</strong> Content on this page is
        authored and approved by <strong>{tribeName}</strong>.
        {reviewDate && (
          <>
            {' '}
            Last reviewed: <strong>{reviewDate}</strong>.
          </>
        )}
        {' '}
        <strong>{tribeName}</strong> retains the right to modify or remove this content at any
        time.
      </p>
      {approvedBy && (
        <p className="text-xs text-gray-600 mt-2">Approved by: {approvedBy}</p>
      )}
    </div>
  );
}