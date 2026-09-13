/* New Start Media — site configuration.
 * Nothing here is a secret. Edit the values, commit, and Render redeploys.
 * -------------------------------------------------------------------------
 * FORM DELIVERY (Web3Forms):
 *   1. Go to https://web3forms.com
 *   2. Enter the email address that should RECEIVE inquiries.
 *   3. Web3Forms emails you an "Access Key" (a UUID). It is designed to be
 *      public and lives in client-side code — it is NOT a secret.
 *   4. Paste that key as web3formsAccessKey below and commit.
 *   Each submission is then emailed to that address with a timestamp and all
 *   field values. No account dashboard, no CRM, unlimited on the free plan.
 *
 * Until a key is set, the form validates but shows a clear "not connected"
 * message instead of sending — so it can never silently drop an inquiry.
 * -------------------------------------------------------------------------
 * ANALYTICS (optional, add later):
 *   Also paste a Google tag (gtag.js) snippet into index.html <head>.
 *   Leave blank for now — deployment does not depend on this.
 */
window.NSM_CONFIG = {
  web3formsAccessKey: "",          // e.g. "1a2b3c4d-5e6f-7890-abcd-ef1234567890"
  leadSubject: "New Business Systems Review Request",
  minFormSeconds: 3                 // reject submissions faster than this (bot guard)
};
