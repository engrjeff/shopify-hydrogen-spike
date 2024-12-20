import {Link} from '@remix-run/react';
import {type VariantOption, VariantSelector} from '@shopify/hydrogen';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {cn} from '~/lib/utils';

export function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  const {open} = useAside();
  return (
    <div className="space-y-4">
      <VariantSelector
        handle={product.handle}
        options={product.options.filter(
          (option) => option.optionValues.length > 1,
        )}
        variants={variants}
      >
        {({option}) => (
          <ProductOptions
            key={option.name}
            option={option}
            selectedVariant={selectedVariant}
          />
        )}
      </VariantSelector>
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptions({
  option,
  selectedVariant,
}: {
  option: VariantOption;
  selectedVariant: ProductFragment['selectedVariant'];
}) {
  return (
    <div className="space-y-2" key={option.name}>
      <h5 className="text-neutral-600">
        {option.name}: {selectedVariant?.selectedOptions?.at(0)?.value}
      </h5>
      <div className="flex items-center gap-2">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className={cn(
                'relative cursor-pointer shrink-0 select-none text-[11px] h-12 w-12 mr-[7px] text-black border border-black text-center rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors',
                isActive ? 'bg-black text-white' : '',
                !isAvailable
                  ? 'border-neutral-300 text-neutral-300 after:absolute after:inset-y-0 after:w-px after:h-full after:bg-neutral-300 after:rotate-45 cursor-not-allowed hover:bg-transparent hover:text-neutral-300'
                  : '',
              )}
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
            >
              {value}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
