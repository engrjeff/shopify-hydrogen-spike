import type {FetcherWithComponents} from '@remix-run/react';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useRef} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div aria-labelledby="cart-summary" className="w-sm shrink-0 space-y-4">
      <CartDiscounts discountCodes={cart.discountCodes} />
      <CartGiftCard giftCardCodes={cart.appliedGiftCards} />

      <div>
        <h4 className="text-sm font-semibold mb-2">Order Summary</h4>
        <div className="border border-neutral-300 bg-neutral-100 p-4 flex flex-col gap-2">
          <dl className="flex">
            <dt className="text-xs uppercase">Subtotal</dt>
            <dd className="ml-auto text-xs font-mono">
              {cart.cost?.subtotalAmount?.amount ? (
                <Money data={cart.cost?.subtotalAmount} />
              ) : (
                '-'
              )}
            </dd>
          </dl>
          {cart.discountCodes?.length
            ? cart.discountCodes.map((discount, di) => (
                <dl key={discount.code} className="flex">
                  <dt className="text-xs uppercase">Discount {di + 1}</dt>
                  <dd
                    data-isapplicable={!!discount.applicable}
                    className="ml-auto text-xs font-mono data-[isapplicable=false]:line-through"
                  >
                    {discount.code}
                  </dd>
                </dl>
              ))
            : null}
          {cart.cost?.totalTaxAmount ? (
            <dl className="flex">
              <dt className="text-xs uppercase">Tax</dt>
              <dd className="ml-auto text-xs font-mono">
                {cart.cost?.totalTaxAmount?.amount ? (
                  <Money data={cart.cost?.totalTaxAmount} />
                ) : (
                  '-'
                )}
              </dd>
            </dl>
          ) : null}
          {cart.cost?.totalDutyAmount ? (
            <dl className="flex">
              <dt className="text-xs uppercase">Duties</dt>
              <dd className="ml-auto text-xs font-mono">
                {cart.cost?.totalDutyAmount?.amount ? (
                  <Money data={cart.cost?.totalDutyAmount} />
                ) : (
                  '-'
                )}
              </dd>
            </dl>
          ) : null}
          <dl className="flex pt-2 mt-2 border-t border-t-neutral-300">
            <dt className="text-xs uppercase font-semibold">Total</dt>
            <dd className="ml-auto text-xs font-mono font-semibold">
              {cart.cost?.totalAmount?.amount ? (
                <Money data={cart.cost?.totalAmount} />
              ) : (
                '-'
              )}
            </dd>
          </dl>
        </div>
        <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
      </div>
    </div>
  );
}
function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="mt-6">
      <a
        href={checkoutUrl}
        target="_self"
        className="bg-black text-sm uppercase text-white hover:opacity-80 transition-colors inline-block w-full px-3 py-3 text-center"
      >
        <p>Continue to Checkout &rarr;</p>
      </a>
      <br />
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">Coupon code</h4>

      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div className="bg-neutral-200 p-3 text-sm">
          <dt className="mb-2">Discount(s)</dt>
          <div className="flex justify-between">
            <code>{codes?.join(', ')}</code>
            &nbsp;
            <UpdateDiscountForm>
              {(isSubmitting) => (
                <button
                  type="submit"
                  className="text-red-500 hover:underline disabled:opacity-80"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Pls wait' : 'Remove'}
                </button>
              )}
            </UpdateDiscountForm>
          </div>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        {(isSubmitting) => (
          <fieldset disabled={isSubmitting} className="flex gap-3">
            <input
              type="text"
              name="discountCode"
              placeholder="Discount code"
              className="px-3 py-2 flex-1 focus-visible:ring-1 focus-visible:ring-black focus-visible:border-black text-base border border-neutral-200 placeholder:text-neutral-300 outline-none"
            />
            <button
              type="submit"
              className="h-[42px] px-6 text-sm inline-block shrink-0 text-white bg-black text-center disabled:opacity-80"
            >
              {isSubmitting ? 'Wait...' : 'Apply'}
            </button>
          </fieldset>
        )}
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: (isSubmitting: boolean) => React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) =>
        children(fetcher.state === 'submitting')
      }
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const codes: string[] =
    giftCardCodes?.map(({lastCharacters}) => `***${lastCharacters}`) || [];

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    giftCardCodeInput.current!.value = '';
  }

  function removeAppliedCode() {
    appliedGiftCardCodes.current = [];
  }

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2">Gift card</h4>
      <div>
        {/* Have existing gift card applied, display it with a remove option */}
        <dl hidden={!codes.length}>
          <div>
            <dt>Applied Gift Card(s)</dt>
            <UpdateGiftCardForm>
              <div className="cart-discount">
                <code>{codes?.join(', ')}</code>
                &nbsp;
                <button onSubmit={() => removeAppliedCode}>Remove</button>
              </div>
            </UpdateGiftCardForm>
          </div>
        </dl>

        {/* Show an input to apply a discount */}
        <UpdateGiftCardForm
          giftCardCodes={appliedGiftCardCodes.current}
          saveAppliedCode={saveAppliedCode}
        >
          <div className="flex gap-3">
            <input
              type="text"
              name="giftCardCode"
              placeholder="Gift card code"
              ref={giftCardCodeInput}
              className="px-3 py-2 flex-1 focus-visible:ring-1 focus-visible:ring-black focus-visible:border-black text-base border border-neutral-200 placeholder:text-neutral-300 outline-none"
            />
            <button
              type="submit"
              className="h-[42px] px-6 text-sm inline-block shrink-0 text-white bg-black text-center"
            >
              Apply
            </button>
          </div>
        </UpdateGiftCardForm>
      </div>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  removeAppliedCode?: () => void;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code) saveAppliedCode && saveAppliedCode(code as string);
        return children;
      }}
    </CartForm>
  );
}
