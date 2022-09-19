import { Button, Card, Container, useMantineTheme } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons";
import { useRouter } from "next/router";
import Layout from "src/components/layouts/layout";
import InvoiceForm from "./components/invoice-form";

export default function Invoice() {
  const theme = useMantineTheme();
  const router = useRouter();

  return (
    <Layout>
      <Container>
        <Button
          leftIcon={<IconChevronLeft size={16} />}
          size="sm"
          compact
          variant="light"
          onClick={() => router.back()}
        >
          back
        </Button>
        <Card
          mt="lg"
          shadow="xs"
          sx={{
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
          }}
        >
          <InvoiceForm />
        </Card>
      </Container>
    </Layout>
  );
}
