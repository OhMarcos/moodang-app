"use client";

import type { FeatureAnalysis } from "@/lib/gwansang/types";
import { getStars } from "@/lib/gwansang/utils";

interface FeatureCardProps {
  label: string;
  icon: string;
  feature: FeatureAnalysis;
}

export default function FeatureCard({ label, icon, feature }: FeatureCardProps) {
  return (
    <div className="bg-[var(--color-bg-elevated)] rounded-lg p-3.5 border border-[var(--color-border)]">
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-semibold text-[var(--color-ivory)]">
            {label}
          </span>
        </div>
        <span className="text-xs text-[var(--color-gold)]">
          {getStars(feature.rating)}
        </span>
      </div>
      <p className="text-xs text-[var(--color-gold-dim)] font-medium mb-1">
        {feature.type}
      </p>
      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
}
