import { Affix, Button, Card, LoadingOverlay, SimpleGrid } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "src/components/layouts/layout";
import { db } from "src/utils/firebase";
import InvoicePreview from "../invoice/components/invoice-preview";
import { InvoiceFormType } from "../invoice/types";

interface Invoice extends InvoiceFormType {
  id: string;
}

export default function InvoiceLists() {
  const [listInvoice, setListInvoice] = useState<Invoice[]>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function getInvoiceLists() {
    setLoading(true);
    try {
      let data: any[] = [];
      const querySnapshot = await getDocs(collection(db, "invoices"));
      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setListInvoice(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getInvoiceLists();
  }, []);
  return (
    <Layout withBackground={false}>
      <LoadingOverlay visible={loading} />
      <Affix
        position={{
          bottom: 60,
          right: 90,
        }}
      >
        <Button component={NextLink} href="/invoice/create">
          create new
        </Button>
      </Affix>
      <SimpleGrid cols={2}>
        {listInvoice?.map((item, index) => (
          <Card
            shadow="xs"
            key={index}
            sx={{ cursor: "pointer" }}
            onClick={() => router.push(`/invoice/${item.id}`)}
          >
            {/* <Text size="sm" color="dimmed">
              {item.clientName}
            </Text>
            <Text size="sm" weight="bold">
              {item.createdAt
                ? moment(item.createdAt).format("YYYY-MM-DD")
                : "-"}
            </Text> */}
            <InvoicePreview invoice={item} />
          </Card>
        ))}
      </SimpleGrid>
    </Layout>
  );
}
