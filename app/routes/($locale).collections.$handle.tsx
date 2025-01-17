import type {MetaFunction} from '@remix-run/react';
import {useLoaderData} from '@remix-run/react';
import {getPaginationVariables} from '@shopify/hydrogen';
import type {ProductCollectionSortKeys} from '@shopify/hydrogen/storefront-api-types';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {FacetsQuery} from 'storefrontapi.generated';
import {CollectionDescription} from '~/components/CollectionDescription';
import {FacetFilters} from '~/components/FacetFilters';
import {ProductItem} from '~/components/ProductItem';
import {SortSelect} from '~/components/SortSelect';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `${data?.collection.title ?? 'Showpo UK'}`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  const {searchParams} = new URL(request.url);

  const queryObj = Object.fromEntries(searchParams.entries());

  const {sortKey, ...queries} = queryObj;

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 36,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}, {collection: facets}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        ...paginationVariables,
        filters: [
          {
            ...queries,
            available: queryObj.available
              ? queryObj.available === 'true'
                ? true
                : false
              : undefined,
          },
        ],
        sortKey: sortKey as ProductCollectionSortKeys,
      },
      // Add other queries here, so that they are loaded in parallel
    }),
    storefront.query(PLP_FACET_FILTERS, {
      variables: {collectionHandle: handle},
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return {
    collection,
    facets,
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

export default function Collection() {
  const {collection, facets} = useLoaderData<typeof loader>();

  const productCount = collection.products.nodes.length;

  const products = collection.products.nodes;

  return (
    <>
      <div className="container w-full max-w-[1400px] mx-auto px-4">
        <div className="pt-4 pb-2 lg:py-6 flex justify-center items-center">
          <div className="flex items-center flex-wrap justify-center gap-1 lg:gap-3 mb-3 lg:mb-0">
            <h1 className="font-sans font-bold text-xl mb-0 text-center whitespace-nowrap">
              {collection.title}
            </h1>
            <span className="hidden font-normal text-lightText text-sm whitespace-nowrap">
              {productCount} {productCount > 1 ? 'items' : 'item'}
            </span>
          </div>
        </div>
        <CollectionDescription description={collection.description} />

        {productCount === 0 ? (
          <div className="text-center my-6">
            <p className="font-semibold mb-1">
              Sorry, there are no products for this category.
            </p>
            <p className="text-neutral-500 text-sm">
              Check out our other categories!
            </p>
          </div>
        ) : (
          <div className="mb-20 md:mt-4">
            <div className="flex flex-col xl:flex-row xl:gap-8">
              <div className="w-[215px] flex-shrink-0 hidden xl:block space-y-2">
                <SortSelect key={collection.handle} />
                <FacetFilters
                  facets={
                    facets as FacetsQuery['collection'] | null | undefined
                  }
                />
              </div>
              <div className="flex-1">
                <div className="hidden xl:flex items-center justify-end pb-6 min-h-[54px]">
                  Top Pagination here
                </div>
                <ul className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-5 gap-y-3 gap-x-2">
                  {products?.map((product, index) => (
                    <li key={`product-${product?.id}`}>
                      <ProductItem product={product} />
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end py-6 min-h-[54px]">
                  Bottom Pagination here
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  // return (
  //   <div className="collection container mx-auto max-w-[1280px]">
  //     <h1 className="text-lg">{collection.title}</h1>
  //     <p className="text-sm line-clamp-2">{collection.description}</p>
  //     {/* <PaginatedResourceSection
  //       connection={collection.products}
  //       resourcesClassName="products-grid"
  //     >
  //       {({node: product, index}) => (
  //         <ProductItem
  //           key={product.id}
  //           product={product}
  //           loading={index < 8 ? 'eager' : undefined}
  //         />
  //       )}
  //     </PaginatedResourceSection> */}
  //     <ul className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-5 gap-y-3 gap-x-2">
  //       {collection.products.nodes.map((product, index) => (
  //         <li key={product.id}>
  //           <ProductItem
  //             product={product}
  //             loading={index < 8 ? 'eager' : undefined}
  //           />
  //         </li>
  //       ))}
  //     </ul>
  //     <Analytics.CollectionView
  //       data={{
  //         collection: {
  //           id: collection.id,
  //           handle: collection.handle,
  //         },
  //       }}
  //     />
  //   </div>
  // );
}

const PLP_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment PLPItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 20) {
      nodes {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
      }
    }
    options {
      id
      name
      optionValues {
        id
        name
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PLP_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml 
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
        sortKey: $sortKey
      ) {
        nodes {
          ...PLPItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;

// Facet filters query
const PLP_FACET_FILTERS = `#graphql
  query Facets ($collectionHandle: String!) {
    collection(handle: $collectionHandle) {
      handle
      products(first: 36) {
        filters {
          id
          label
          type
          values {
            count
            id
            label
            input
          }
        }
      }
    }
  }
` as const;
