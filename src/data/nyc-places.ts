/**
 * Local geocoding table for the SLAPPZ service area.
 *
 * Why this exists: the overwhelming majority of searches will be a NYC ZIP or a neighborhood
 * name typed on a phone inside the Instagram browser. Resolving those locally makes the
 * common case instant and network-free, and keeps us off a third-party geocoder's rate limit.
 * Anything not found here falls through to Nominatim in `src/lib/geocode.ts`.
 *
 * Centroids are approximate ZIP/neighborhood centers — accurate enough to sort retailers by
 * distance, which is all they're used for. Precise addresses go to the remote geocoder.
 */

export type PlaceEntry = {
  lat: number;
  lon: number;
  label: string;
  zip?: string;
};

/** NYC + near-NYC ZIP centroids, focused on the boroughs SLAPPZ actually serves. */
export const zipCentroids: Record<string, PlaceEntry> = {
  // ---- Queens ----
  '11101': { lat: 40.7505, lon: -73.94, label: 'Long Island City, Queens, NY' },
  '11102': { lat: 40.7723, lon: -73.9251, label: 'Astoria, Queens, NY' },
  '11103': { lat: 40.7629, lon: -73.9137, label: 'Astoria, Queens, NY' },
  '11104': { lat: 40.7443, lon: -73.9199, label: 'Sunnyside, Queens, NY' },
  '11105': { lat: 40.7791, lon: -73.9067, label: 'Astoria, Queens, NY' },
  '11106': { lat: 40.7616, lon: -73.9319, label: 'Astoria, Queens, NY' },
  '11354': { lat: 40.7681, lon: -73.8278, label: 'Flushing, Queens, NY' },
  '11355': { lat: 40.7509, lon: -73.8206, label: 'Flushing, Queens, NY' },
  '11356': { lat: 40.785, lon: -73.8419, label: 'College Point, Queens, NY' },
  '11357': { lat: 40.7856, lon: -73.8107, label: 'Whitestone, Queens, NY' },
  '11358': { lat: 40.7605, lon: -73.7962, label: 'Flushing, Queens, NY' },
  '11360': { lat: 40.7822, lon: -73.7803, label: 'Bayside, Queens, NY' },
  '11361': { lat: 40.764, lon: -73.7723, label: 'Bayside, Queens, NY' },
  '11362': { lat: 40.7576, lon: -73.7357, label: 'Little Neck, Queens, NY' },
  '11363': { lat: 40.7716, lon: -73.7458, label: 'Little Neck, Queens, NY' },
  '11364': { lat: 40.7455, lon: -73.7595, label: 'Oakland Gardens, Queens, NY' },
  '11365': { lat: 40.7395, lon: -73.7938, label: 'Fresh Meadows, Queens, NY' },
  '11366': { lat: 40.7276, lon: -73.7906, label: 'Fresh Meadows, Queens, NY' },
  '11367': { lat: 40.7288, lon: -73.8213, label: 'Kew Gardens Hills, Queens, NY' },
  '11368': { lat: 40.7498, lon: -73.8523, label: 'Corona, Queens, NY' },
  '11369': { lat: 40.7626, lon: -73.8726, label: 'East Elmhurst, Queens, NY' },
  '11370': { lat: 40.7647, lon: -73.8894, label: 'Jackson Heights, Queens, NY' },
  '11372': { lat: 40.7515, lon: -73.8834, label: 'Jackson Heights, Queens, NY' },
  '11373': { lat: 40.7379, lon: -73.8785, label: 'Elmhurst, Queens, NY' },
  '11374': { lat: 40.7264, lon: -73.8618, label: 'Rego Park, Queens, NY' },
  '11375': { lat: 40.7211, lon: -73.8458, label: 'Forest Hills, Queens, NY' },
  '11377': { lat: 40.7446, lon: -73.9053, label: 'Woodside, Queens, NY' },
  '11378': { lat: 40.7248, lon: -73.9088, label: 'Maspeth, Queens, NY' },
  '11379': { lat: 40.7169, lon: -73.8797, label: 'Middle Village, Queens, NY' },
  '11385': { lat: 40.7015, lon: -73.8886, label: 'Ridgewood, Queens, NY' },
  '11411': { lat: 40.6946, lon: -73.7358, label: 'Cambria Heights, Queens, NY' },
  '11412': { lat: 40.6982, lon: -73.7583, label: 'St. Albans, Queens, NY' },
  '11413': { lat: 40.6676, lon: -73.7504, label: 'Springfield Gardens, Queens, NY' },
  '11414': { lat: 40.6579, lon: -73.8434, label: 'Howard Beach, Queens, NY' },
  '11415': { lat: 40.7073, lon: -73.8296, label: 'Kew Gardens, Queens, NY' },
  '11416': { lat: 40.684, lon: -73.8515, label: 'Ozone Park, Queens, NY' },
  '11417': { lat: 40.6754, lon: -73.8443, label: 'Ozone Park, Queens, NY' },
  '11418': { lat: 40.7002, lon: -73.8352, label: 'Richmond Hill, Queens, NY' },
  '11419': { lat: 40.6889, lon: -73.8228, label: 'South Richmond Hill, Queens, NY' },
  '11420': { lat: 40.6742, lon: -73.8176, label: 'South Ozone Park, Queens, NY' },
  '11421': { lat: 40.6923, lon: -73.8592, label: 'Woodhaven, Queens, NY' },
  '11422': { lat: 40.6588, lon: -73.7343, label: 'Rosedale, Queens, NY' },
  '11423': { lat: 40.7152, lon: -73.7679, label: 'Hollis, Queens, NY' },
  '11426': { lat: 40.7355, lon: -73.7226, label: 'Bellerose, Queens, NY' },
  '11427': { lat: 40.7292, lon: -73.7469, label: 'Queens Village, NY' },
  '11428': { lat: 40.7211, lon: -73.7431, label: 'Queens Village, NY' },
  '11429': { lat: 40.7099, lon: -73.7383, label: 'Queens Village, NY' },
  '11432': { lat: 40.7145, lon: -73.7927, label: 'Jamaica, Queens, NY' },
  '11433': { lat: 40.6981, lon: -73.7873, label: 'Jamaica, Queens, NY' },
  '11434': { lat: 40.6767, lon: -73.7756, label: 'Jamaica, Queens, NY' },
  '11435': { lat: 40.7015, lon: -73.8093, label: 'Jamaica, Queens, NY' },
  '11436': { lat: 40.6767, lon: -73.7967, label: 'South Jamaica, Queens, NY' },
  '11691': { lat: 40.6018, lon: -73.7574, label: 'Far Rockaway, Queens, NY' },
  '11692': { lat: 40.5925, lon: -73.7924, label: 'Arverne, Queens, NY' },
  '11693': { lat: 40.5915, lon: -73.8145, label: 'Rockaway Beach, Queens, NY' },
  '11694': { lat: 40.5766, lon: -73.8452, label: 'Rockaway Park, Queens, NY' },

  // ---- Manhattan ----
  '10001': { lat: 40.7506, lon: -73.9971, label: 'Chelsea, Manhattan, NY' },
  '10002': { lat: 40.7157, lon: -73.9868, label: 'Lower East Side, Manhattan, NY' },
  '10003': { lat: 40.7318, lon: -73.9891, label: 'East Village, Manhattan, NY' },
  '10009': { lat: 40.7264, lon: -73.9787, label: 'East Village, Manhattan, NY' },
  '10010': { lat: 40.7392, lon: -73.9825, label: 'Gramercy, Manhattan, NY' },
  '10011': { lat: 40.7419, lon: -74.0005, label: 'Chelsea, Manhattan, NY' },
  '10012': { lat: 40.7255, lon: -73.9983, label: 'SoHo, Manhattan, NY' },
  '10013': { lat: 40.7205, lon: -74.0052, label: 'Tribeca, Manhattan, NY' },
  '10014': { lat: 40.734, lon: -74.0064, label: 'West Village, Manhattan, NY' },
  '10016': { lat: 40.7452, lon: -73.9782, label: 'Murray Hill, Manhattan, NY' },
  '10017': { lat: 40.7522, lon: -73.9725, label: 'Midtown East, Manhattan, NY' },
  '10018': { lat: 40.7549, lon: -73.9925, label: 'Midtown, Manhattan, NY' },
  '10019': { lat: 40.7657, lon: -73.9873, label: 'Midtown West, Manhattan, NY' },
  '10021': { lat: 40.7695, lon: -73.9587, label: 'Upper East Side, Manhattan, NY' },
  '10022': { lat: 40.7585, lon: -73.9679, label: 'Midtown East, Manhattan, NY' },
  '10023': { lat: 40.7757, lon: -73.9825, label: 'Upper West Side, Manhattan, NY' },
  '10024': { lat: 40.7864, lon: -73.9764, label: 'Upper West Side, Manhattan, NY' },
  '10025': { lat: 40.7986, lon: -73.9662, label: 'Upper West Side, Manhattan, NY' },
  '10026': { lat: 40.8027, lon: -73.9527, label: 'Harlem, Manhattan, NY' },
  '10027': { lat: 40.8115, lon: -73.9534, label: 'Harlem, Manhattan, NY' },
  '10029': { lat: 40.7918, lon: -73.9436, label: 'East Harlem, Manhattan, NY' },
  '10030': { lat: 40.8182, lon: -73.9427, label: 'Harlem, Manhattan, NY' },
  '10031': { lat: 40.8253, lon: -73.9501, label: 'Hamilton Heights, Manhattan, NY' },
  '10032': { lat: 40.8387, lon: -73.9425, label: 'Washington Heights, Manhattan, NY' },
  '10033': { lat: 40.8501, lon: -73.9337, label: 'Washington Heights, Manhattan, NY' },
  '10034': { lat: 40.8671, lon: -73.9195, label: 'Inwood, Manhattan, NY' },
  '10036': { lat: 40.7593, lon: -73.9897, label: 'Times Square, Manhattan, NY' },
  '10038': { lat: 40.7092, lon: -74.0027, label: 'Financial District, Manhattan, NY' },

  // ---- Brooklyn ----
  '11201': { lat: 40.6935, lon: -73.9899, label: 'Brooklyn Heights, Brooklyn, NY' },
  '11205': { lat: 40.6942, lon: -73.9662, label: 'Clinton Hill, Brooklyn, NY' },
  '11206': { lat: 40.7018, lon: -73.9425, label: 'Bushwick, Brooklyn, NY' },
  '11207': { lat: 40.6707, lon: -73.8944, label: 'East New York, Brooklyn, NY' },
  '11208': { lat: 40.6756, lon: -73.8721, label: 'Cypress Hills, Brooklyn, NY' },
  '11211': { lat: 40.7127, lon: -73.9535, label: 'Williamsburg, Brooklyn, NY' },
  '11215': { lat: 40.6668, lon: -73.9856, label: 'Park Slope, Brooklyn, NY' },
  '11216': { lat: 40.6809, lon: -73.9494, label: 'Bedford-Stuyvesant, Brooklyn, NY' },
  '11217': { lat: 40.6821, lon: -73.9794, label: 'Boerum Hill, Brooklyn, NY' },
  '11218': { lat: 40.6434, lon: -73.9757, label: 'Kensington, Brooklyn, NY' },
  '11219': { lat: 40.6327, lon: -73.9966, label: 'Borough Park, Brooklyn, NY' },
  '11220': { lat: 40.6414, lon: -74.0135, label: 'Sunset Park, Brooklyn, NY' },
  '11221': { lat: 40.6913, lon: -73.9276, label: 'Bushwick, Brooklyn, NY' },
  '11222': { lat: 40.7273, lon: -73.9483, label: 'Greenpoint, Brooklyn, NY' },
  '11223': { lat: 40.5977, lon: -73.973, label: 'Gravesend, Brooklyn, NY' },
  '11224': { lat: 40.5766, lon: -73.9885, label: 'Coney Island, Brooklyn, NY' },
  '11225': { lat: 40.6626, lon: -73.9541, label: 'Crown Heights, Brooklyn, NY' },
  '11226': { lat: 40.6464, lon: -73.9569, label: 'Flatbush, Brooklyn, NY' },
  '11229': { lat: 40.6003, lon: -73.9445, label: 'Sheepshead Bay, Brooklyn, NY' },
  '11230': { lat: 40.6222, lon: -73.9656, label: 'Midwood, Brooklyn, NY' },
  '11231': { lat: 40.6779, lon: -74.0045, label: 'Red Hook, Brooklyn, NY' },
  '11233': { lat: 40.6784, lon: -73.9206, label: 'Bedford-Stuyvesant, Brooklyn, NY' },
  '11234': { lat: 40.6207, lon: -73.9207, label: 'Marine Park, Brooklyn, NY' },
  '11235': { lat: 40.5834, lon: -73.9578, label: 'Brighton Beach, Brooklyn, NY' },
  '11236': { lat: 40.6403, lon: -73.9004, label: 'Canarsie, Brooklyn, NY' },
  '11237': { lat: 40.7043, lon: -73.9209, label: 'Bushwick, Brooklyn, NY' },
  '11238': { lat: 40.6798, lon: -73.9638, label: 'Prospect Heights, Brooklyn, NY' },

  // ---- Bronx ----
  '10451': { lat: 40.8202, lon: -73.9236, label: 'South Bronx, Bronx, NY' },
  '10452': { lat: 40.8378, lon: -73.9224, label: 'Highbridge, Bronx, NY' },
  '10453': { lat: 40.8524, lon: -73.9128, label: 'Morris Heights, Bronx, NY' },
  '10456': { lat: 40.8302, lon: -73.9086, label: 'Morrisania, Bronx, NY' },
  '10457': { lat: 40.8471, lon: -73.8995, label: 'Tremont, Bronx, NY' },
  '10458': { lat: 40.8624, lon: -73.8894, label: 'Fordham, Bronx, NY' },
  '10461': { lat: 40.8471, lon: -73.8404, label: 'Pelham Bay, Bronx, NY' },
  '10462': { lat: 40.8433, lon: -73.8601, label: 'Parkchester, Bronx, NY' },
  '10463': { lat: 40.8807, lon: -73.9065, label: 'Riverdale, Bronx, NY' },
  '10467': { lat: 40.8747, lon: -73.8703, label: 'Norwood, Bronx, NY' },
  '10468': { lat: 40.8686, lon: -73.9004, label: 'University Heights, Bronx, NY' },
  '10469': { lat: 40.8697, lon: -73.848, label: 'Baychester, Bronx, NY' },
  '10473': { lat: 40.8185, lon: -73.8583, label: 'Soundview, Bronx, NY' },

  // ---- Staten Island ----
  '10301': { lat: 40.6323, lon: -74.0938, label: 'St. George, Staten Island, NY' },
  '10304': { lat: 40.6098, lon: -74.0838, label: 'Stapleton, Staten Island, NY' },
  '10306': { lat: 40.5698, lon: -74.1183, label: 'New Dorp, Staten Island, NY' },
  '10314': { lat: 40.6018, lon: -74.1646, label: 'Bulls Head, Staten Island, NY' },
};

