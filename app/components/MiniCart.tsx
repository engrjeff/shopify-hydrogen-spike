import {Await, Link, useAsyncValue} from '@remix-run/react';
import {Suspense} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartIcon, LoadingIcon} from './Icons';

export function MiniCart({cart}: {cart: Promise<CartApiQueryFragment | null>}) {
  return (
    <Suspense fallback={<CartBadge count={null} loading={true} />}>
      <Await resolve={cart}>
        <CartButton />
      </Await>
    </Suspense>
  );
}

function CartButton() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;

  return (
    <Link to="/cart" aria-label="Cart" className="relative p-1">
      <CartIcon aria-hidden={true} />
      <CartBadge count={originalCart?.totalQuantity ?? 0} loading={false} />
    </Link>
  );
}

function CartBadge({
  count,
  loading,
}: {
  count: null | number;
  loading?: boolean;
}) {
  if (loading)
    return (
      <span className="text-[10px] w-4 h-4 p-0.5 rounded-full leading-none inline-flex items-center justify-center absolute top-0 right-0 text-white bg-black">
        <LoadingIcon className="size-3" />
      </span>
    );

  if (count === 0) return null;

  return (
    <span className="text-[10px] w-4 h-4 rounded-full leading-none inline-flex items-center justify-center absolute top-0 right-0 text-white bg-black">
      {count}
    </span>
  );
}
