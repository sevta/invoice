import { AppShell, AppShellProps, useMantineTheme } from "@mantine/core";

interface LayoutProps extends AppShellProps {}

export default function Layout({ children }: LayoutProps) {
  const theme = useMantineTheme();

  return (
    <AppShell
      sx={{
        backgroundColor:
          theme.colorScheme === "light"
            ? theme.fn.lighten(theme.colors[theme.primaryColor][5], 0)
            : // theme.colors.gray[1]
              theme.colors.dark[5],
      }}
    >
      {children}
    </AppShell>
  );
}
