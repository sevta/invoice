/* eslint-disable jsx-a11y/alt-text */
import {
  Accordion,
  ActionIcon,
  Affix,
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  Modal,
  NumberInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm, yupResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import {
  IconCodePlus,
  IconFile,
  IconFilePlus,
  IconPhoto,
  IconTrash,
  IconTrashX,
  IconUpload,
  IconX,
} from "@tabler/icons";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { db, storage } from "src/utils/firebase";
import { v4 as uuidv4 } from "uuid";
import { object, string } from "yup";
import {
  InvoiceFormType,
  InvoiceItem,
  InvoiceItemList,
  Status,
} from "../types";
import InvoicePreview from "./invoice-preview";

interface InvoiceFormProps {
  invoice?: InvoiceFormType;
}

export default function InvoiceForm({ invoice, ...props }: InvoiceFormProps) {
  const [showModalAddItem, handlerShowModalAddItem] = useDisclosure(false);
  const [file, setFile] = useState<FileWithPath[]>([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [previewImage, setPreviewImage] = useState<any>();
  const theme = useMantineTheme();

  const form = useForm<InvoiceFormType>({
    initialValues: {
      clientName: "",
      clientAddress: "",
      clientPhoneNumber: "",
      clientEmail: "",
      image: "",
      billTo: "",
      invoiceNumber: "",
      invoiceDate: "",
      paymentDue: "",
      paymentTerms: "",
      paymentDescription: "",
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
        billTo: string().required(),
        invoiceNumber: string().required(),
        invoiceDate: string().required(),
        paymentDue: string().required(),
        paymentTerms: string().required(),
        paymentDescription: string().required(),
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

  function handleSetDefaultValue() {
    if (invoice !== undefined) {
      form.setValues({
        ...invoice,
      });
    }
  }

  useEffect(() => calculateTotal(), [form.values?.items]);

  useEffect(() => {
    handleSetDefaultValue();
  }, [invoice]);

  async function handleSubmit(values: InvoiceFormType) {
    setLoadingSubmit(true);
    form.setFieldValue("createdAt", Date.now());

    try {
      if (previewImage) {
        const storageRef = ref(storage, file[0].path);
        await uploadBytes(storageRef, file[0]);
        const downloadUrl = await getDownloadURL(ref(storage, file[0].path));
        form.setFieldValue("image", downloadUrl);
      }
      await addDoc(collection(db, "invoices"), {
        ...form.values,
      });
      showNotification({ message: "success add new invoice" });
      form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSubmit(false);
    }
  }

  function handleDropFile(file: FileWithPath[]) {
    setFile(file);
    const objectUrl = URL.createObjectURL(file[0]);
    setPreviewImage(objectUrl);
    form.setFieldValue("image", objectUrl);
  }

  function handleRemovePreviewImage() {
    setPreviewImage(null);
    form.setFieldValue("image", "");
  }

  return (
    <Box>
      <LoadingOverlay visible={loadingSubmit} />
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
        <Divider mb="md" label={<Title>Invoice</Title>} />

        <Stack>
          <SimpleGrid cols={2}>
            <Stack>
              {previewImage ? (
                <div>
                  <ActionIcon
                    radius="xl"
                    color="red"
                    size="lg"
                    variant="light"
                    onClick={handleRemovePreviewImage}
                  >
                    <IconTrashX size={20} />
                  </ActionIcon>
                  <Image src={previewImage} />
                </div>
              ) : (
                <Dropzone
                  onDrop={handleDropFile}
                  onReject={(files) => console.log("rejected files", files)}
                  maxSize={3 * 1024 ** 2}
                  accept={IMAGE_MIME_TYPE}
                  {...props}
                >
                  <Group
                    position="center"
                    spacing="xl"
                    style={{ minHeight: 140, pointerEvents: "none" }}
                  >
                    <Dropzone.Accept>
                      <IconUpload
                        size={50}
                        stroke={1.5}
                        color={
                          theme.colors[theme.primaryColor][
                            theme.colorScheme === "dark" ? 4 : 6
                          ]
                        }
                      />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IconX
                        size={50}
                        stroke={1.5}
                        color={
                          theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
                        }
                      />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <IconPhoto size={50} stroke={1.5} />
                    </Dropzone.Idle>

                    <div>
                      <Text weight={600} align="center" inline>
                        Drag images here or click to select files
                      </Text>
                      <Text
                        size="xs"
                        align="center"
                        color="dimmed"
                        inline
                        mt={7}
                      >
                        Attach as many files as you like, each file should not
                        exceed 5mb
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
              )}
            </Stack>
          </SimpleGrid>
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
            <TextInput
              label="Bill to"
              description="Bill to"
              {...form.getInputProps("billTo")}
            />
            <TextInput
              label="Invoice number"
              description="Invoice number"
              {...form.getInputProps("invoiceNumber")}
            />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <DatePicker
              label="Invoice date"
              description="Invoice date"
              {...form.getInputProps("invoiceDate")}
            />
            <DatePicker
              label="Payment due"
              description="Payment due"
              format
              {...form.getInputProps("paymentDue")}
            />
          </SimpleGrid>
          <TextInput
            label="Payment terms"
            description="Payment terms client"
            {...form.getInputProps("paymentTerms")}
          />
          <TextInput
            label="Payment description"
            description="Payment description client"
            {...form.getInputProps("paymentDescription")}
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
