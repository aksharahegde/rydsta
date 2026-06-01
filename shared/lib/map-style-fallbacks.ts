import type { Map as MaplibreMap } from 'maplibre-gl'

/** 1×1 transparent RGBA — satisfies fill/line patterns without visible artifacts. */
const TRANSPARENT_1X1 = new Uint8Array(4)

/**
 * OpenFreeMap Liberty references sprites that are not always present in the
 * hosted sheet (road_*, pedestrian_polygon, POI icons). Register placeholders so
 * MapLibre does not spam the console on every missing id.
 */
export function bindMapStyleFallbacks(map: MaplibreMap): void {
  map.on('styleimagemissing', (event) => {
    if (map.hasImage(event.id)) return
    map.addImage(event.id, {
      width: 1,
      height: 1,
      data: TRANSPARENT_1X1,
    })
  })
}

/**
 * Liberty's 3D buildings use render_height / render_min_height from vector tiles;
 * many features omit them (null), which triggers MapLibre type warnings. Trip
 * maps are flat (maxPitch 0) so hide the layer entirely.
 */
export function patchLibertyStyleGaps(map: MaplibreMap): void {
  if (!map.getLayer('building-3d')) return
  map.setLayoutProperty('building-3d', 'visibility', 'none')
}
