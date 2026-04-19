import React from 'react';
import { SkillService } from '@/src/services/skill.service';
import SkillClient from './SkillClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Skill Management | Admin',
};

export default async function SkillManagementPage() {
  // Fetch data directly from the service (Server-side)
  // bypassCache=true for admin to ensure data is always fresh
  const response = await SkillService.getAllSkills(true);
  
  // Map data to ensure serializable types and fix TypeScript 'id: undefined' warnings
  const mappedData = response.data.map(skill => ({
    id: skill.id || 0,
    icon: skill.icon,
    title: skill.title,
    skills: skill.skills,
    color_class: skill.color_class,
    delay_class: skill.delay_class
  }));
  
  return <SkillClient initialData={mappedData} />;
}
