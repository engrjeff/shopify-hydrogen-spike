import {Image} from '@shopify/hydrogen';
import type {ProductVariantFragment} from 'storefrontapi.generated';

export function ProductImage({
  image,
}: {
  image: ProductVariantFragment['image'];
}) {
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <div>
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="5/8"
        data={image}
        key={image.id}
        sizes="(min-width: 375px) 375px, 100vw"
      />
    </div>
  );
}
