'use client';

import { useEffect, useRef } from 'react';
import maplibregl, { type Map as MapLibreMap, type Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import type { Coordinates, Retailer, RetailerResult } from '@/lib/types';
import { directionsUrl, formatDistance, formatPhone } from '@/lib/geo';

/**
 * Branded MapLibre map.
 *
 * Basemap: OpenFreeMap's dark vector style — free, no API key, no rate limit, and licensed
 * for commercial use. It is further desaturated in CSS (`.slappz-map .maplibregl-canvas`) so
 * the acid pins are the only saturated thing on screen. An untreated default basemap is the
 * fastest way to make this look like every other dispensary locator.
 *
 * This replaced CARTO's raster tiles, which SLAPPZ used until CARTO began stamping
 * "API KEY REQUIRED" diagonally across every keyless tile — on a brand site that reads as a
 * broken map. Before swapping this URL for another provider, fetch one tile and LOOK at it:
 * the old endpoint still returns 200 with a perfectly valid PNG, watermark and all.
 *
 * Markers are DOM elements rather than a GL layer: there are only ever a handful of them,
 * DOM markers stay outside the canvas filter, and they can carry real focus and keyboard
 * behaviour, which a GL symbol layer cannot.
 *
 * This component is loaded via next/dynamic with ssr:false — MapLibre is the single large
 * dependency in the project and must never block first paint or the search box.
 */

/**
 * A style URL, not an inline style object: the vector style carries its own glyphs, sprites
 * and 47 layers, and none of them need overriding here — the markers are DOM, not GL.
 */
const BASEMAP_STYLE = 'https://tiles.openfreemap.org/styles/dark';

const NYC_CENTER: [number, number] = [-73.9, 40.73];

function markerElement(label: string, active: boolean): HTMLButtonElement {
  const el = document.createElement('button');
  el.type = 'button';
  el.setAttribute('aria-label', `${label}${active ? ' (selected)' : ''}`);
  el.className = 'slappz-pin';
  el.style.cssText = `
    width:30px;height:30px;padding:0;border:0;background:none;cursor:pointer;
    transition:transform 180ms cubic-bezier(0.2,0,0,1);
    transform:scale(${active ? 1.18 : 1});
  `;
  el.innerHTML = `
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="26" height="26" rx="3" fill="#6e2bd9"/>
      <rect x="1" y="1" width="26" height="26" rx="3"
            fill="${active ? '#96e60b' : '#000000'}" stroke="#96e60b" stroke-width="1.75"/>
      <text x="14" y="20.5" text-anchor="middle" fill="${active ? '#000000' : '#96e60b'}"
            font-size="17" font-weight="900"
            font-family="Archivo, 'Arial Black', sans-serif"
            transform="translate(14 16) skewX(-9) translate(-14 -16)">S</text>
    </svg>`;
  return el;
}

/**
 * Escape before interpolating into the popup's HTML.
 *
 * Retailer records are ours today, but they are editable through /admin and the repository
 * layer exists so they can come from a feed later. Building markup from that data without
 * escaping would make a store name an injection point the day either of those changes.
 */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * The card that opens when a pin is tapped.
 *
 * Built as an HTML string rather than a React portal because MapLibre owns the popup's
 * lifecycle and node — mounting a React tree inside something another library removes is how
 * you get stale roots. It is styled in globals.css under `.slappz-popup`; the default
 * MapLibre bubble is white with a drop shadow and would look like a different website.
 */
function popupHtml(retailer: Retailer | RetailerResult): string {
  const where = [retailer.neighborhood, retailer.borough ?? retailer.address.city]
    .filter(Boolean)
    .join(' · ');
  const distance =
    'distanceMiles' in retailer && typeof retailer.distanceMiles === 'number'
      ? formatDistance(retailer.distanceMiles)
      : null;
  const phone = formatPhone(retailer.phone);

  // Only render an action when the data behind it exists — a dead button is worse than none,
  // which is the same rule menuUrl follows everywhere else in this app.
  const actions = [
    `<a class="slappz-popup__go" href="${esc(directionsUrl(retailer))}" target="_blank" rel="noopener noreferrer">DIRECTIONS</a>`,
    retailer.menuUrl
      ? `<a class="slappz-popup__act" href="${esc(retailer.menuUrl)}" target="_blank" rel="noopener noreferrer">SHOP</a>`
      : '',
    phone ? `<a class="slappz-popup__act" href="tel:${esc(retailer.phone ?? '')}">CALL</a>` : '',
  ]
    .filter(Boolean)
    .join('');

  // The name doubles as the link to the store page. It used to be a separate "FULL DETAILS"
  // row, but height is the binding constraint here: the map is ~364px on desktop and ~323px
  // on a phone, and the card opens above the pin. Every row it loses is a row it no longer
  // has to beg the camera to make room for.
  // Place and distance ride on the kicker rather than taking a row of their own. Four rows is
  // what makes the card fit above a pin in a 364px map without the camera having to help, and
  // the neighbourhood was the one line whose information the address already carried.
  const kicker = [where.toUpperCase(), distance].filter(Boolean).join(' · ');

  return `
    <div class="slappz-popup__body">
      <p class="slappz-popup__kicker">${esc(kicker || 'SLAPPZ HERE')}</p>
      <a class="slappz-popup__name" href="/stores/${esc(retailer.slug)}">${esc(retailer.name)}</a>
      <p class="slappz-popup__addr">${esc(retailer.address.street)}, ${esc(retailer.address.city)} ${esc(retailer.address.zip)}</p>
      <div class="slappz-popup__actions">${actions}</div>
    </div>`;
}

function originElement(): HTMLDivElement {
  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  // Violet, deliberately not acid — "you" must never compete with "SLAPPZ is here".
  el.style.cssText = `
    width:18px;height:18px;border-radius:50%;
    background:#6e2bd9;border:2px solid #fff;
    box-shadow:0 0 0 6px rgba(110,43,217,0.28);
  `;
  return el;
}

export default function MapView({
  retailers,
  origin,
  selectedSlug,
  onSelect,
}: {
  retailers: (Retailer | RetailerResult)[];
  origin: Coordinates | null;
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const markers = useRef(new Map<string, Marker>());
  const originMarker = useRef<Marker | null>(null);
  const popup = useRef<maplibregl.Popup | null>(null);
  const ready = useRef(false);

  // Keep the latest onSelect without re-creating every marker on each parent render.
  // Assigned in an effect rather than during render — a ref write during render can be
  // discarded when React re-renders speculatively.
  const selectRef = useRef(onSelect);
  useEffect(() => {
    selectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!container.current || map.current) return;

    const instance = new maplibregl.Map({
      container: container.current,
      style: BASEMAP_STYLE,
      center: NYC_CENTER,
      zoom: 10,
      attributionControl: { compact: true },
      // The map lives inside a scrolling page on mobile — grabbing the scroll would be hostile.
      scrollZoom: false,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    });

    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    instance.touchZoomRotate.disableRotation();
    instance.on('load', () => {
      ready.current = true;
    });

    // A map that fails silently looks identical to a map that is simply dark. Surface it.
    instance.on('error', (e) => {
      console.error('[slappz:map]', e.error?.message ?? e);
    });

    map.current = instance;

    // Copy the ref containers so cleanup operates on the same Maps this effect set up,
    // even if the refs are reassigned before teardown runs.
    const activeMarkers = markers.current;

    return () => {
      activeMarkers.forEach((m) => m.remove());
      activeMarkers.clear();
      originMarker.current?.remove();
      originMarker.current = null;
      popup.current?.remove();
      popup.current = null;
      instance.remove();
      map.current = null;
      ready.current = false;
    };
  }, []);

  // Sync retailer markers.
  useEffect(() => {
    const instance = map.current;
    if (!instance) return;

    const seen = new Set(retailers.map((r) => r.slug));

    for (const [slug, marker] of markers.current) {
      if (!seen.has(slug)) {
        marker.remove();
        markers.current.delete(slug);
      }
    }

    for (const retailer of retailers) {
      const active = retailer.slug === selectedSlug;

      // MapLibre owns the marker's DOM node, so swapping the element in place is fragile.
      // With a handful of pins, tearing down and rebuilding is simpler and fast enough.
      markers.current.get(retailer.slug)?.remove();
      markers.current.delete(retailer.slug);

      const el = markerElement(retailer.name, active);
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        selectRef.current(retailer.slug);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([retailer.coordinates.longitude, retailer.coordinates.latitude])
        .addTo(instance);

      markers.current.set(retailer.slug, marker);
    }
  }, [retailers, selectedSlug]);

  /**
   * Open the detail card for whatever is selected.
   *
   * Driven by `selectedSlug` rather than wired into the marker's own click handler, so a pin
   * tap and a click on a result card in the list both land here and stay in sync — selection
   * has one owner.
   */
  useEffect(() => {
    const instance = map.current;
    if (!instance) return;

    popup.current?.remove();
    popup.current = null;

    const retailer = retailers.find((r) => r.slug === selectedSlug);
    if (!retailer) return;

    const lngLat: [number, number] = [
      retailer.coordinates.longitude,
      retailer.coordinates.latitude,
    ];

    const card = new maplibregl.Popup({
      offset: 10,
      closeButton: true,
      closeOnClick: false,
      className: 'slappz-popup',
      maxWidth: '272px',
      // No fixed `anchor`. MapLibre already flips the card to whichever side of the pin has
      // room inside the container, which is the whole problem solved by the library. Pinning
      // it to one side and then trying to move the camera to compensate was strictly worse:
      // the card's fit then depended on the camera landing exactly right, and across pins it
      // did not — the same card sat 53px inside the map for one shop and 94px outside it for
      // the next.
    })
      .setLngLat(lngLat)
      .setHTML(popupHtml(retailer))
      .addTo(instance);

    popup.current = card;

    /**
     * Pan if the card still hangs over an edge.
     *
     * MapLibre flips the card to whichever side of the pin has room, which handles most of
     * this — but a pin near the top or bottom of a short map can leave no good side, and it
     * picks its anchor from where the pin is when the card opens, not where the camera is
     * heading. Measuring the rendered card and panning by the real overflow catches the rest,
     * in whichever direction it actually overflowed.
     */
    const nudge = () => {
      const el = card.getElement();
      if (!el || !popup.current) return;
      const mapRect = instance.getContainer().getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      const over = mapRect.top + 8 - rect.top;
      const under = rect.bottom - (mapRect.bottom - 8);
      if (over > 1) instance.panBy([0, -over], { duration: 220 });
      else if (under > 1) instance.panBy([0, under], { duration: 220 });
    };

    instance.once('moveend', nudge);
    // The selection ease is a no-op when the pin is already framed, and then `moveend` never
    // fires — so a card opened on a stationary map would stay clipped without this.
    const settle = window.setTimeout(nudge, 620);

    return () => {
      window.clearTimeout(settle);
      instance.off('moveend', nudge);
      popup.current?.remove();
      popup.current = null;
    };
  }, [retailers, selectedSlug]);

  // Sync the origin marker.
  useEffect(() => {
    const instance = map.current;
    if (!instance) return;

    originMarker.current?.remove();
    originMarker.current = null;

    if (origin) {
      originMarker.current = new maplibregl.Marker({ element: originElement() })
        .setLngLat([origin.longitude, origin.latitude])
        .addTo(instance);
    }
  }, [origin]);

  // Frame the map around whatever is currently relevant.
  useEffect(() => {
    const instance = map.current;
    if (!instance) return;

    const points: Coordinates[] = retailers.map((r) => r.coordinates);
    if (origin) points.push(origin);
    if (points.length === 0) return;

    const fit = () => {
      if (points.length === 1) {
        instance.easeTo({
          center: [points[0].longitude, points[0].latitude],
          zoom: 13,
          duration: 500,
        });
        return;
      }

      const bounds = points.reduce(
        (acc, p) => acc.extend([p.longitude, p.latitude]),
        new maplibregl.LngLatBounds(
          [points[0].longitude, points[0].latitude],
          [points[0].longitude, points[0].latitude],
        ),
      );

      instance.fitBounds(bounds, {
        padding: { top: 56, bottom: 56, left: 40, right: 40 },
        maxZoom: 14,
        duration: 500,
      });
    };

    if (ready.current) fit();
    else instance.once('load', fit);
  }, [retailers, origin]);

  // Ease to a retailer when it is selected from the list.
  useEffect(() => {
    const instance = map.current;
    if (!instance || !selectedSlug) return;

    const target = retailers.find((r) => r.slug === selectedSlug);
    if (!target) return;

    // Centre and zoom only. Framing the card is the popup's job now — see the anchor note
    // in the popup effect.
    instance.easeTo({
      center: [target.coordinates.longitude, target.coordinates.latitude],
      zoom: Math.max(instance.getZoom(), 13),
      duration: 450,
    });
  }, [selectedSlug, retailers]);

  return (
    <div
      ref={container}
      className="slappz-map h-full w-full bg-surface"
      role="application"
      aria-label="Map of dispensaries carrying SLAPPZ"
    />
  );
}
