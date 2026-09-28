import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// Next.js requires a root layout file, even if it just passes children through.
export default function RootLayout({ children }: Props) {
  return children;
}
