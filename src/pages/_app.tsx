import "@fontsource/source-sans-pro/200.css";
import "@fontsource/source-sans-pro/300.css";
import "@fontsource/source-sans-pro/400.css";
import "@fontsource/source-sans-pro/600.css";
import "@fontsource/source-sans-pro/700.css";
import "@fontsource/source-sans-pro/900.css";

import "@fontsource/poppins/100.css";
import "@fontsource/poppins/200.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";

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
          // fontFamily: "Source Sans Pro",
          fontFamily: "Poppins",
          // fontFamily: "Inter",
          headings: {
            // fontFamily: "Source Sans Pro",
            fontFamily: "Poppins",
            // fontFamily: "Inter",
          },
          components: {
            Button: {
              styles: {
                root: {
                  fontWeight: 500,
                },
              },
            },
            Title: {
              defaultProps: {
                // weight: 600,
              },
              styles: {
                root: {
                  letterSpacing: "-0.05em",
                },
              },
            },
            TextInput: {
              defaultProps: {
                variant: "filled",
                // radius: "xs",
              },
            },
            NumberInput: {
              defaultProps: {
                variant: "filled",
                // radius: "xs",
              },
            },
            DatePicker: {
              defaultProps: {
                variant: "filled",
                // radius: "xs",
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
