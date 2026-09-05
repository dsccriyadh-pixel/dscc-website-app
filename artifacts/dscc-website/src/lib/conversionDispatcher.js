export function createAdsConversionDispatcher(hasConsent, dispatch) {
  const sent = new Set();

  return async function dispatchOnce(kind, eventId, options = {}) {
    if (!hasConsent()) return false;
    const conversionKey = `${kind}:${eventId}`;
    if (sent.has(conversionKey)) return false;
    sent.add(conversionKey);
    try {
      await dispatch(kind, eventId, options);
      return true;
    } catch (error) {
      sent.delete(conversionKey);
      throw error;
    }
  };
}