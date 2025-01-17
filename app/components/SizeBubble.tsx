import type {FetcherWithComponents} from '@remix-run/react';
import type {VariantOptionValue} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';

export function SizeBubble({optionItem}: {optionItem: VariantOptionValue}) {
  return (
    <CartForm
      route="/cart"
      inputs={{
        lines: optionItem.variant?.id
          ? [
              {
                merchandiseId: optionItem.variant?.id,
                quantity: 1,
                selectedVariant: optionItem.variant,
              },
            ]
          : [],
      }}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher: FetcherWithComponents<any>) => (
        <button
          type="submit"
          disabled={!optionItem.isAvailable || fetcher.state !== 'idle'}
          className="select-none border border-black h-7 w-7 flex items-center justify-center text-xs font-semibold rounded-full transition-colors duration-300 hover:text-white hover:bg-black disabled:hover:bg-transparent disabled:hover:text-black hover:border-black disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {optionItem.value}
        </button>
      )}
    </CartForm>
  );
}
