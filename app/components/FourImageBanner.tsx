import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import type {
  Collection,
  MediaImage,
  Image as ShopifyImage,
} from '@shopify/hydrogen/storefront-api-types';
import type {FourImageContentBlockFragment} from 'storefrontapi.generated';

export function FourImageBanner({
  contentBlocks,
}: {
  contentBlocks: FourImageContentBlockFragment[];
}) {
  const blocks = formatContentBlockData(contentBlocks);

  return (
    <div className="grid gap-2 grid-cols-2 md:grid-cols-4 py-2">
      {blocks.map((block) => (
        <div key={block.id}>
          <Link to={`/collections/${block.collectionHandle}`}>
            <Image
              width={block.image?.width!}
              height={block.image?.height!}
              alt={block.image?.altText ?? ''}
              src={block.image?.url}
              sizes="100vw"
            />
          </Link>
        </div>
      ))}
    </div>
  );
}

type FourImageContentBlock = {
  id: string;
  collectionHandle: string;
  image: ShopifyImage | null;
};

function formatContentBlockData(
  contentBlocks: FourImageContentBlockFragment[],
) {
  const blocks: FourImageContentBlock[] = [];

  contentBlocks.forEach((block) => {
    const fields = block.fields;

    let collectionHandle = '';
    let image = null;

    fields.forEach((field) => {
      if (field.key === 'collection') {
        collectionHandle = (field.reference as Collection).handle;
      }

      if (field.key === 'image') {
        image = (field.reference as MediaImage).image as ShopifyImage;
      }
    });

    blocks.push({
      id: block.id,
      collectionHandle,
      image,
    });
  });

  return blocks;
}
