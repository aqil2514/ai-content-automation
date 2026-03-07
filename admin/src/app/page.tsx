import { ContentsTemplate } from "@/components/templates/ContentsTemplate";
import { Metadata } from "next";

export const metadata:Metadata = {
  title:"Content"
}

export default function ContentsPage(){
  return <ContentsTemplate />
}