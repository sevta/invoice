import { Code } from "@mantine/core";

export default function Debugger({ data }: { data: any }) {
  return (
    <pre>
      <Code block>{JSON.stringify(data, null, 2)}</Code>
    </pre>
  );
}
