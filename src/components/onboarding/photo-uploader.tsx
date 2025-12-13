"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Image as ImageIcon, Check, SkipForward } from "lucide-react";
import Image from "next/image";

interface PhotoUploaderProps {
  onPhotoSelected: (file: File) => void;
  onSkip: () => void;
}

export function PhotoUploader({ onPhotoSelected, onSkip }: PhotoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      // Clean up object URL on unmount (not strictly needed for small apps but good practice)
    }
  };

  const handleConfirm = () => {
    if (file) {
      onPhotoSelected(file);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-center text-xl font-light">
          Scegli il tuo Avatar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col items-center">
        <div
          className="w-48 h-48 rounded-full bg-gray-900 border-2 border-dashed border-gray-700 flex items-center justify-center relative overflow-hidden cursor-pointer hover:border-gray-500 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          {preview ? (
            <Image
              src={preview}
              alt="Avatar preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <ImageIcon className="w-12 h-12 mb-2" />
              <span className="text-sm">Clicca per caricare</span>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        {preview ? (
          <Button
            onClick={handleConfirm}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Check className="mr-2 h-4 w-4" /> Va bene così
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={onSkip}
            className="text-gray-500 hover:text-white hover:bg-transparent"
          >
            <SkipForward className="mr-2 h-4 w-4" /> Salta
          </Button>
        )}

        <p className="text-xs text-center text-gray-500 max-w-xs">
          Carica una foto ritratto chiara. La useremo per generare il tuo avatar
          2D animato.
        </p>
      </CardContent>
    </Card>
  );
}
