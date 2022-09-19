import { MantineProvider } from "@mantine/core";
import { AppProps } from "next/app";
import Head from "next/head";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light",
          primaryColor: "blue",
          fontFamily: "Inter",
          headings: {
            fontFamily: "Inter",
          },
          components: {
            Title: {
              styles: {
                root: {
                  letterSpacing: "-0.05em",
                },
              },
            },
            TextInput: {
              defaultProps: {
                variant: "filled",
              },
            },
            NumberInput: {
              defaultProps: {
                variant: "filled",
              },
            },
            DatePicker: {
              defaultProps: {
                variant: "filled",
              },
            },
            Stack: {
              defaultProps: {
                spacing: "xs",
              },
            },
          },
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}
