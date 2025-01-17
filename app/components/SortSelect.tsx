import {useSearchParams} from '@remix-run/react';
import type {ChangeEvent} from 'react';
import {useId} from 'react';
import {ChevronIcon} from './Icons';

export function SortSelect() {
  const id = useId();

  const [searchParams, setSearchParams] = useSearchParams();

  const sortKey = searchParams.get('sortKey');

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams();
    params.set('sortKey', e.currentTarget.value);
    setSearchParams(params, {
      preventScrollReset: true,
    });
  }

  return (
    <div className="relative xl:w-[215px] flex shrink-0">
      {/* {isPending ? <CallableLoadingOverlay /> : null} */}
      <label htmlFor={id} className="sr-only">
        Sort
      </label>
      <select
        value={sortKey === null ? undefined : sortKey}
        onChange={handleChange}
        name="sortKey"
        id={id}
        className="appearance-none flex h-[50px] xl:h-[35px] w-full items-center select-none justify-between border uppercase font-bold xl:normal-case xl:font-normal border-black xl:border-[#d3d3d3] bg-white pl-3 pr-7 py-1.5 text-[15px] placeholder:text-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
      >
        <option value="BEST_SELLING">Most Popular</option>
        <option value="CREATED">New In</option>
        <option value="PRICE">Price</option>
        {/* {sortFieldsOptions?.map((option) => (
          <option
            key={`sort-option-${option?.value}`}
            value={option?.value ?? ''}
          >
            {getLabel(option?.label!)}
          </option>
        ))} */}
      </select>
      <ChevronIcon className="size-4 rotate-90 xl:opacity-50 absolute top-1/2 -translate-y-1/2 right-3" />
    </div>
  );
}
