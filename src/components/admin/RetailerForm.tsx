'use client';

import Link from 'next/link';

import { useActionState } from 'react';

import { saveRetailer, type ActionState } from '@/lib/actions';
import { products } from '@/data/products';
import type { Retailer } from '@/lib/types';

const inputClass =
  'mt-1.5 h-11 w-full border border-hairline-strong bg-ink px-3 text-[13px] text-paper placeholder:text-muted focus:border-acid focus:outline-none';

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  hint,
  type = 'text',
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="meta text-muted">
        {label} {required && <span className="text-magenta">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />
      {hint && <p className="mt-1 text-[11px] text-muted">{hint}</p>}
    </div>
  );
}

export function RetailerForm({ retailer }: { retailer?: Retailer }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveRetailer, null);

  return (
    <form action={action} className="max-w-3xl">
      {retailer && <input type="hidden" name="id" value={retailer.id} />}
      {retailer && <input type="hidden" name="slug" value={retailer.slug} />}

      <fieldset className="border border-hairline bg-surface p-5">
        <legend className="meta px-2 text-acid">IDENTITY</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Store name" name="name" defaultValue={retailer?.name} required />
          <Field
            label="Neighborhood"
            name="neighborhood"
            defaultValue={retailer?.neighborhood}
            placeholder="Ozone Park"
          />
          <Field
            label="Borough / region"
            name="borough"
            defaultValue={retailer?.borough}
            placeholder="Queens"
          />
          <Field
            label="NY OCM license"
            name="licenseNumber"
            defaultValue={retailer?.licenseNumber}
            placeholder="OCM-CAURD-00-000000"
          />
        </div>
      </fieldset>

      <fieldset className="mt-4 border border-hairline bg-surface p-5">
        <legend className="meta px-2 text-acid">ADDRESS</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Street" name="street" defaultValue={retailer?.address.street} required />
          <Field label="City" name="city" defaultValue={retailer?.address.city} required />
          <Field label="State" name="state" defaultValue={retailer?.address.state ?? 'NY'} required />
          <Field label="ZIP" name="zip" defaultValue={retailer?.address.zip} required />
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-muted">
          Coordinates are geocoded automatically whenever the address changes. The manual
          fields below are only applied if you save without editing the address.
        </p>

        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Field
            label="Latitude"
            name="latitude"
            defaultValue={retailer?.coordinates.latitude?.toString()}
          />
          <Field
            label="Longitude"
            name="longitude"
            defaultValue={retailer?.coordinates.longitude?.toString()}
          />
        </div>
      </fieldset>

      <fieldset className="mt-4 border border-hairline bg-surface p-5">
        <legend className="meta px-2 text-acid">LINKS</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Menu URL"
            name="menuUrl"
            defaultValue={retailer?.menuUrl}
            placeholder="https://…"
            hint="Drives SHOP STORE. Leave blank if there's no real menu — a dead link is worse than no button."
          />
          <Field label="Website" name="website" defaultValue={retailer?.website} placeholder="https://…" />
          <Field label="Phone" name="phone" defaultValue={retailer?.phone} placeholder="7185555555" />
          <Field label="Instagram" name="instagram" defaultValue={retailer?.instagram} placeholder="@handle" />
        </div>
      </fieldset>

      <fieldset className="mt-4 border border-hairline bg-surface p-5">
        <legend className="meta px-2 text-acid">VERIFICATION</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Last verified"
            name="lastVerified"
            type="date"
            defaultValue={retailer?.lastVerified ?? new Date().toISOString().slice(0, 10)}
          />

          <div>
            <label htmlFor="verificationConfidence" className="meta text-muted">
              Confidence
            </label>
            <select
              id="verificationConfidence"
              name="verificationConfidence"
              defaultValue={retailer?.verification?.confidence ?? 'medium'}
              className={inputClass}
            >
              <option value="high">High — confirmed stocking</option>
              <option value="medium">Medium — strong signal</option>
              <option value="low">Low — unconfirmed</option>
            </select>
          </div>

          <Field
            label="How was this verified?"
            name="verificationSource"
            defaultValue={retailer?.verification?.source}
            placeholder="Retailer menu lists SLAPPZ"
          />
          <Field
            label="Evidence URL"
            name="verificationUrl"
            defaultValue={retailer?.verification?.url}
            placeholder="https://…"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="availableProducts" className="meta text-muted">
            Confirmed products
          </label>
          <input
            id="availableProducts"
            name="availableProducts"
            defaultValue={retailer?.availableProducts?.join(', ')}
            placeholder={products.map((p) => p.slug).join(', ')}
            className={inputClass}
          />
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            Comma-separated product slugs. Only list what has actually been confirmed at this
            store — an empty field means &ldquo;unverified&rdquo;, and the site renders nothing
            rather than implying stock. Known slugs:{' '}
            <span className="text-paper">{products.map((p) => p.slug).join(' · ')}</span>
          </p>
        </div>

        <div className="mt-4">
          <label htmlFor="notes" className="meta text-muted">
            Internal notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            defaultValue={retailer?.notes}
            className="mt-1.5 w-full border border-hairline-strong bg-ink px-3 py-2.5 text-[13px] text-paper placeholder:text-muted focus:border-acid focus:outline-none"
            placeholder="Never shown on the consumer site."
          />
        </div>
      </fieldset>

      <fieldset className="mt-4 border border-hairline bg-surface p-5">
        <legend className="meta px-2 text-acid">STATUS</legend>
        <div className="flex flex-wrap gap-6">
          <label className="meta flex items-center gap-2.5 text-paper">
            <input
              type="checkbox"
              name="active"
              defaultChecked={retailer?.active ?? true}
              className="size-4 accent-[#96e60b]"
            />
            ACTIVE — SHOW ON SITE
          </label>
          <label className="meta flex items-center gap-2.5 text-paper">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={retailer?.featured ?? false}
              className="size-4 accent-[#6e2bd9]"
            />
            FEATURED
          </label>
        </div>
      </fieldset>

      {state && (
        <p
          role="status"
          className={`meta mt-4 border p-4 ${
            state.ok ? 'border-acid text-acid' : 'border-magenta text-magenta'
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={pending}
          className="display block-press block-shadow-sm bg-acid px-6 py-3.5 text-[16px] text-ink disabled:opacity-60"
        >
          {pending ? 'SAVING…' : 'SAVE RETAILER'}
        </button>
        <Link href="/admin/locations"
          className="meta flex items-center border border-hairline-strong px-5 text-paper transition-colors hover:border-acid hover:text-acid"
        >
          CANCEL
        </Link>
      </div>
    </form>
  );
}
