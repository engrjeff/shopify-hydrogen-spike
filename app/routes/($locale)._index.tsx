import {Await, Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {FourImageBanner} from '~/components/FourImageBanner';
import {HeroBanner} from '~/components/HeroBanner';

export const meta: MetaFunction = () => {
  return [{title: 'Showpo UK'}];
};

export async function loader(args: LoaderFunctionArgs) {
  const homepage = await args.context.storefront.query(HOME_PAGE_QUERY);

  return {
    homepage,
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [homepage] = await Promise.all([
    context.storefront.query(HOME_PAGE_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    homepage,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Homepage() {
  const {homepage} = useLoaderData<typeof loader>();

  const heroBanners = homepage.metaobject?.fields.find(
    (f) => f.key === 'hero_banner',
  );

  const fourImageBanners = homepage.metaobject?.fields.find(
    (f) => f.key === 'four_image_banner',
  );

  return (
    <div>
      <HeroBanner contentBlocks={heroBanners?.references?.nodes ?? []} />
      <FourImageBanner
        contentBlocks={fourImageBanners?.references?.nodes ?? []}
      />
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <Link
                      key={product.id}
                      className="recommended-product"
                      to={`/products/${product.handle}`}
                    >
                      <Image
                        data={product.images.nodes[0]}
                        aspectRatio="5/8"
                        sizes="(min-width: 375px) 375px, 50vw"
                      />
                      <h4>{product.title}</h4>
                      <small>
                        <Money data={product.priceRange.minVariantPrice} />
                      </small>
                    </Link>
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

// Query for Home Page
const HOME_PAGE_QUERY = `#graphql
fragment HomePageContentBlock on Metaobject {
  id
  fields {
    key
    type
    value
    reference {
      ... on Collection {
        handle
        title
      }
      ... on MediaImage {
        id
        image {
          id
          altText
          height
          width
          url
        }
      }
    }
  }
}
fragment FourImageContentBlock on Metaobject {
  id
  fields {
    key
    type
    value
    reference {
      ... on Collection {
        handle
        title
      }
      ... on MediaImage {
        id
        image {
          id
          altText
          height
          width
          url
        }
      }
    }
  }
}
query HomePage {
  metaobject(handle: { handle: "home-page", type: "home_page" }) {
    handle
    id
    type
    fields {
      key
      type
      value
      references(first: 10) {
        nodes {
          ...HomePageContentBlock
          ...FourImageContentBlock
        }
      }
    }
  }
}
` as const;

// Query for Home Page
// const FOUR_IMAGE_BANNER_QUERY = `#graphql
// fragment FourImageContentBlock on Metaobject {
//             id
//             fields {
//               key
//               type
//               value
//               reference {
//                 ...on Collection {
//                   handle
//                   title
//                 }
//                 ...on MediaImage {
//                   id
//                   image {
//                     id
//                     altText
//                     height
//                     width
//                     url
//                   }
//                 }
//               }
//             }
//           }
// query FourImageBanner {
//   metaobject(handle:  {
//      handle: "four-image-banner"
//      type: "four_image_banner"
//   }) {
//     handle
//     id
//     type
//     fields {
//       key
//       type
//       value
//       references(first: 10) {
//         nodes {
//           ...FourImageContentBlock
//         }
//       }
//     }
//   }
// }

// ` as const;
