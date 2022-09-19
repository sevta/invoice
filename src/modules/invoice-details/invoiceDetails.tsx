import { Card, Container } from "@mantine/core";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "src/components/layouts/layout";
import { db } from "src/utils/firebase";
import InvoiceForm from "../invoice/components/invoice-form";
import { InvoiceFormType } from "../invoice/types";

export default function InvoiceDetails() {
  const [invoice, setInvoice] = useState<InvoiceFormType>();

  const router = useRouter();
  const { id } = router.query;

  console.log(id);

  async function getDocument() {
    try {
      const docRef = doc(db, "invoices", String(id));
      const docSnap = await getDoc(docRef);
      let data = docSnap.data() as InvoiceFormType;
      setInvoice(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getDocument();
  }, []);

  return (
    <Layout>
      <Container>
        <Card>
          <InvoiceForm invoice={invoice} />
        </Card>
      </Container>
    </Layout>
  );
}
