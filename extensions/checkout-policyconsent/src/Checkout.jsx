import {
  reactExtension,
  BlockStack,
  Checkbox,
  useBuyerJourneyIntercept,
} from "@shopify/ui-extensions-react/checkout";
import { useState } from "react";

export default reactExtension("purchase.checkout.payment-method-list.render-after", () => (
  <Extension />
));

function Extension() {
  const [consentGiven, setConsentGiven] = useState(false);

  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    if (!consentGiven && canBlockProgress) {
      return {
        behavior: 'block',
        reason: 'consent-required',
        errors: [
          {
            message: 'You must agree to our Terms & Conditions and Privacy Policy.',
          },
        ],
      };
    }
    return { behavior: 'allow' };
  });

  return (
    <BlockStack spacing="loose">
      <Checkbox checked={consentGiven} onChange={setConsentGiven}>
        By clicking Pay Now, you agree to our Terms & Conditions and Privacy Policy.
      </Checkbox>
    </BlockStack>
  );
}