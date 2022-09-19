import {
  Accordion,
  ActionIcon,
  Affix,
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Modal,
  NumberInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, yupResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconCodePlus, IconFile, IconFilePlus, IconTrash } from "@tabler/icons";
import { addDoc, collection } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "src/utils/firebase";
import { v4 as uuidv4 } from "uuid";
import { object, string } from "yup";
import InvoicePreview from "./invoice-preview";

interface InvoiceFormProps {}

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

export type InvoiceForm = {
  clientName: string;
  clientAddress: string;
  clientPhoneNumber: string;
  clientEmail: string;
  items: InvoiceItem[];
  status: Status;
  total: number;
  createdAt: string | number;
};

export enum Status {
  DRAFT,
  PUBLISH,
}

export default function InvoiceForm({ ...props }: InvoiceFormProps) {
  const [showModalAddItem, handlerShowModalAddItem] = useDisclosure(false);

  const form = useForm<InvoiceForm>({
    initialValues: {
      clientName: "",
      clientAddress: "",
      clientPhoneNumber: "",
      clientEmail: "",
      items: [],
      status: Status.DRAFT,
      total: 0,
      createdAt: Date.now(),
    },

    validate: yupResolver(
      object().shape({
        clientName: string().required(),
        clientAddress: string().required(),
        clientPhoneNumber: string().required(),
        clientEmail: string().email().required(),
      })
    ),
  });

  function handleAddGroupItem() {
    form.insertListItem("items", {
      name: "",
      id: uuidv4(),
      lists: [
        {
          id: uuidv4(),
          itemName: "",
          itemQuantity: 0,
          itemTotal: 0,
          itemUnitPrice: 0,
          itemDescription: "",
        },
      ] as InvoiceItemList[],
    });
  }

  function handleAddRowItem(item: InvoiceItem, index: number) {
    form.insertListItem(`items.${index}.lists`, {
      id: uuidv4(),
      itemName: "",
      itemQuantity: 0,
      itemTotal: 0,
      itemUnitPrice: 0,
      itemDescription: "",
    });
  }

  function handleCalculateTotal(
    list: InvoiceItemList,
    index: number,
    listIndex: number,
    value: number | undefined = 0
  ) {
    let unitPrice =
      form.values?.items[index]?.lists[listIndex]?.itemUnitPrice || 0;
    form.setFieldValue(`items.${index}.lists.${listIndex}.itemQuantity`, value);
    form.setFieldValue(
      `items.${index}.lists.${listIndex}.itemTotal`,
      unitPrice * value
    );
  }

  function calculateTotal() {
    let calc = form.values?.items.map((item: InvoiceItem) =>
      item.lists.map((d: InvoiceItemList) => d.itemTotal)
    );
    // ?.reduce((prev: any, next: any) => prev + next) || 0;

    console.log({ calc });
  }

  useEffect(() => calculateTotal(), [form.values?.items]);

  async function handleSubmit(values: InvoiceForm) {
    form.setFieldValue("createdAt", Date.now());
    try {
      const resp = await addDoc(collection(db, "invoices"), {
        ...form.values,
      });
      console.log({ resp });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box>
      <Modal
        radius="md"
        size="70%"
        opened={showModalAddItem}
        onClose={handlerShowModalAddItem.close}
        withCloseButton={false}
      >
        <InvoicePreview invoice={form.values} />
      </Modal>
      <Affix
        position={{
          bottom: 40,
          right: 60,
        }}
      >
        <Button variant="light" onClick={handlerShowModalAddItem.toggle}>
          Preview
        </Button>
      </Affix>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Divider
          mb="md"
          label={
            <Group position="center">
              <Title>Invoice</Title>
            </Group>
          }
        />

        <Stack>
          <SimpleGrid cols={2}>
            <TextInput
              label="Clients"
              description="Name of client"
              {...form.getInputProps("clientName")}
            />
            <TextInput
              label="Address"
              description="Address of client"
              {...form.getInputProps("clientAddress")}
            />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <NumberInput
              label="Phone number"
              description="Phone number of client"
              {...form.getInputProps("clientPhoneNumber")}
            />
            <TextInput
              type="email"
              label="Email"
              description="Email of client"
              {...form.getInputProps("clientEmail")}
            />
          </SimpleGrid>
        </Stack>
        <Divider my="md" label={<Title>Bill</Title>} />
        <Stack>
          <SimpleGrid cols={2}>
            <TextInput label="Bill to" description="Bill to" />
            <TextInput label="Invoice number" description="Invoice number" />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <DatePicker label="Invoice date" description="Invoice date" />
            <DatePicker label="Payment due" description="Payment due" />
          </SimpleGrid>
          <TextInput label="Payment terms" description="Payment terms client" />
          <TextInput
            label="Payment description"
            description="Payment description client"
          />
        </Stack>
        <Divider my="md" label={<Title>Items</Title>} />
        {form.values.items?.length > 0 &&
          form.values.items.map((item, index) => (
            <Accordion
              key={index}
              p={0}
              sx={{
                width: "100%",
              }}
              styles={{
                panel: {
                  padding: 0,
                },
                content: {
                  padding: 0,
                },
              }}
            >
              <Accordion.Item value={item.id} p={0}>
                <Accordion.Control p="xs">
                  <Group>
                    {/* <Box>
                      <ActionIcon
                        variant="light"
                        radius="xl"
                        color="red"
                        onClick={() => form.removeListItem(`items`, index)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Box> */}
                    <Text size="md" weight={600}>
                      {index + 1}. {item.name}
                    </Text>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel px="xs">
                  <Box>
                    <TextInput
                      mb="sm"
                      {...form.getInputProps(`items.${index}.name`)}
                      description="Group name"
                    />
                    {item.lists?.map(
                      (list: InvoiceItemList, listIndex: number) => (
                        <Grid columns={20} key={listIndex}>
                          <Grid.Col xs={5}>
                            <TextInput
                              description="Item name"
                              withAsterisk
                              {...form.getInputProps(
                                `items.${index}.lists.${listIndex}.itemName`
                              )}
                            />
                          </Grid.Col>
                          <Grid.Col xs={5}>
                            <TextInput
                              description="Item description"
                              withAsterisk
                              {...form.getInputProps(
                                `items.${index}.lists.${listIndex}.itemDescription`
                              )}
                            />
                          </Grid.Col>
                          <Grid.Col xs={3}>
                            <NumberInput
                              description="Unit price"
                              hideControls
                              formatter={(value: any) =>
                                value
                                  ?.replace(/\./, ",")
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                              }
                              parser={(x: any) =>
                                x
                                  ?.replace(" ", "")
                                  .replace(/,/, "#")
                                  .replace(/\./g, "")
                                  .replace(/#/, ".")
                              }
                              withAsterisk
                              {...form.getInputProps(
                                `items.${index}.lists.${listIndex}.itemUnitPrice`
                              )}
                            />
                          </Grid.Col>
                          <Grid.Col xs={3}>
                            <NumberInput
                              description="Quantity"
                              hideControls
                              withAsterisk
                              {...form.getInputProps(
                                `items.${index}.lists.${listIndex}.itemQuantity`
                              )}
                              onChange={(value) =>
                                handleCalculateTotal(
                                  list,
                                  index,
                                  listIndex,
                                  value
                                )
                              }
                            />
                          </Grid.Col>

                          <Grid.Col xs={3}>
                            <NumberInput
                              value={0}
                              disabled
                              description="Total"
                              formatter={(value: any) =>
                                value
                                  ?.replace(/\./, ",")
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                              }
                              parser={(x: any) =>
                                x
                                  ?.replace(" ", "")
                                  .replace(/,/, "#")
                                  .replace(/\./g, "")
                                  .replace(/#/, ".")
                              }
                              {...form.getInputProps(
                                `items.${index}.lists.${listIndex}.itemTotal`
                              )}
                            />
                          </Grid.Col>
                          <Grid.Col xs={1}>
                            <Box
                              sx={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "flex-end",
                                paddingBottom: 5,
                              }}
                            >
                              <ActionIcon
                                variant="light"
                                radius="xl"
                                color="red"
                                onClick={() =>
                                  form.removeListItem(
                                    `items.${index}.lists`,
                                    listIndex
                                  )
                                }
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Box>
                          </Grid.Col>
                        </Grid>
                      )
                    )}
                    <Button
                      fullWidth
                      variant="subtle"
                      leftIcon={<IconCodePlus size={16} />}
                      mt="lg"
                      onClick={() => handleAddRowItem(item, index)}
                    >
                      Add row item
                    </Button>
                  </Box>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          ))}
        <Divider
          my="md"
          label={
            <Group position="apart" align="center" sx={{ width: "100%" }}>
              <Title>Total</Title>
              <Text size="sm" weight="bold">
                Rp {form.values.total}
              </Text>
            </Group>
          }
        />

        <Button
          variant="subtle"
          leftIcon={<IconFilePlus size={16} />}
          mt="lg"
          fullWidth
          onClick={handleAddGroupItem}
        >
          Add item
        </Button>
        <Group mt="xs">
          <Button
            type="submit"
            fullWidth
            variant="subtle"
            leftIcon={<IconFile size={16} />}
          >
            Save as draft
          </Button>
        </Group>
        <Group mt="xs">
          <Button type="submit" fullWidth variant="light">
            Save
          </Button>
        </Group>
      </form>
    </Box>
  );
}
