import {Await, Link, NavLink, useAsyncValue} from '@remix-run/react';
import {
  type CartViewPayload,
  Image,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import {Suspense} from 'react';
import type {CartApiQueryFragment, HeaderQuery} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {cn} from '~/lib/utils';
import {AccountMenu} from './AccountMenu';
import {MenuIcon} from './Icons';
import {MiniCart} from './MiniCart';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;

  return (
    <header className="max-w-full z-[20] bg-white">
      <div className="container w-full max-w-[1400px] mx-auto px-4 lg:py-[11px] h-14 lg:h-[73.5px]">
        <div className="grid grid-cols-[auto_1fr_1fr] gap-4 items-center lg:grid-cols-3 py-3">
          <button
            className="justify-self-start lg:invisible lg:opacity-0 lg:pointer-events-none"
            aria-label="Menu"
          >
            <MenuIcon aria-hidden={true} className="size-6" />
          </button>
          <Link
            prefetch="intent"
            to="/"
            className="lg:justify-self-center mt-1"
          >
            <Image
              src={shop.brand?.logo?.image?.url}
              alt={shop.brand?.logo?.image?.altText ?? shop.name}
              width={115}
              height={27}
            />
          </Link>

          <div className="justify-self-end flex items-center gap-2">
            <span>Search</span>
            <AccountMenu isLoggedIn={isLoggedIn} />
            <MiniCart cart={cart} />
          </div>
        </div>
      </div>

      <Megamenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
      {/* <NavLink prefetch="intent" to="/" end>
        <Image
          src={shop.brand?.logo?.image?.url}
          alt={shop.brand?.logo?.image?.altText ?? shop.name}
          width={115}
          height={27}
        />
      </NavLink>
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} /> */}
    </header>
  );
}

export function Megamenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();

  return (
    <nav>
      <ul className="min-h-[53px] flex items-center justify-center flex-wrap">
        {menu?.items.map((item) => {
          if (!item.url) return null;
          // if the url is internal, we strip the domain
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;

          return (
            <li key={`megamenu-${item.id}`} className="mr-[11px]">
              <Link
                prefetch="intent"
                to={url}
                className="h-full inline-block px-2.5 cursor-pointer"
              >
                <span
                  className={cn(
                    'text-xs leading-[53px] font-normal font-heading uppercase text-neutral-600 hover:text-black transition-colors hover:no-underline',
                    {
                      'text-red-500': item.title?.toLowerCase() === 'sale',
                    },
                  )}
                >
                  {item.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  // return (
  //   <nav className={className} role="navigation">
  //     {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
  //       if (!item.url) return null;

  //       // if the url is internal, we strip the domain
  //       const url =
  //         item.url.includes('myshopify.com') ||
  //         item.url.includes(publicStoreDomain) ||
  //         item.url.includes(primaryDomainUrl)
  //           ? new URL(item.url).pathname
  //           : item.url;
  //       return (
  //         <NavLink
  //           className="header-menu-item"
  //           end
  //           key={item.id}
  //           onClick={close}
  //           prefetch="intent"
  //           style={activeLinkStyle}
  //           to={url}
  //         >
  //           {item.title}
  //         </NavLink>
  //       );
  //     })}
  //   </nav>
  // );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      Cart {count === null ? <span>&nbsp;</span> : count}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
