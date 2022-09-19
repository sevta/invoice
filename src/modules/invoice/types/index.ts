export type InvoiceItemList = {
  id?: string;
  itemName?: string;
  itemDescription?: string;
  itemQuantity?: number;
  itemUnitPrice?: number;
  itemTotal?: number;
};

export type InvoiceItem = {
  id: string;
  name: string;
  lists: InvoiceItemList[];
};

export type InvoiceFormType = {
  clientName: string;
  clientAddress: string;
  clientPhoneNumber: string;
  clientEmail: string;
  billTo: string;
  invoiceNumber: string;
  invoiceDate: string;
  paymentDue: string;
  paymentTerms: string;
  paymentDescription: string;
  items: InvoiceItem[];
  status: Status;
  image: string;
  total: number;
  createdAt: string | number;
};

export enum Status {
  DRAFT,
  PUBLISH,
}
