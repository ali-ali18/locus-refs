"use client";

import { DataTableCategories } from "@/components/categories/DataTableCategories";
import { PageHeader } from "@/components/categories/PageHeader";
import { Container } from "@/components/shared/Container";

export default function CategoriesPage() {
  return (
    <Container as="section">
      <PageHeader />
      <DataTableCategories />
    </Container>
  );
}
