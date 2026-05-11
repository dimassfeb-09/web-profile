"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AdminHeader from "@/src/components/admin/ui/AdminHeader";
import AdminModal from "@/src/components/admin/ui/AdminModal";
import ImageUploader from "@/src/components/admin/ui/ImageUploader";
import {
  createEducationAction,
  updateEducationAction,
  deleteEducationAction,
} from "@/src/actions/education.actions";
import { slugify } from "@/src/lib/utils/slugify";
import { useDebounce } from "use-debounce";

interface Education {
  id: string;
  slug: string;
  institution: string;
  degree?: string | null;
  major?: string | null;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  description?: string | null;
  logo_url?: string | null;
  location?: string | null;
  gpa?: number | null;
  gallery?: any[];
  activities?: any[];
  project_ids?: string[];
  certificate_ids?: string[];
  achievement_ids?: string[];
}

interface Project {
  id?: string;
  title: string;
}

interface Certificate {
  id?: string;
  title: string;
}

interface Achievement {
  id?: string;
  title: string;
}

interface EducationClientProps {
  initialData: Education[];
  projects: Project[];
  certificates: Certificate[];
  achievements: Achievement[];
}

export default function EducationClient({
  initialData,
  projects,
  certificates,
  achievements,
}: EducationClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "general" | "activities" | "relations" | "gallery"
  >("general");

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [slugStatus, setSlugStatus] = useState<{
    loading: boolean;
    available: boolean | null;
  }>({ loading: false, available: null });

  const [formData, setFormData] = useState({
    institution: "",
    slug: "",
    degree: "",
    major: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
    logo_url: "",
    location: "",
    gpa: "",
    gallery: [] as any[],
    activities: [] as any[],
    project_ids: [] as string[],
    certificate_ids: [] as string[],
    achievement_ids: [] as string[],
  });

  const [projectSearch, setProjectSearch] = useState("");
  const [certSearch, setCertSearch] = useState("");
  const [achSearch, setAchSearch] = useState("");

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(projectSearch.toLowerCase()),
  );

  const filteredCertificates = certificates.filter((c) =>
    c.title.toLowerCase().includes(certSearch.toLowerCase()),
  );

  const filteredAchievements = achievements.filter((a) =>
    a.title.toLowerCase().includes(achSearch.toLowerCase()),
  );

  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);

  const formatDateForInput = (date: string | Date | null | undefined) => {
    if (!date) return "";
    if (date instanceof Date) {
      return date.toISOString().split("T")[0];
    }
    return date.split("T")[0];
  };

  const handleEdit = (edu: Education) => {
    setEditingEducation(edu);
    setFormData({
      institution: edu.institution,
      slug: edu.slug,
      degree: edu.degree || "",
      major: edu.major || "",
      start_date: formatDateForInput(edu.start_date),
      end_date: formatDateForInput(edu.end_date ?? null),
      is_current: edu.is_current,
      description: edu.description || "",
      logo_url: edu.logo_url || "",
      location: edu.location || "",
      gpa: edu.gpa?.toString() || "",
      gallery: edu.gallery || [],
      activities: edu.activities || [],
      project_ids: edu.project_ids || [],
      certificate_ids: edu.certificate_ids || [],
      achievement_ids: edu.achievement_ids || [],
    });
    setSelectedLogo(null);
    setIsSlugManuallyEdited(true);
    setSlugStatus({ loading: false, available: true });
    setActiveTab("general");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education record?"))
      return;
    setIsLoading(true);
    try {
      const result = await deleteEducationAction(id);
      if (result.status === 200) {
        router.refresh();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Failed to delete education");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let finalLogoUrl = formData.logo_url;

    try {
      if (selectedLogo) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedLogo);

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadJson = await uploadRes.json();
        if (uploadRes.ok) {
          finalLogoUrl = uploadJson.data.url;
        } else {
          throw new Error(uploadJson.message || "Logo upload failed");
        }
      }

      const payload = {
        ...formData,
        logo_url: finalLogoUrl || null,
        gpa: formData.gpa ? parseFloat(formData.gpa) : null,
        end_date: formData.is_current ? null : formData.end_date || null,
      };

      let result;
      if (editingEducation) {
        result = await updateEducationAction(editingEducation.id, payload);
      } else {
        result = await createEducationAction(payload as any);
      }

      if (result.status === 200 || result.status === 201) {
        setIsModalOpen(false);
        router.refresh();
      } else {
        throw new Error(result.message || "Failed to save education");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const [debouncedSlug] = useDebounce(formData.slug, 300);

  useEffect(() => {
    const checkSlug = async () => {
      if (!debouncedSlug) {
        setSlugStatus({ loading: false, available: null });
        return;
      }
      setSlugStatus({ loading: true, available: null });
      try {
        const res = await fetch(
          `/api/admin/educations/check-slug?slug=${debouncedSlug}${editingEducation ? `&excludeId=${editingEducation.id}` : ""}`,
        );
        const data = await res.json();
        setSlugStatus({ loading: false, available: data.available });
      } catch {
        setSlugStatus({ loading: false, available: null });
      }
    };
    checkSlug();
  }, [debouncedSlug, editingEducation]);

  const addActivity = () => {
    setFormData({
      ...formData,
      activities: [
        ...formData.activities,
        { title: "", role: "", description: "", start_date: "", end_date: "" },
      ],
    });
  };

  const removeActivity = (index: number) => {
    const newActivities = [...formData.activities];
    newActivities.splice(index, 1);
    setFormData({ ...formData, activities: newActivities });
  };

  const toggleProject = (projectId: string) => {
    const newProjectIds = formData.project_ids.includes(projectId)
      ? formData.project_ids.filter((id) => id !== projectId)
      : [...formData.project_ids, projectId];
    setFormData({ ...formData, project_ids: newProjectIds });
  };

  const toggleCertificate = (certId: string) => {
    const newCertIds = formData.certificate_ids.includes(certId)
      ? formData.certificate_ids.filter((id) => id !== certId)
      : [...formData.certificate_ids, certId];
    setFormData({ ...formData, certificate_ids: newCertIds });
  };

  const toggleAchievement = (achId: string) => {
    const newAchIds = formData.achievement_ids.includes(achId)
      ? formData.achievement_ids.filter((id) => id !== achId)
      : [...formData.achievement_ids, achId];
    setFormData({ ...formData, achievement_ids: newAchIds });
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingEducation(null);
    setFormData({
      institution: "",
      slug: "",
      degree: "",
      major: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
      logo_url: "",
      location: "",
      gpa: "",
      gallery: [],
      activities: [],
      project_ids: [],
      certificate_ids: [],
      achievement_ids: [],
    });
    setSelectedLogo(null);
    setIsSlugManuallyEdited(false);
    setSlugStatus({ loading: false, available: null });
    setActiveTab("general");
    setProjectSearch("");
    setCertSearch("");
    setAchSearch("");
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Education"
        description="Manage your academic history and campus activities."
        buttonLabel="Add Education"
        onButtonClick={() => {
          setEditingEducation(null);
          setFormData({
            institution: "",
            slug: "",
            degree: "",
            major: "",
            start_date: "",
            end_date: "",
            is_current: false,
            description: "",
            logo_url: "",
            location: "",
            gpa: "",
            gallery: [],
            activities: [],
            project_ids: [],
            certificate_ids: [],
            achievement_ids: [],
          });
          setSelectedLogo(null);
          setIsSlugManuallyEdited(false);
          setSlugStatus({ loading: false, available: null });
          setActiveTab("general");
          setIsModalOpen(true);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {initialData.map((edu) => (
          <div
            key={edu.id}
            className="bg-surface border border-outline-variant/20 rounded-2xl p-5 flex flex-col transition-colors hover:border-outline-variant/40"
          >
            <div className="flex items-start gap-4 mb-4">
              {edu.logo_url ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden relative bg-white border border-outline-variant/10 flex-shrink-0">
                  <Image
                    src={edu.logo_url}
                    alt={edu.institution}
                    fill
                    sizes="48px"
                    className="object-contain p-1.5"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0 border border-outline-variant/10">
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant/30">
                    school
                  </span>
                </div>
              )}
              <div className="flex-grow min-w-0">
                <h3 className="text-sm font-bold text-on-surface truncate">
                  {edu.institution}
                </h3>
                <p className="text-[11px] text-primary font-medium mt-0.5 truncate">
                  {edu.degree} {edu.major ? `in ${edu.major}` : ""}
                </p>
                <p className="text-[10px] text-on-surface-variant/60 mt-1">
                  {formatDateForInput(edu.start_date).split("-")[0]} —{" "}
                  {edu.is_current
                    ? "Present"
                    : formatDateForInput(edu.end_date ?? null).split("-")[0]}
                </p>
              </div>
            </div>

            <p className="text-[12px] text-on-surface-variant line-clamp-2 mb-5 flex-grow leading-relaxed">
              {edu.description}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={isLoading}
                onClick={() => handleEdit(edu)}
                className="flex-grow py-2 px-4 rounded-lg bg-surface-container-high text-on-surface text-[11px] font-bold hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center gap-2 border border-transparent"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Manage
              </button>
              <button
                disabled={isLoading}
                onClick={() => handleDelete(edu.id)}
                className="p-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-error/10 hover:text-error transition-all border border-transparent"
              >
                <span className="material-symbols-outlined text-lg">
                  delete
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <AdminModal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={editingEducation ? "Edit Education" : "Add Education"}
        isLarge
        className="h-[750px] max-h-[90dvh]"
        bodyClassName="overflow-hidden pt-0"
      >
        <div className="flex border-b border-outline-variant/20 mb-6 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: "general", label: "General Info" },
            { id: "activities", label: "Activities" },
            { id: "relations", label: "Relations" },
            { id: "gallery", label: "Gallery" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-grow overflow-hidden min-h-0"
        >
          <div className="flex-grow space-y-6 mb-6 overflow-y-auto custom-scrollbar pr-2 min-h-0">
            {activeTab === "general" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 md:col-span-2">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-on-surface-variant ml-1">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.institution}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          institution: val,
                          slug: isSlugManuallyEdited ? prev.slug : slugify(val),
                        }));
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-on-surface-variant ml-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => {
                        setIsSlugManuallyEdited(true);
                        setFormData({ ...formData, slug: e.target.value });
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-on-surface-variant ml-1">
                    Degree (e.g. Bachelor)
                  </label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) =>
                      setFormData({ ...formData, degree: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-on-surface-variant ml-1">
                    Major
                  </label>
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) =>
                      setFormData({ ...formData, major: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-on-surface-variant ml-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-on-surface-variant ml-1">
                    End Date
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="date"
                      disabled={formData.is_current}
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      className="flex-grow px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm disabled:opacity-50"
                    />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_current}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_current: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-outline-variant/20 text-primary focus:ring-primary"
                      />
                      <span className="text-xs font-medium text-on-surface-variant">
                        Current
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-on-surface-variant ml-1">
                    GPA (e.g. 3.85)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={formData.gpa}
                    onChange={(e) =>
                      setFormData({ ...formData, gpa: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-on-surface-variant ml-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUploader
                    value={formData.logo_url}
                    onChange={(file) => setSelectedLogo(file)}
                    onClear={() => setFormData({ ...formData, logo_url: "" })}
                    label="Institution Logo"
                    maxSizeMB={1}
                    aspectRatio="aspect-square"
                    className="w-32 mx-auto"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-medium text-on-surface-variant ml-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-high border border-outline-variant/20 focus:outline-none focus:border-primary transition-all text-sm resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === "activities" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-on-surface">
                    Activities & Organizations
                  </h4>
                  <button
                    type="button"
                    onClick={addActivity}
                    className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-all"
                  >
                    + Add Activity
                  </button>
                </div>

                {formData.activities.map((activity, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-surface-container-high border border-outline-variant/10 space-y-4 relative group"
                  >
                    <button
                      type="button"
                      onClick={() => removeActivity(index)}
                      className="absolute top-4 right-4 text-error opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        placeholder="Title (e.g. Student Council)"
                        value={activity.title}
                        onChange={(e) => {
                          const newActs = [...formData.activities];
                          newActs[index].title = e.target.value;
                          setFormData({ ...formData, activities: newActs });
                        }}
                        className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-sm"
                      />
                      <input
                        placeholder="Role (e.g. President)"
                        value={activity.role}
                        onChange={(e) => {
                          const newActs = [...formData.activities];
                          newActs[index].role = e.target.value;
                          setFormData({ ...formData, activities: newActs });
                        }}
                        className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-sm"
                      />
                      <input
                        type="date"
                        value={formatDateForInput(activity.start_date)}
                        onChange={(e) => {
                          const newActs = [...formData.activities];
                          newActs[index].start_date = e.target.value;
                          setFormData({ ...formData, activities: newActs });
                        }}
                        className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-sm"
                      />
                      <input
                        type="date"
                        value={formatDateForInput(activity.end_date)}
                        onChange={(e) => {
                          const newActs = [...formData.activities];
                          newActs[index].end_date = e.target.value;
                          setFormData({ ...formData, activities: newActs });
                        }}
                        className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-sm"
                      />
                    </div>
                    <textarea
                      placeholder="Description"
                      rows={2}
                      value={activity.description || ""}
                      onChange={(e) => {
                        const newActs = [...formData.activities];
                        newActs[index].description = e.target.value;
                        setFormData({ ...formData, activities: newActs });
                      }}
                      className="w-full px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/20 text-sm resize-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "relations" && (
              <div className="flex flex-col h-full space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
                  {/* Projects Column */}
                  <div className="flex flex-col min-h-0 bg-surface-container-low/50 p-4 rounded-2xl border border-outline-variant/10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-xs font-bold text-on-surface flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-primary">
                            rocket_launch
                          </span>
                          Projects
                        </h4>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        {formData.project_ids.length}
                      </span>
                    </div>
                    <div className="relative mb-3">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
                        search
                      </span>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/10 text-[11px] outline-none"
                      />
                    </div>
                    <div className="flex-grow overflow-y-auto pr-1 space-y-1.5 custom-scrollbar min-h-0">
                      {filteredProjects.map((p) => (
                        <label
                          key={p.id}
                          className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${formData.project_ids.includes(p.id!) ? "bg-primary/5 border-primary/20" : "bg-surface-container-low border-transparent hover:border-outline-variant/20"}`}
                        >
                          <input
                            type="checkbox"
                            hidden
                            checked={formData.project_ids.includes(p.id!)}
                            onChange={() => toggleProject(p.id!)}
                          />
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center transition-all ${formData.project_ids.includes(p.id!) ? "bg-primary text-on-primary" : "border border-outline-variant/30"}`}
                          >
                            {formData.project_ids.includes(p.id!) && (
                              <span className="material-symbols-outlined text-[10px] font-bold">
                                check
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-medium truncate">
                            {p.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Certificates Column */}
                  <div className="flex flex-col min-h-0 bg-surface-container-low/50 p-4 rounded-2xl border border-outline-variant/10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-xs font-bold text-on-surface flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-primary">
                            verified
                          </span>
                          Certificates
                        </h4>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        {formData.certificate_ids.length}
                      </span>
                    </div>
                    <div className="relative mb-3">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
                        search
                      </span>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={certSearch}
                        onChange={(e) => setCertSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/10 text-[11px] outline-none"
                      />
                    </div>
                    <div className="flex-grow overflow-y-auto pr-1 space-y-1.5 custom-scrollbar min-h-0">
                      {filteredCertificates.map((c) => (
                        <label
                          key={c.id}
                          className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${formData.certificate_ids.includes(c.id!) ? "bg-primary/5 border-primary/20" : "bg-surface-container-low border-transparent hover:border-outline-variant/20"}`}
                        >
                          <input
                            type="checkbox"
                            hidden
                            checked={formData.certificate_ids.includes(c.id!)}
                            onChange={() => toggleCertificate(c.id!)}
                          />
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center transition-all ${formData.certificate_ids.includes(c.id!) ? "bg-primary text-on-primary" : "border border-outline-variant/30"}`}
                          >
                            {formData.certificate_ids.includes(c.id!) && (
                              <span className="material-symbols-outlined text-[10px] font-bold">
                                check
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-medium truncate">
                            {c.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Achievements Column */}
                  <div className="flex flex-col min-h-0 bg-surface-container-low/50 p-4 rounded-2xl border border-outline-variant/10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-xs font-bold text-on-surface flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-primary">
                            military_tech
                          </span>
                          Achievements
                        </h4>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        {formData.achievement_ids.length}
                      </span>
                    </div>
                    <div className="relative mb-3">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
                        search
                      </span>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={achSearch}
                        onChange={(e) => setAchSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/10 text-[11px] outline-none"
                      />
                    </div>
                    <div className="flex-grow overflow-y-auto pr-1 space-y-1.5 custom-scrollbar min-h-0">
                      {filteredAchievements.map((a) => (
                        <label
                          key={a.id}
                          className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${formData.achievement_ids.includes(a.id!) ? "bg-primary/5 border-primary/20" : "bg-surface-container-low border-transparent hover:border-outline-variant/20"}`}
                        >
                          <input
                            type="checkbox"
                            hidden
                            checked={formData.achievement_ids.includes(a.id!)}
                            onChange={() => toggleAchievement(a.id!)}
                          />
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center transition-all ${formData.achievement_ids.includes(a.id!) ? "bg-primary text-on-primary" : "border border-outline-variant/30"}`}
                          >
                            {formData.achievement_ids.includes(a.id!) && (
                              <span className="material-symbols-outlined text-[10px] font-bold">
                                check
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-medium truncate">
                            {a.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="space-y-4">
                <p className="text-xs text-on-surface-variant italic">
                  Gallery management feature is coming soon in MVP phase 2. You
                  can upload photos via the main description for now if needed.
                </p>
              </div>
            )}
          </div>
          <div className="pt-6 border-t border-outline-variant/20 flex gap-4 shrink-0">
            {activeTab !== "general" && (
              <button
                type="button"
                onClick={() => {
                  const tabs = [
                    "general",
                    "activities",
                    "relations",
                    "gallery",
                  ];
                  const currentIndex = tabs.indexOf(activeTab);
                  setActiveTab(tabs[currentIndex - 1] as any);
                }}
                className="px-6 py-3 rounded-xl bg-surface-container-high text-on-surface text-sm font-medium hover:bg-surface-container-highest transition-all"
              >
                Back
              </button>
            )}

            {activeTab !== "gallery" ? (
              <button
                type="button"
                onClick={() => {
                  const tabs = [
                    "general",
                    "activities",
                    "relations",
                    "gallery",
                  ];
                  const currentIndex = tabs.indexOf(activeTab);
                  setActiveTab(tabs[currentIndex + 1] as any);
                }}
                className="flex-grow py-3 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-all"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading || slugStatus.available === false}
                className="flex-grow py-4 rounded-2xl bg-primary text-white font-label font-medium tracking-wide shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isLoading
                  ? "Saving..."
                  : editingEducation
                    ? "Update Education"
                    : "Create Education"}
              </button>
            )}
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
