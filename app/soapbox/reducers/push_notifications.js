import { Map as ImmutableMap, Record as ImmutableRecord } from 'immutable';
import { SET_BROWSER_SUPPORT, SET_SUBSCRIPTION, CLEAR_SUBSCRIPTION, SET_ALERTS } from '../actions/push_notifications';
const SubscriptionRecord = ImmutableRecord({
  id: '',
  endpoint: ''
});
const ReducerRecord = ImmutableRecord({
  subscription: null,
  alerts: ImmutableMap({
    follow: true,
    follow_request: true,
    favourite: true,
    reblog: true,
    mention: true,
    poll: true
  }),
  isSubscribed: false,
  browserSupport: false
});
export default function push_subscriptions(state = ReducerRecord(), action) {
  switch (action.type) {
    case SET_SUBSCRIPTION:
      return state.set('subscription', SubscriptionRecord({
        id: action.subscription.id,
        endpoint: action.subscription.endpoint
      })).set('alerts', ImmutableMap(action.subscription.alerts)).set('isSubscribed', true);
    case SET_BROWSER_SUPPORT:
      return state.set('browserSupport', action.value);
    case CLEAR_SUBSCRIPTION:
      return ReducerRecord();
    case SET_ALERTS:
      return state.setIn(action.path, action.value);
    default:
      return state;
  }
}