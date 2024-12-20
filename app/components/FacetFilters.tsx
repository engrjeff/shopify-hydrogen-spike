import type {FacetsQuery} from 'storefrontapi.generated';

import * as Collapsible from '@radix-ui/react-collapsible';
import {Link, useSearchParams} from '@remix-run/react';
import type {Filter} from '@shopify/hydrogen/storefront-api-types';
import {cn} from '~/lib/utils';
import {CheckIcon, ChevronIcon} from './Icons';

export function FacetFilters({
  facets,
}: {
  facets: FacetsQuery['collection'] | null | undefined;
}) {
  if (!facets) return null;

  return (
    <ul className="border-t border-[#d9d9d9]">
      {facets?.products.filters.map((facet) => (
        <li key={facet.id}>
          <FacetFilterItem handle={facets.handle} facetFilter={facet} />
        </li>
      ))}
    </ul>
  );
}

function FacetFilterItem({
  handle,
  facetFilter,
}: {
  handle: string;
  facetFilter: Filter;
}) {
  const [searchParams] = useSearchParams();

  return (
    <Collapsible.Root className="border-b border-[#d9d9d9]">
      <Collapsible.Trigger className="group flex items-center justify-between pt-[14px] pb-[14px] w-full">
        <span className="font-semibold uppercase text-[15px]">
          {facetFilter.label}
        </span>{' '}
        <ChevronIcon className="size-4 transition-transform duration-300 group-data-[state=open]:rotate-90" />
      </Collapsible.Trigger>
      <Collapsible.Content asChild className="pb-[14px]">
        {facetFilter.type === 'LIST' ? (
          <ul>
            {facetFilter.values.map((option) => {
              const query = new URLSearchParams(
                JSON.parse(option.input as string) as {[key: string]: string},
              );

              const key = Array.from(query.keys())?.at(0);
              const value = Array.from(query.values())?.at(0);

              return (
                <li key={option.id}>
                  <Link
                    to={{
                      pathname: `/collections/${handle}`,
                      search: query.toString(),
                    }}
                    className="w-full h-[30px] flex items-center"
                  >
                    <span
                      className={cn(
                        'h-5 w-5 rounded-full flex items-center justify-center overflow-hidden border border-[#333333]',
                        {
                          'bg-black': searchParams
                            ?.getAll(key!)
                            .includes(value!),
                        },
                      )}
                    >
                      <CheckIcon className="size-4 text-white" />
                    </span>

                    <span className="text-[13px] uppercase ml-[13px]">
                      {option.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          'Price Range here'
        )}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
