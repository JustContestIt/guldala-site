import { notFound } from "next/navigation";

// Unknown URLs land here so the 404 renders inside the [lang] layout, in the visitor's language
export default function CatchAll() {
  notFound();
}
