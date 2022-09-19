import { Button } from "@mantine/core";
import { NextLink } from "@mantine/next";
import InvoiceLists from "src/modules/invoice/invoice-list";

export default function InvoicePage() {
  return (
    <div>
      <InvoiceLists />
      <Button component={NextLink} href="/invoice/create">
        Create new
      </Button>
    </div>
  );
}
