'use client';

import { useEffect, useRef } from 'react';
import maplibregl, { type Map as MapLibreMap, type Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import type { Coordinates, Retailer, RetailerResult } from '@/lib/types';

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
