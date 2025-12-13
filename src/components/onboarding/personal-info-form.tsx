"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Github,
  Linkedin,
  Instagram,
  User,
  Calendar,
  MapPin,
} from "lucide-react";

export interface PersonalInfoData {
  fullName: string;
  birthDate: string;
  city: string;
  socials: {
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
}

interface PersonalInfoFormProps {
  onComplete: (data: PersonalInfoData) => void;
}

export function PersonalInfoForm({ onComplete }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState<PersonalInfoData>({
    fullName: "",
    birthDate: "",
    city: "",
    socials: {
      linkedin: "",
      github: "",
      instagram: "",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("social_")) {
      const socialKey = name.replace(
        "social_",
        ""
      ) as keyof typeof formData.socials;
      setFormData((prev) => ({
        ...prev,
        socials: {
          ...prev.socials,
          [socialKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.birthDate || !formData.city) {
      alert("Per favore compila tutti i campi obbligatori.");
      return;
    }
    onComplete(formData);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-light text-white">Chi sei?</h1>
        <p className="text-gray-400">Raccontaci qualcosa di te per iniziare.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-gray-300">
              Nome e Cognome <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="fullName"
                name="fullName"
                placeholder="Mario Rossi"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="pl-9 bg-gray-900/50 border-gray-800 text-white focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="text-gray-300">
              Data di nascita <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                required
                value={formData.birthDate}
                onChange={handleChange}
                className="pl-9 bg-gray-900/50 border-gray-800 text-white focus:ring-purple-500 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city" className="text-gray-300">
              Comune di residenza <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="city"
                name="city"
                placeholder="Roma"
                required
                value={formData.city}
                onChange={handleChange}
                className="pl-9 bg-gray-900/50 border-gray-800 text-white focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="pt-4 pb-2 border-b border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest">
              Profili Social
            </h3>
          </div>

          {/* LinkedIn */}
          <div className="space-y-2">
            <Label htmlFor="social_linkedin" className="text-gray-300">
              LinkedIn
            </Label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="social_linkedin"
                name="social_linkedin"
                placeholder="https://linkedin.com/in/..."
                value={formData.socials.linkedin}
                onChange={handleChange}
                className="pl-9 bg-gray-900/50 border-gray-800 text-white focus:ring-purple-500"
              />
            </div>
          </div>

          {/* GitHub */}
          <div className="space-y-2">
            <Label htmlFor="social_github" className="text-gray-300">
              GitHub
            </Label>
            <div className="relative">
              <Github className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="social_github"
                name="social_github"
                placeholder="https://github.com/..."
                value={formData.socials.github}
                onChange={handleChange}
                className="pl-9 bg-gray-900/50 border-gray-800 text-white focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Instagram */}
          <div className="space-y-2">
            <Label htmlFor="social_instagram" className="text-gray-300">
              Instagram
            </Label>
            <div className="relative">
              <Instagram className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="social_instagram"
                name="social_instagram"
                placeholder="https://instagram.com/..."
                value={formData.socials.instagram}
                onChange={handleChange}
                className="pl-9 bg-gray-900/50 border-gray-800 text-white focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-white text-black hover:bg-gray-200 h-12 text-lg"
        >
          Continua <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}
