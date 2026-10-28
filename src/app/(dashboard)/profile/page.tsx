"use client";

import Link from "next/link";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import {
  type CandidateProfile,
  getCandidateProfile,
  updateCandidateProfile,
  uploadCandidateResume,
} from "@/api/auth.api";

type ProfileForm = {
  name: string;
  skills: string;
  experience: string;
  education: string;
  phone: string;
  dateOfBirth: string;
  gender: "" | "MALE" | "FEMALE" | "OTHER";
  address: string;
};

const emptyForm: ProfileForm = {
  name: "",
  skills: "",
  experience: "",
  education: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  address: "",
};

export default function CandidateProfilePage() {
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    getCandidateProfile()
      .then(({ data }) => {
        setProfile(data);
        setForm({
          name: data.name ?? "",
          skills: data.skills?.join(", ") ?? "",
          experience: data.experience ?? "",
          education: data.education ?? "",
          phone: data.phone ?? "",
          dateOfBirth: data.dateOfBirth?.slice(0, 10) ?? "",
          gender: data.gender ?? "",
          address: data.address ?? "",
        });
      })
      .catch((error) =>
        setMessage(
          error instanceof Error ? error.message : "Could not load profile",
        ),
      );
  }, []);

  function updateField(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    try {
      const { data } = await updateCandidateProfile({
        name: form.name,
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        experience: form.experience || null,
        education: form.education || null,
        phone: form.phone || null,
        dateOfBirth: form.dateOfBirth || null,
        gender: form.gender || null,
        address: form.address || null,
      });
      setProfile(data);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not update profile",
      );
    } finally {
      setPending(false);
    }
  }

  async function uploadResume(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" || file.size > 5 * 1024 * 1024) {
      setMessage("Please select a PDF resume smaller than 5 MB.");
      return;
    }
    setPending(true);
    setMessage("");
    try {
      const { data } = await uploadCandidateResume(file);
      setProfile(data);
      setMessage("Resume uploaded successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not upload resume",
      );
    } finally {
      setPending(false);
      event.target.value = "";
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/dashboard"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to dashboard
      </Link>
      <h1 className="mt-5 text-4xl font-semibold">Candidate profile</h1>
      <p className="mt-2 text-muted-foreground">
        Keep your profile and resume ready for recruiter invitations.
      </p>
      {message && (
        <p className="mt-6 rounded-lg border bg-muted/50 p-4 text-sm">
          {message}
        </p>
      )}
      <form
        onSubmit={save}
        className="mt-8 grid gap-5 rounded-2xl border bg-card p-6 md:grid-cols-2"
      >
        <label className="text-sm">
          Full name
          <input
            name="name"
            required
            value={form.name}
            onChange={updateField}
            className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
          />
        </label>
        <label className="text-sm">
          Phone
          <input
            name="phone"
            value={form.phone}
            onChange={updateField}
            placeholder="+880..."
            className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
          />
        </label>
        <label className="text-sm md:col-span-2">
          Skills{" "}
          <span className="text-muted-foreground">(comma separated)</span>
          <input
            name="skills"
            value={form.skills}
            onChange={updateField}
            className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
          />
        </label>
        <label className="text-sm">
          Date of birth
          <input
            name="dateOfBirth"
            type="date"
            value={form.dateOfBirth}
            onChange={updateField}
            className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
          />
        </label>
        <label className="text-sm">
          Gender
          <select
            name="gender"
            value={form.gender}
            onChange={updateField}
            className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
          >
            <option value="">Prefer not to say</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
        <label className="text-sm md:col-span-2">
          Address
          <textarea
            name="address"
            value={form.address}
            onChange={updateField}
            className="mt-2 min-h-20 w-full rounded-lg border bg-background p-3"
          />
        </label>
        <label className="text-sm md:col-span-2">
          Education
          <textarea
            name="education"
            value={form.education}
            onChange={updateField}
            className="mt-2 min-h-24 w-full rounded-lg border bg-background p-3"
          />
        </label>
        <label className="text-sm md:col-span-2">
          Experience
          <textarea
            name="experience"
            value={form.experience}
            onChange={updateField}
            className="mt-2 min-h-24 w-full rounded-lg border bg-background p-3"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-lg bg-primary font-medium text-primary-foreground disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save profile"}
        </button>
        <label className="flex h-11 cursor-pointer items-center justify-center rounded-lg border text-sm hover:bg-muted">
          <span>
            {profile?.resumeUrl ? "Replace resume" : "Upload PDF resume"}
          </span>
          <input
            type="file"
            accept="application/pdf"
            onChange={uploadResume}
            className="sr-only"
          />
        </label>
      </form>
    </main>
  );
}
