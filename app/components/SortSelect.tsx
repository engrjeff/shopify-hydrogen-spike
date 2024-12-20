import {useId} from 'react';
import {ChevronIcon} from './Icons';

export function SortSelect() {
  const id = useId();

  return (
    <div className="relative xl:w-[215px] flex shrink-0">
      {/* {isPending ? <CallableLoadingOverlay /> : null} */}
      <label htmlFor={id} className="sr-only">
        Sort
      </label>
      <select
        // value={sortValue === null ? undefined : sortValue}
        // onChange={handleSortOrderChange}
        name="product_list_order"
        id={id}
        className="appearance-none flex h-[50px] xl:h-[35px] w-full items-center select-none justify-between border uppercase font-bold xl:normal-case xl:font-normal border-black xl:border-[#d3d3d3] bg-white pl-3 pr-7 py-1.5 text-[15px] placeholder:text-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
      >
        <option value="">Sort</option>
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
