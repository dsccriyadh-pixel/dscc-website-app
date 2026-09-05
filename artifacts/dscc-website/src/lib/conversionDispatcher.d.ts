export type AdsConversionKind = "form" | "whatsapp" | "phone";

export function createAdsConversionDispatcher<TOptions>(
  hasConsent: () => boolean,
  dispatch: (kind: AdsConversionKind, eventId: string, options: TOptions) => void | Promise<void>,
): (kind: AdsConversionKind, eventId: string, options?: TOptions) => Promise<boolean>;