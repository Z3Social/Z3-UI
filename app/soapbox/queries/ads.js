import { useQuery } from '@tanstack/react-query';
import { getProvider } from 'soapbox/features/ads/providers';
import { useAppDispatch } from 'soapbox/hooks';
export default function useAds() {
  const dispatch = useAppDispatch();
  const getAds = async () => {
    return dispatch(async (_, getState) => {
      const provider = await getProvider(getState);
      if (provider) {
        return provider.getAds(getState);
      } else {
        return [];
      }
    });
  };
  return useQuery(['ads'], getAds, {
    placeholderData: []
  });
}