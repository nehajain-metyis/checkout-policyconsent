import {
  reactExtension,
  useShippingAddress,
  useBuyerJourneyIntercept,
  Banner,
  useMetafields,
  useAppMetafields,
  useApi,
} from "@shopify/ui-extensions-react/checkout";
import { useState, useEffect } from "react";
import { useSettings } from "@shopify/ui-extensions-react/checkout";

export default reactExtension(
  "purchase.checkout.delivery-address.render-after",
  () => <App />
);

function App() {
  const address = useShippingAddress();
  const [error, setError] = useState(null);
  const [serviceable, setServiceable] = useState(true);
  const [days, setDays] = useState(null);
  const metafields = useMetafields();

  const { shop, sessionToken } = useApi();
  console.log("pincode checker app started for", shop)

  useEffect(() => {
    if (!address?.zip) return;

    async function checkPincode() {
      try {
        
        const shopDomain = shop.storefrontUrl;
        console.log(shopDomain)
        const response = await fetch(
          `${shopDomain}/apps/checker/check-pincode?pincode=${address.zip}`,
          {
            method: "GET",
            headers: {
              'Accept': "application/json",
              "Content-Type": "application/json",
            }
          }
        );

        const contentType = response.headers.get("content-type");
        const text = await response.text();

        if (contentType && contentType.includes("application/json")) {
          const data = JSON.parse(text);
          setDays(data.days);
          setServiceable(data.pincode);

          if (!data.pincode) {
            setError("Sorry, we do not deliver to this pincode.");
          } else {
            setError(null);
          }
        } else {
          setServiceable(true);
          setError("Unexpected response from server.");
        }
      } catch (err) {
        console.error("Error checking pincode:", err);
        setServiceable(true);
        setError("Error checking pincode.");
      }
    }

    checkPincode();
  }, [address?.zip]);

  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    if (!serviceable && canBlockProgress) {
      return {
        behavior: "block",
        reason: "Unserviceable pincode",
        errors: [
          {
            message: "",
            target: "$.cart.deliveryGroups[0].deliveryAddress.zip",
          },
        ],
      };
    }
    return { behavior: "allow" };
  });

  // ✅ Only render the Banner if pincode is available
  if (!address?.zip || !error) {
    return null;
  }

  return (
    <Banner title="" status={error ? "critical" : "info"}>
      {error
        ? error
        : days !== null
          ? `Great news! We will deliver in ${days} day${days > 1 ? "s" : ""}`
          : ""}
    </Banner>
  );
}