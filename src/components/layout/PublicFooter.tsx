import { ContactService } from "@/src/services/contact.service";
import Footer from "./Footer";

export default async function PublicFooter() {
  const contactData = await ContactService.getContactData();
  return <Footer data={contactData.data || undefined} />;
}
