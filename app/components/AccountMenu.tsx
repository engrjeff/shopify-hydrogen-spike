import {Await, Form, Link, useRouteLoaderData} from '@remix-run/react';
import {Suspense} from 'react';
import type {RootLoader} from '~/root';
import {AccountIcon} from './Icons';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function AccountMenu({isLoggedIn}: {isLoggedIn: Promise<boolean>}) {
  return (
    <Suspense fallback={<AccountIcon aria-hidden={true} />}>
      <Await resolve={isLoggedIn} errorElement="Sign in">
        {(isLoggedIn) =>
          isLoggedIn ? (
            <AccountDropdown />
          ) : (
            <Link to="/account" aria-label="go to account">
              <AccountIcon aria-hidden={true} />{' '}
            </Link>
          )
        }
      </Await>
    </Suspense>
  );
}

function AccountDropdown() {
  const data = useRouteLoaderData<RootLoader>('root');

  return (
    <Await resolve={data?.customer}>
      {(customer) => (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="p-1 size-6 border border-black text-black rounded-full text-xs focus-visible:outline-black">
            {customer?.data.customer.firstName?.at(0)}
            {customer?.data.customer.lastName?.at(0)}
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="border rounded border-neutral-300 bg-white flex flex-col p-1">
              <DropdownMenu.Item
                asChild
                className="px-1 py-0.5 outline-none hover:bg-neutral-100"
              >
                <Link to="/account">Account</Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                asChild
                className="px-1 py-0.5 outline-none hover:bg-neutral-100"
              >
                <Link to="/account/profile">Profile</Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                asChild
                className="px-1 py-0.5 outline-none hover:bg-neutral-100"
              >
                <Link to="/account/orders">Orders</Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                asChild
                className="px-1 py-0.5 outline-none hover:bg-neutral-100"
              >
                <Link to="/account/addresses">Address Book</Link>
              </DropdownMenu.Item>

              <Form method="POST" action="/account/logout">
                <button
                  className="px-1 py-0.5 outline-none inline-block w-full text-left hover:bg-neutral-100"
                  type="submit"
                >
                  Log out
                </button>
              </Form>
              <DropdownMenu.Arrow className="fill-white" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
    </Await>
  );
}
