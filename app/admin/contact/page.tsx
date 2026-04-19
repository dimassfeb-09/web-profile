import React from 'react';
import { ContactService } from '@/src/services/contact.service';
import ContactClient from './ContactClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact Details Management | Admin',
};

export default async function ContactManagementPage() {
  const response = await ContactService.getContactData(true);
  const data = response.data || { 
    headline: '', 
    description: '', 
    email: '', 
    linkedin_url: '',
    github_url: '',
    instagram_url: '',
    twitter_url: ''
  };

  return <ContactClient initialData={data} />;
}
