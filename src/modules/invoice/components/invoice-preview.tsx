/* eslint-disable react/no-unescaped-entities */
import { Grid, Stack, Text, Title } from "@mantine/core";
import Debugger from "src/components/ui/debugger";
import { InvoiceForm } from "./invoice-form";

interface InvoicePreviewProps {
  invoice?: InvoiceForm;
}

export default function InvoicePreview(props: InvoicePreviewProps) {
  return (
    <div>
      <Grid>
        <Grid.Col xs={4}>
          <Title>Logo</Title>
        </Grid.Col>
        <Grid.Col xs={4}>
          <Stack>
            <div>
              <Text size="sm">Bill's from</Text>
              <Text size="sm" weight="bold">
                Karla digital project
              </Text>
              <Text size="sm">
                Kebon Jeruk No. 29, Kel. Kebon Jeruk - Jakarta Barat
              </Text>
            </div>

            <div>
              <Text size="sm">Phone</Text>
              <Text size="sm" weight="bold">
                0812-9556-0113
              </Text>
            </div>
          </Stack>
        </Grid.Col>
        <Grid.Col xs={4}>
          <Stack>
            <div>
              <Text size="sm">Bill's to</Text>
              <Text size="sm" weight="bold">
                Karla digital project
              </Text>
              <Text size="sm">
                Kebon Jeruk No. 29, Kel. Kebon Jeruk - Jakarta Barat
              </Text>
            </div>

            <div>
              <Text size="sm">Phone</Text>
              <Text size="sm" weight="bold">
                0812-9556-0113
              </Text>
            </div>
          </Stack>
        </Grid.Col>
      </Grid>
      <Debugger data={props.invoice} />
    </div>
  );
}
