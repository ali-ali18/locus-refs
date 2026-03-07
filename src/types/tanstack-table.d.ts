/** biome-ignore-all lint/correctness/noUnusedVariables: side-effect import for module augmentation */
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    label?: string;
  }
}
