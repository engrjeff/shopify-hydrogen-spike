import {cn} from '~/lib/utils';
import {LoadingIcon, SearchIcon} from './Icons';
import {SearchFormPredictive} from './SearchFormPredictive';
import {SearchResultsPredictive} from './SearchResultsPredictive';

import {useEffect, useRef, useState} from 'react';

// export function StoreSearchTest() {
//   return (
//     <>
//       <Popover.Root>
//         <Popover.Anchor />
//         <Popover.Trigger className="cursor-pointer">
//           <SearchIcon />
//         </Popover.Trigger>
//         <Popover.Portal>
//           <Popover.Content side="top" sideOffset={-100} align="end">
//             <SearchFormPredictive>
//               {({fetchResults, goToSearch, inputRef}) => (
//                 <>
//                   <input
//                     name="q"
//                     onChange={fetchResults}
//                     onFocus={fetchResults}
//                     placeholder="Search"
//                     ref={inputRef}
//                     type="search"
//                     className="p-2 text-sm border-gray-300 outline-none hover:border-black focus-visible:ring-1 focus-visible:ring-black"
//                   />
//                   <button onClick={goToSearch}>Search</button>
//                 </>
//               )}
//             </SearchFormPredictive>
//             <SearchResultsPredictive>
//               {({closeSearch, inputRef, items, state, term, total}) => {
//                 const {queries, products, collections, pages} = items;

//                 if (state === 'loading' && term.current)
//                   return (
//                     <SearchResultsContainer className="flex items-center justify-center">
//                       <LoadingIcon />
//                     </SearchResultsContainer>
//                   );

//                 if (!total)
//                   return (
//                     <SearchResultsContainer>
//                       <SearchResultsPredictive.Empty term={term} />
//                     </SearchResultsContainer>
//                   );

//                 return (
//                   <SearchResultsContainer>
//                     <div className="flex gap-6">
//                       <div className="w-[200px] shrink-0 space-y-6 empty:hidden">
//                         <SearchResultsPredictive.Queries queries={queries} />

//                         <SearchResultsPredictive.Collections
//                           closeSearch={closeSearch}
//                           collections={collections}
//                           term={term}
//                         />

//                         <SearchResultsPredictive.Pages
//                           closeSearch={closeSearch}
//                           pages={pages}
//                           term={term}
//                         />
//                       </div>

//                       <SearchResultsPredictive.Products
//                         closeSearch={closeSearch}
//                         products={products}
//                         term={term}
//                       />
//                     </div>
//                   </SearchResultsContainer>
//                 );
//               }}
//             </SearchResultsPredictive>
//           </Popover.Content>
//         </Popover.Portal>
//       </Popover.Root>
//     </>
//   );
// }

export function StoreSearch() {
  const [open, setOpen] = useState(false);

  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  if (!open)
    return (
      <button onClick={() => setOpen(true)}>
        <SearchIcon />
      </button>
    );

  return (
    <div className="relative" ref={ref}>
      <SearchFormPredictive onClose={() => setOpen(false)}>
        {({fetchResults, goToSearch, inputRef}) => (
          <>
            <input
              name="q"
              onChange={fetchResults}
              onFocus={fetchResults}
              placeholder="Search"
              ref={inputRef}
              type="search"
              className="p-2 text-sm border-gray-300 outline-none hover:border-black focus-visible:ring-1 focus-visible:ring-black"
            />
            &nbsp;
            <button onClick={goToSearch}>Search</button>
          </>
        )}
      </SearchFormPredictive>

      <SearchResultsPredictive onClose={() => setOpen(false)}>
        {({closeSearch, inputRef, items, state, term, total}) => {
          const {queries, products, collections, pages} = items;

          if (state === 'loading' && term.current)
            return (
              <SearchResultsContainer className="flex items-center justify-center">
                <LoadingIcon />
              </SearchResultsContainer>
            );

          if (!total)
            return (
              <SearchResultsContainer>
                <SearchResultsPredictive.Empty term={term} />
              </SearchResultsContainer>
            );

          return (
            <SearchResultsContainer>
              <div className="flex gap-6">
                <div className="min-w-[200px] shrink-0 flex-1 space-y-6 empty:hidden">
                  <SearchResultsPredictive.Queries queries={queries} />

                  <SearchResultsPredictive.Collections
                    closeSearch={closeSearch}
                    collections={collections}
                    term={term}
                  />

                  <SearchResultsPredictive.Pages
                    closeSearch={closeSearch}
                    pages={pages}
                    term={term}
                  />
                </div>

                <SearchResultsPredictive.Products
                  closeSearch={closeSearch}
                  products={products}
                  term={term}
                />
              </div>
            </SearchResultsContainer>
          );
        }}
      </SearchResultsPredictive>
    </div>
  );
}

function SearchResultsContainer({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'store-search absolute top-12 right-0 w-[600px] bg-white border border-gray-300 shadow p-4 z-20',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

const useClickOutside = <T extends HTMLElement>(callback: () => void) => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Check if the click is outside the referenced element
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [callback]);

  return ref;
};

export default useClickOutside;
