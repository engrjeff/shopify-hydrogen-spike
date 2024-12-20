'use client';

import * as React from 'react';
import {cn} from '~/lib/utils';

export function CollectionDescription({description}: {description: string}) {
  const [expanded, setExpanded] = React.useState(false);

  if (!description) return null;

  return (
    <div className="text-neutral-700 text-[15px] font-light mb-1.5 flex items-center">
      <div
        suppressHydrationWarning
        className={cn(expanded ? 'block' : 'flex items-center')}
      >
        <div
          className={cn({
            'overflow-hidden line-clamp-1 [&_div]:line-clamp-1': !expanded,
          })}
          dangerouslySetInnerHTML={{__html: description}}
        ></div>
        <button
          className="underline shrink-0"
          onClick={() => setExpanded((val) => !val)}
        >
          read {expanded ? 'less' : 'more'}
        </button>
      </div>
    </div>
  );
}
