# DSCC Meta retargeting implementation

## Scope

- Meta Pixel ID `2767855866945056`.
- Consent-gated browser loading; Meta is disabled unless `ad_storage`,
  `ad_user_data`, and `ad_personalization` are all granted.
- Browser events: `PageView`, `ViewContent`, `Contact`, `RequestQuote`, and
  `Lead`.
- Server event: `Lead` through Meta Conversions API Graph API `v26.0`.
- Browser/server `Lead` deduplication uses the same generated event ID.

## Event rules

- `PageView` is sent by React once per SPA path. The HTML bootstrap loads and
  initializes the Pixel but intentionally does not send a second page view.
- `ViewContent` carries `content_name`, `content_category`, `content_type`, and
  a route-derived `content_ids` value when a slug exists.
- `Contact` covers WhatsApp, telephone, email, and chatbot contact actions.
- `RequestQuote` is sent from an actual quote CTA, not merely by opening or
  hydrating the quote page.
- `Lead` is sent only after the lead endpoint accepts the submission.

## Privacy and data handling

- Browser Meta events contain no email, phone number, name, or other lead PII.
- The server normalizes and SHA-256 hashes valid email and phone identifiers
  before sending them to Meta.
- The CAPI token is read only from server configuration/environment and is
  transmitted to Graph in an Authorization header.
- `_fbp`, `_fbc`, client IP, and user agent are included server-side when valid.
- No artificial monetary value or currency is assigned to a lead.
- Withdrawing advertising consent prevents future browser and server events.

## Reliability

- CAPI event IDs use a short-lived `pending` claim to prevent concurrent sends.
- A successful Graph response commits the ID as `sent`.
- A failed Graph response releases the claim so a retry is not discarded.
- CAPI failure never changes an already accepted customer lead into a failed
  submission.
- Including the CAPI helper from `leads.php` defines functions only; direct HTTP
  dispatch runs only when `meta-capi.php` is the requested script.

## Server configuration

Set these as server-side build/runtime secrets, never in browser code:

- `META_CAPI_ACCESS_TOKEN` — required for server events.
- `META_PIXEL_ID` — optional; defaults to the DSCC Pixel ID above.
- `META_CAPI_TEST_EVENT_CODE` — optional and intended only for Meta Test Events.

## Verification

The tracking check covers:

- no consent, measurement-only consent, and full advertising consent;
- no duplicate Google, GTM, Meta loader, or browser `PageView`;
- official Meta `eventID` browser deduplication syntax;
- accepted-lead-only conversion behavior;
- PHP include safety, retry-safe CAPI deduplication, and absence of fake value;
- one Meta bootstrap in every generated HTML page;
- no unresolved tracking placeholders or CAPI token in browser output.

Meta Test Events still requires a valid server token and confirmation of a
received Server Event in Meta Events Manager. This implementation does not
claim that external confirmation until Meta returns success and the event is
visible there.