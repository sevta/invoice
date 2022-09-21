import { AppShell, AppShellProps, Box, useMantineTheme } from "@mantine/core";

interface LayoutProps extends AppShellProps {
  withBackground?: boolean;
}

export default function Layout({
  withBackground = true,
  children,
}: LayoutProps) {
  const theme = useMantineTheme();

  return (
    <AppShell
      sx={{
        backgroundColor:
          theme.colorScheme === "light"
            ? // ? theme.fn.lighten(theme.colors[theme.primaryColor][5], 0)
              theme.colors.gray[1]
            : theme.colors.dark[5],
      }}
    >
      {withBackground && (
        <Box
          sx={{
            width: "100%",
            height: "35vh",
            position: "fixed",
            top: 0,
            left: 0,
            backgroundColor: theme.fn.primaryColor(),
          }}
        ></Box>
      )}

      {children}
    </AppShell>
  );
}
