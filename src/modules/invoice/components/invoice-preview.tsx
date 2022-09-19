/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/no-unescaped-entities */
import { Grid, Image, Stack, Text, Title } from "@mantine/core";
import moment from "moment";
import { InvoiceFormType } from "../types";

interface InvoicePreviewProps {
  invoice?: InvoiceFormType;
}

export default function InvoicePreview(props: InvoicePreviewProps) {
  return (
    <div>
      <Grid>
        <Grid.Col xs={4}>
          {props.invoice?.image ? (
            <Image src={props.invoice?.image} style={{ maxWidth: 200 }} />
          ) : (
            <Title order={2}>{props.invoice?.clientName}</Title>
          )}
        </Grid.Col>
        <Grid.Col xs={4}>
          <Stack>
            <div>
              <Text size="sm">Bill's from</Text>
              <Text size="sm" weight="bold">
                {props.invoice?.clientName || "-"}
              </Text>
              <Text size="sm">{props.invoice?.clientAddress || "-"}</Text>
            </div>

            <div>
              <Text size="sm">Phone</Text>
              <Text size="sm" weight="bold">
                {props.invoice?.clientPhoneNumber || "-"}
              </Text>
            </div>
          </Stack>
        </Grid.Col>
        <Grid.Col xs={4}>
          <Stack>
            <div>
              <Text size="sm">Bill's to</Text>
              <Text size="sm" weight="bold">
                {props.invoice?.billTo || "-"}
              </Text>
            </div>
            <div>
              <Text size="sm">Invoice date</Text>
              <Text size="sm" weight="bold">
                {moment(props.invoice?.invoiceDate).format("YYYY-MM-DD") || "-"}
              </Text>
            </div>

            <div>
              <Text size="sm">Invoice number</Text>
              <Text size="sm" weight="bold">
                {props.invoice?.invoiceNumber || "-"}
              </Text>
            </div>
          </Stack>
        </Grid.Col>
      </Grid>
      {/* <Debugger data={props.invoice} /> */}
    </div>
  );
}
