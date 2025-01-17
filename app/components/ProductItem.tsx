import {Link} from '@remix-run/react';
import {Image, Money, VariantSelector} from '@shopify/hydrogen';
import {useState} from 'react';
import type {PlpItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {SizeBubble} from './SizeBubble';

export function ProductItem({
  product,
  loading,
}: {
  product: PlpItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);

  const [justAddedToCart, setJustAddedToCart] = useState(false);

  return (
    <div className="w-full h-full relative flex flex-col">
      <div className="relative mb-2">
        <div className="flex relative">
          <Link
            prefetch="intent"
            to={`/products/${product.handle}`}
            className="flex-1 w-full"
          >
            {product.featuredImage && (
              <Image
                alt={product.featuredImage.altText || product.title}
                data={product.featuredImage}
                loading={loading}
                aspectRatio="5/8"
                sizes="(min-width: 45em) 375px, 100vw"
                className="object-cover object-top"
              />
            )}
            <span className="sr-only">click here to view</span>
          </Link>
        </div>

        {justAddedToCart ? (
          <div className="bg-black text-center py-3 absolute bottom-0 w-full">
            <span className="uppercase text-white text-sm font-semibold">
              It&apos;s in the bag!
            </span>
          </div>
        ) : null}
      </div>
      <Link
        to={`/products/${product.handle}`}
        className="text-sm inline-block hover:underline text-center uppercase mb-1"
      >
        <span className="line-clamp-2 w-full">{product?.title}</span>
      </Link>

      <small className="text-center text-[15px] font-bold">
        <Money data={product.priceRange.minVariantPrice} />
      </small>

      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={product.variants.nodes}
      >
        {({option}) => (
          <>
            <div className="flex items-center justify-center gap-1.5 flex-wrap mt-2">
              {option.values.map((optionItem) => {
                return (
                  <SizeBubble key={optionItem.value} optionItem={optionItem} />
                );
              })}
            </div>
          </>
        )}
      </VariantSelector>
    </div>
  );
}
