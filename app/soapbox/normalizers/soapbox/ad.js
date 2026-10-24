import { Map as ImmutableMap, Record as ImmutableRecord, fromJS } from 'immutable';
import { CardRecord, normalizeCard } from '../card';
export const AdRecord = ImmutableRecord({
  card: CardRecord(),
  impression: undefined
});

/** Normalizes an ad from Soapbox Config. */
export const normalizeAd = ad => {
  const map = ImmutableMap(fromJS(ad));
  const card = normalizeCard(map.get('card'));
  return AdRecord(map.set('card', card));
};