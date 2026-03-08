import TopicsTemplate from "@/components/templates/TopicsTemplate";
import { Metadata } from "next";

export const metadata:Metadata = {
  title:"Topics"
}

export default function ContentsPage(){
  return <TopicsTemplate />
}