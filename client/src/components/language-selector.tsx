import { useState } from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { languages, getLanguageName } from "@/lib/i18n";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
}

export default function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2" data-testid="button-language-selector">
          <Languages size={16} />
          {getLanguageName(selectedLanguage)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          <h4 className="font-semibold text-sm mb-3">Select Language</h4>
          <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto custom-scrollbar">
            {languages.map((lang) => (
              <Badge
                key={lang.code}
                variant={selectedLanguage === lang.code ? "default" : "outline"}
                className="cursor-pointer justify-center py-2 hover:bg-primary/10"
                onClick={() => {
                  onLanguageChange(lang.code);
                  setOpen(false);
                }}
                data-testid={`language-option-${lang.code}`}
              >
                {lang.native}
              </Badge>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
