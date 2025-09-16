import {
  reactExtension,
  Link,
  BlockStack,
  Text,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  return (
    <BlockStack spacing="loose">
      <Text size="medium" emphasis="bold">
        Need Help?
      </Text>
      <Link to="/pages/contact" external appearance="monochrome">
        Contact Us
      </Link>
    </BlockStack>
  );
}
