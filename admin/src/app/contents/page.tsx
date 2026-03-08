import { ContentsTemplate } from "@/components/templates/ContentsTemplate";
import { Metadata } from "next";

export const metadata:Metadata = {
  title:"Contents"
}

export default function ContentsPage(){
  return <ContentsTemplate />
}