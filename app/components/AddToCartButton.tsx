import {type FetcherWithComponents} from '@remix-run/react';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {CartIcon} from './Icons';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className="bg-black disabled:opacity-60 text-white p-1.5 w-full flex items-center justify-center h-[50px] text-[13px] font-bold uppercase space-x-3 hover:opacity-80 disabled:cursor-not-allowed"
          >
            <CartIcon className="mr-2" />{' '}
            {fetcher.state === 'submitting' ? 'Adding' : children}
          </button>
        </>
      )}
    </CartForm>
  );
}
