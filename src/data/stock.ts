// Stock-footage slots. Each slot is one clean footage shot in the timeline.
// `candidates` are real individual clip pages surfaced by web search on
// 2026-10-14; their content and licence were NOT inspected from this
// environment (pexels.com / pixabay.com are blocked by its egress policy).
// `query` drives scripts/fetch-stock.mjs when no candidate is set.

export type StockSlotDef = {
  slot: string;
  desc: string;
  query: string;
  source: 'pexels' | 'pixabay';
  candidates: {url: string; creator?: string; note?: string}[];
  grade?: 'neutral' | 'cool' | 'warm' | 'night';
  move?: 'in' | 'out' | 'left' | 'right' | 'none';
};

export const STOCK: StockSlotDef[] = [
  {slot: 'S-001', desc: 'Indian city at night from the air; lights, traffic, a sense of a city awake', query: 'hyderabad city aerial night', source: 'pexels', candidates: [{url: 'https://www.pexels.com/video/an-aerial-view-of-the-city-of-hyderabad-20317231/', creator: 'Adithya Kashyap', note: 'Daylight unknown — check; grade night if usable'}], grade: 'night'},
  {slot: 'S-002', desc: 'Indian parents at home reading a phone with concern', query: 'indian parents looking at phone worried', source: 'pexels', candidates: [], grade: 'warm'},
  {slot: 'S-003', desc: 'Close-up of a thumb scrolling messages on a phone in low light', query: 'scrolling phone close up night', source: 'pexels', candidates: [{url: 'https://www.pexels.com/video/people-using-smartphone-8088611/', note: 'Group on phones; check framing'}], grade: 'cool'},
  {slot: 'S-004', desc: 'Glass corporate office tower exterior, slow tilt up', query: 'corporate office building exterior', source: 'pixabay', candidates: [], grade: 'cool', move: 'out'},
  {slot: 'S-005', desc: 'Person reading news on a tablet or newspaper', query: 'reading news tablet', source: 'pexels', candidates: [], grade: 'neutral'},
  {slot: 'S-006', desc: 'Technology professional working on a laptop in an office, late', query: 'man working laptop office night', source: 'pexels', candidates: [{url: 'https://www.pexels.com/video/a-man-working-on-a-laptop-inside-the-office-3140468/', creator: 'Pressmaster', note: '4K, 19 s per search index'}], grade: 'cool'},
  {slot: 'S-007', desc: 'Hands reviewing and signing employment paperwork', query: 'signing documents office', source: 'pexels', candidates: [], grade: 'neutral'},
  {slot: 'S-008', desc: 'Empty office corridor or closed glass door', query: 'empty office corridor', source: 'pixabay', candidates: [], grade: 'cool', move: 'none'},
  {slot: 'S-009', desc: 'Hyderabad landmark from the air (Charminar)', query: 'charminar aerial', source: 'pexels', candidates: [{url: 'https://www.pexels.com/video/aerial-drone-view-of-charminar-hyderabad-29719767/', creator: 'Santhosh Peddi'}], grade: 'warm'},
  {slot: 'S-010', desc: 'Middle-class Indian family at home together', query: 'indian family home', source: 'pexels', candidates: [], grade: 'warm'},
  {slot: 'S-011', desc: 'Engineering students on an Indian college campus', query: 'indian college students campus', source: 'pexels', candidates: [], grade: 'warm'},
  {slot: 'S-012', desc: 'Family at a table with papers and a calculator, discussing money', query: 'family finances paperwork calculator', source: 'pexels', candidates: [], grade: 'warm'},
  {slot: 'S-013', desc: 'Airport departure: student with luggage saying goodbye to parents', query: 'airport goodbye family luggage', source: 'pexels', candidates: [], grade: 'neutral'},
  {slot: 'S-014', desc: 'U.S. university campus with students walking', query: 'college campus students walking', source: 'pixabay', candidates: [], grade: 'neutral'},
  {slot: 'S-015', desc: 'Graduates throwing caps', query: 'graduates throwing caps', source: 'pexels', candidates: [{url: 'https://www.pexels.com/video/graduates-throwing-their-graduation-caps-7945128/'}, {url: 'https://www.pexels.com/video/friends-throwing-their-graduation-cap-in-the-air-7712349/'}], grade: 'neutral'},
  {slot: 'S-016', desc: 'Aerial over a U.S. suburban housing development', query: 'aerial suburban houses', source: 'pexels', candidates: [{url: 'https://www.pexels.com/video/aerial-view-of-modern-suburban-houses-34823847/', creator: 'Nilzo Farías'}], grade: 'neutral', move: 'right'},
  {slot: 'S-017', desc: 'Older Indian parents sitting quietly at home', query: 'elderly indian couple home', source: 'pexels', candidates: [], grade: 'warm'},
  {slot: 'S-018', desc: 'Crowd of commuters walking, overhead or long lens', query: 'crowd walking city overhead', source: 'pixabay', candidates: [], grade: 'cool'},
  {slot: 'S-019', desc: 'Person packing a suitcase in an apartment', query: 'packing suitcase', source: 'pexels', candidates: [], grade: 'cool'},
  {slot: 'S-020', desc: 'Young family with children at home in the U.S.', query: 'family children home evening', source: 'pexels', candidates: [], grade: 'warm'},
  {slot: 'S-021', desc: 'Near-empty airport terminal', query: 'empty airport terminal', source: 'pixabay', candidates: [], grade: 'cool', move: 'none'},
  {slot: 'S-022', desc: 'Wide-body airliner at a gate or taking off at dusk', query: 'airplane takeoff sunset', source: 'pixabay', candidates: [], grade: 'night'},
  {slot: 'S-023', desc: 'Close-up of a pen signing a document', query: 'pen signing document close up', source: 'pexels', candidates: [], grade: 'neutral'},
  {slot: 'S-024', desc: 'Hyderabad IT district office towers', query: 'hyderabad hitech city', source: 'pexels', candidates: [], grade: 'neutral', move: 'out'},
  {slot: 'S-025', desc: 'Traveller with suitcase walking through arrivals', query: 'man suitcase airport walking', source: 'pexels', candidates: [], grade: 'neutral'},
  {slot: 'S-026', desc: 'Moving boxes being packed and taped', query: 'packing moving boxes', source: 'pexels', candidates: [], grade: 'warm'},
  {slot: 'S-027', desc: 'Quiet U.S. suburban street with houses', query: 'aerial suburban neighborhood summer', source: 'pexels', candidates: [{url: 'https://www.pexels.com/video/aerial-view-of-suburban-neighborhood-in-summer-38105822/'}], grade: 'neutral', move: 'left'},
  {slot: 'S-028', desc: 'A man looking worried, close-up', query: 'man looking worried close up', source: 'pexels', candidates: [{url: 'https://www.pexels.com/video/close-up-view-of-a-man-looking-worried-7534959/'}], grade: 'cool'},
  {slot: 'S-029', desc: 'University building exterior at dusk', query: 'university building dusk', source: 'pixabay', candidates: [], grade: 'night'},
  {slot: 'S-030', desc: 'Police lights at night, out of focus', query: 'police lights night bokeh', source: 'pexels', candidates: [], grade: 'night', move: 'none'},
  {slot: 'S-031', desc: 'Student studying on a laptop at night', query: 'student laptop night dark room', source: 'pexels', candidates: [{url: 'https://www.pexels.com/video/guy-sitting-in-dark-room-working-on-his-laptop-20563164/', creator: 'Onkar Mehta'}], grade: 'cool'},
  {slot: 'S-032', desc: 'Indian family together, calm and hopeful', query: 'happy indian family', source: 'pexels', candidates: [], grade: 'warm'},
  {slot: 'S-033', desc: 'Wide multi-lane highway from the air', query: 'aerial highway traffic', source: 'pexels', candidates: [{url: 'https://www.pexels.com/video/aerial-footage-of-traffic-on-a-highway-road-12306893/'}], grade: 'cool', move: 'in'},
  {slot: 'S-034', desc: 'Traffic crossing a bridge', query: 'bridge traffic aerial', source: 'pexels', candidates: [{url: 'https://www.pexels.com/video/time-lapse-of-heavy-traffic-on-a-bridge-16433717/', creator: 'Alexey Chudin'}], grade: 'cool'},
  {slot: 'S-035', desc: 'Archive shelves of file folders and documents', query: 'archive files folders shelves', source: 'pexels', candidates: [], grade: 'cool', move: 'right'},
  {slot: 'S-036', desc: 'People waiting in a long line', query: 'people waiting in line queue', source: 'pixabay', candidates: [], grade: 'cool'},
  {slot: 'S-037', desc: 'Rain on a window at dusk, out-of-focus street lights', query: 'rain window night', source: 'pexels', candidates: [], grade: 'night', move: 'none'},
  {slot: 'S-038', desc: 'U.S. Capitol or White House exterior, wide', query: 'white house washington dc', source: 'pixabay', candidates: [], grade: 'cool'},
  {slot: 'S-039', desc: 'Empty lecture hall with rows of seats', query: 'empty lecture hall', source: 'pixabay', candidates: [], grade: 'cool', move: 'in'},
  {slot: 'S-040', desc: 'Airport passport-control area or immigration queue (no identifiable officers needed)', query: 'airport passport control', source: 'pexels', candidates: [], grade: 'cool'},
  {slot: 'S-041', desc: 'Student browsing university websites on a laptop', query: 'student researching laptop university', source: 'pexels', candidates: [], grade: 'neutral'},
  {slot: 'S-042', desc: 'Passport and documents laid on a table', query: 'passport documents table', source: 'pexels', candidates: [], grade: 'warm', move: 'in'},
];

export const stockBySlot = (slot: string) => {
  const s = STOCK.find((x) => x.slot === slot);
  if (!s) throw new Error(`Unknown stock slot ${slot}`);
  return s;
};
