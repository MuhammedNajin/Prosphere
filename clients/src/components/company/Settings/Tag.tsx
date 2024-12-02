
import React from 'react';
import { TagProps } from '@/types/Settings';

export const Tag: React.FC<TagProps> = ({ caption, onRemove }) => (
  <div className="flex gap-2 justify-center items-center py-1 pr-1 pl-3 bg-slate-50">
    <div className="self-stretch my-auto">{caption}</div>
    <button
      onClick={onRemove}
      className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
      aria-label={`Remove ${caption}`}
    >
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/12db31611bdb7affb76ac890fe274c0ebe6c673083925b7bdb6274395dd76b47?placeholderIfAbsent=true&apiKey=942cdf39840f4ab69951fbe195dac732" alt="" className="w-full h-full" />
    </button>
  </div>
);