import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import type {
  Collection,
  MediaImage,
  Image as ShopifyImage,
} from '@shopify/hydrogen/storefront-api-types';
import type {HomePageContentBlockFragment} from 'storefrontapi.generated';

export function HeroBanner({
  contentBlocks,
}: {
  contentBlocks: HomePageContentBlockFragment[];
}) {
  const blocks = formatContentBlockData(contentBlocks);

  return (
    <div>
      {blocks.map((block) => (
        <div key={block.id}>
          <Link to={`/collections/${block.collectionHandle}`}>
            <Image
              width={block.largeImage?.width!}
              height={block.largeImage?.height!}
              alt={block.largeImage?.altText ?? ''}
              src={block.largeImage?.url}
              sizes="100vw"
              className="hidden md:block"
            />
            <Image
              width={block.mobileImage?.width!}
              height={block.mobileImage?.height!}
              alt={block.mobileImage?.altText ?? ''}
              src={block.mobileImage?.url}
              sizes="100vw"
              className="md:hidden"
            />
          </Link>
        </div>
      ))}
    </div>
  );
}

type HomePageBlock = {
  id: string;
  collectionHandle: string;
  largeImage: ShopifyImage | null;
  mobileImage: ShopifyImage | null;
};

function formatContentBlockData(contentBlocks: HomePageContentBlockFragment[]) {
  const blocks: HomePageBlock[] = [];

  contentBlocks.forEach((block) => {
    const fields = block.fields;

    let collectionHandle = '';
    let largeImage = null;
    let mobileImage = null;

    fields.forEach((field) => {
      if (field.key === 'collection') {
        collectionHandle = (field.reference as Collection).handle;
      }

      if (field.key === 'large_image') {
        largeImage = (field.reference as MediaImage).image as ShopifyImage;
      }

      if (field.key === 'mobile_image') {
        mobileImage = (field.reference as MediaImage).image as ShopifyImage;
      }
    });

    blocks.push({
      id: block.id,
      collectionHandle,
      largeImage,
      mobileImage,
    });
  });

  return blocks;
}
