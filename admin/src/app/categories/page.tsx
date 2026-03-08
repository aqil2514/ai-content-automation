import CategoriesTemplate from "@/components/templates/CategoriesTemplate";
import { Metadata } from "next";

export const metadata:Metadata = {
  title:"Categories"
}

export default function CategoriesPage(){
  return <CategoriesTemplate />
}