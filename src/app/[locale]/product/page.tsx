import { redirect } from "@/i18n/routing";

interface ProductIndexPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function ProductIndexPage({ params }: ProductIndexPageProps) {
  const { locale } = await params;
  redirect({ href: "/products", locale });
}
