import { CheckCircle2, XCircle } from 'lucide-react';
import type { CheckResult } from '@/types';

interface DecisionBannerProps {
  result: CheckResult | null;
  roomName?: string;
}

export function DecisionBanner({ result, roomName }: DecisionBannerProps) {
  if (!result) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        Pick a room and a time interval to see an availability decision.
      </div>
    );
  }

  const available = result.decision === 'available';

  return (
    <div
      className={[
        'rounded-xl border p-4 transition-colors duration-200',
        available
          ? 'border-emerald-300 bg-emerald-50'
          : 'border-rose-300 bg-rose-50',
      ].join(' ')}
    >
      <div className="flex items-center gap-2">
        {available ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        ) : (
          <XCircle className="w-5 h-5 text-rose-600" />
        )}
        <span
          className={[
            'text-base font-semibold',
            available ? 'text-emerald-800' : 'text-rose-800',
          ].join(' ')}
        >
          {available ? 'Available' : 'Unavailable'}
          {roomName ? ` — ${roomName}` : ''}
        </span>
      </div>
      {result.reasons.length > 0 && (
        <ul className="mt-2 list-disc pl-6 text-sm text-rose-700 space-y-0.5">
          {result.reasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}
      {available && (
        <p className="mt-1.5 text-sm text-emerald-700">
          This interval is free. No bookings were changed.
        </p>
      )}
    </div>
  );
}