/**
 * Neighborhood / borough / landmark aliases. Keys are normalized (lowercase, alphanumeric
 * and spaces only) so "Bed-Stuy", "bed stuy" and "BED STUY" all hit the same entry.
 */
export const placeAliases: Record<string, PlaceEntry> = {
  'new york': { lat: 40.7128, lon: -74.006, label: 'New York, NY' },
  nyc: { lat: 40.7128, lon: -74.006, label: 'New York, NY' },
  'new york city': { lat: 40.7128, lon: -74.006, label: 'New York, NY' },
  manhattan: { lat: 40.7831, lon: -73.9712, label: 'Manhattan, NY' },
  queens: { lat: 40.7282, lon: -73.7949, label: 'Queens, NY' },
  brooklyn: { lat: 40.6782, lon: -73.9442, label: 'Brooklyn, NY' },
  bronx: { lat: 40.8448, lon: -73.8648, label: 'The Bronx, NY' },
  'the bronx': { lat: 40.8448, lon: -73.8648, label: 'The Bronx, NY' },
  'staten island': { lat: 40.5795, lon: -74.1502, label: 'Staten Island, NY' },
  'long island city': { lat: 40.7447, lon: -73.9485, label: 'Long Island City, Queens, NY', zip: '11101' },
  lic: { lat: 40.7447, lon: -73.9485, label: 'Long Island City, Queens, NY', zip: '11101' },
  astoria: { lat: 40.7644, lon: -73.9235, label: 'Astoria, Queens, NY', zip: '11106' },
  flushing: { lat: 40.7681, lon: -73.8278, label: 'Flushing, Queens, NY', zip: '11354' },
  whitestone: { lat: 40.7856, lon: -73.8107, label: 'Whitestone, Queens, NY', zip: '11357' },
  woodside: { lat: 40.7446, lon: -73.9053, label: 'Woodside, Queens, NY', zip: '11377' },
  sunnyside: { lat: 40.7443, lon: -73.9199, label: 'Sunnyside, Queens, NY', zip: '11104' },
  elmhurst: { lat: 40.7379, lon: -73.8785, label: 'Elmhurst, Queens, NY', zip: '11373' },
  corona: { lat: 40.7498, lon: -73.8523, label: 'Corona, Queens, NY', zip: '11368' },
  'jackson heights': { lat: 40.7515, lon: -73.8834, label: 'Jackson Heights, Queens, NY', zip: '11372' },
  'rego park': { lat: 40.7264, lon: -73.8618, label: 'Rego Park, Queens, NY', zip: '11374' },
  'forest hills': { lat: 40.7211, lon: -73.8458, label: 'Forest Hills, Queens, NY', zip: '11375' },
  'ozone park': { lat: 40.6754, lon: -73.8443, label: 'Ozone Park, Queens, NY', zip: '11417' },
  'howard beach': { lat: 40.6579, lon: -73.8434, label: 'Howard Beach, Queens, NY', zip: '11414' },
  jamaica: { lat: 40.7015, lon: -73.8093, label: 'Jamaica, Queens, NY', zip: '11435' },
  ridgewood: { lat: 40.7015, lon: -73.8886, label: 'Ridgewood, Queens, NY', zip: '11385' },
  maspeth: { lat: 40.7248, lon: -73.9088, label: 'Maspeth, Queens, NY', zip: '11378' },
  bayside: { lat: 40.764, lon: -73.7723, label: 'Bayside, Queens, NY', zip: '11361' },
  'richmond hill': { lat: 40.7002, lon: -73.8352, label: 'Richmond Hill, Queens, NY', zip: '11418' },
  'college point': { lat: 40.785, lon: -73.8419, label: 'College Point, Queens, NY', zip: '11356' },
  rockaway: { lat: 40.5915, lon: -73.8145, label: 'Rockaway Beach, Queens, NY', zip: '11693' },
  'far rockaway': { lat: 40.6018, lon: -73.7574, label: 'Far Rockaway, Queens, NY', zip: '11691' },
  midtown: { lat: 40.7549, lon: -73.9840, label: 'Midtown, Manhattan, NY', zip: '10018' },
  'times square': { lat: 40.7593, lon: -73.9897, label: 'Times Square, Manhattan, NY', zip: '10036' },
  harlem: { lat: 40.8115, lon: -73.9534, label: 'Harlem, Manhattan, NY', zip: '10027' },
  soho: { lat: 40.7255, lon: -73.9983, label: 'SoHo, Manhattan, NY', zip: '10012' },
  tribeca: { lat: 40.7205, lon: -74.0052, label: 'Tribeca, Manhattan, NY', zip: '10013' },
  chelsea: { lat: 40.7465, lon: -73.9989, label: 'Chelsea, Manhattan, NY', zip: '10011' },
  'east village': { lat: 40.7264, lon: -73.9818, label: 'East Village, Manhattan, NY', zip: '10009' },
  'west village': { lat: 40.734, lon: -74.0064, label: 'West Village, Manhattan, NY', zip: '10014' },
  'lower east side': { lat: 40.7157, lon: -73.9868, label: 'Lower East Side, Manhattan, NY', zip: '10002' },
  les: { lat: 40.7157, lon: -73.9868, label: 'Lower East Side, Manhattan, NY', zip: '10002' },
  'upper east side': { lat: 40.7736, lon: -73.9566, label: 'Upper East Side, Manhattan, NY', zip: '10021' },
  'upper west side': { lat: 40.787, lon: -73.9754, label: 'Upper West Side, Manhattan, NY', zip: '10024' },
  williamsburg: { lat: 40.7127, lon: -73.9535, label: 'Williamsburg, Brooklyn, NY', zip: '11211' },
  bushwick: { lat: 40.7043, lon: -73.9209, label: 'Bushwick, Brooklyn, NY', zip: '11237' },
  greenpoint: { lat: 40.7273, lon: -73.9483, label: 'Greenpoint, Brooklyn, NY', zip: '11222' },
  'park slope': { lat: 40.6668, lon: -73.9856, label: 'Park Slope, Brooklyn, NY', zip: '11215' },
  'bedford stuyvesant': { lat: 40.6809, lon: -73.9494, label: 'Bedford-Stuyvesant, Brooklyn, NY', zip: '11216' },
  'bed stuy': { lat: 40.6809, lon: -73.9494, label: 'Bedford-Stuyvesant, Brooklyn, NY', zip: '11216' },
  'crown heights': { lat: 40.6626, lon: -73.9541, label: 'Crown Heights, Brooklyn, NY', zip: '11225' },
  flatbush: { lat: 40.6464, lon: -73.9569, label: 'Flatbush, Brooklyn, NY', zip: '11226' },
  'coney island': { lat: 40.5766, lon: -73.9885, label: 'Coney Island, Brooklyn, NY', zip: '11224' },
  'sheepshead bay': { lat: 40.6003, lon: -73.9445, label: 'Sheepshead Bay, Brooklyn, NY', zip: '11229' },
  'brooklyn heights': { lat: 40.6935, lon: -73.9899, label: 'Brooklyn Heights, Brooklyn, NY', zip: '11201' },
  'east new york': { lat: 40.6707, lon: -73.8944, label: 'East New York, Brooklyn, NY', zip: '11207' },
};

/** Normalize free text for alias lookup: lowercase, strip punctuation, collapse whitespace. */
export function normalizePlace(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
