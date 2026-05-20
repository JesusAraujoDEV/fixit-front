import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

// ─── Country data ───
interface Country {
  code: string;
  name: string;
  dial: string;
  flag: string;
  operators?: string[];
}

const COUNTRIES: Country[] = [
  { code: "VE", name: "Venezuela", dial: "+58", flag: "🇻🇪", operators: ["412", "414", "416", "424", "422", "426"] },
  { code: "CO", name: "Colombia", dial: "+57", flag: "🇨🇴" },
  { code: "MX", name: "México", dial: "+52", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", dial: "+54", flag: "🇦🇷" },
  { code: "CL", name: "Chile", dial: "+56", flag: "🇨🇱" },
  { code: "PE", name: "Perú", dial: "+51", flag: "🇵🇪" },
  { code: "EC", name: "Ecuador", dial: "+593", flag: "🇪🇨" },
  { code: "BR", name: "Brasil", dial: "+55", flag: "🇧🇷" },
  { code: "US", name: "Estados Unidos", dial: "+1", flag: "🇺🇸" },
  { code: "ES", name: "España", dial: "+34", flag: "🇪🇸" },
  { code: "PA", name: "Panamá", dial: "+507", flag: "🇵🇦" },
  { code: "DO", name: "Rep. Dominicana", dial: "+1", flag: "🇩🇴" },
  { code: "CR", name: "Costa Rica", dial: "+506", flag: "🇨🇷" },
  { code: "UY", name: "Uruguay", dial: "+598", flag: "🇺🇾" },
  { code: "BO", name: "Bolivia", dial: "+591", flag: "🇧🇴" },
  { code: "PY", name: "Paraguay", dial: "+595", flag: "🇵🇾" },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function PhoneInput({ value, onChange, className }: PhoneInputProps) {
  const [country, setCountry] = useState<Country>(COUNTRIES[0]); // Venezuela default
  const [operator, setOperator] = useState<string>("");
  const [localNumber, setLocalNumber] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showOperatorDropdown, setShowOperatorDropdown] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);
  const operatorRef = useRef<HTMLDivElement>(null);

  // Parse initial value
  useEffect(() => {
    if (!value) return;
    // Try to parse existing value like "58 4244165446" or "+58 412 1234567"
    const cleaned = value.replace(/[^0-9]/g, "");
    const matchedCountry = COUNTRIES.find((c) => cleaned.startsWith(c.dial.replace("+", "")));
    if (matchedCountry) {
      setCountry(matchedCountry);
      const rest = cleaned.slice(matchedCountry.dial.replace("+", "").length);
      if (matchedCountry.operators) {
        const matchedOp = matchedCountry.operators.find((op) => rest.startsWith(op));
        if (matchedOp) {
          setOperator(matchedOp);
          setLocalNumber(rest.slice(matchedOp.length));
          return;
        }
      }
      setLocalNumber(rest);
    }
  }, []); // Only on mount

  // Emit combined value whenever parts change
  useEffect(() => {
    const dialDigits = country.dial.replace("+", "");
    const full = `${dialDigits}${operator}${localNumber}`;
    onChange(full);
  }, [country, operator, localNumber]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setShowCountryDropdown(false);
      }
      if (operatorRef.current && !operatorRef.current.contains(e.target as Node)) {
        setShowOperatorDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const hasOperators = country.operators && country.operators.length > 0;

  return (
    <div className={cn("flex items-center gap-0", className)}>
      {/* Country selector */}
      <div className="relative" ref={countryRef}>
        <button
          type="button"
          onClick={() => { setShowCountryDropdown((p) => !p); setShowOperatorDropdown(false); }}
          className="h-11 px-2.5 rounded-l-lg bg-white/5 border border-white/10 border-r-0 text-white text-sm flex items-center gap-1 hover:bg-white/[0.07] transition-all outline-none focus:border-primary/50"
        >
          <span className="text-base leading-none">{country.flag}</span>
          <span className="text-xs text-white/70 font-medium">{country.dial}</span>
          <ChevronDown className="w-3 h-3 text-white/40" />
        </button>

        {showCountryDropdown && (
          <div className="absolute top-12 left-0 z-50 w-56 max-h-60 overflow-y-auto rounded-lg bg-[#1c2128] border border-white/10 shadow-elevated">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  setCountry(c);
                  setOperator("");
                  setShowCountryDropdown(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-white/5 transition-colors",
                  c.code === country.code ? "bg-primary/10 text-primary" : "text-white/80"
                )}
              >
                <span className="text-base">{c.flag}</span>
                <span className="flex-1 truncate">{c.name}</span>
                <span className="text-xs text-white/40 font-mono">{c.dial}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Operator selector (Venezuela only) */}
      {hasOperators && (
        <div className="relative" ref={operatorRef}>
          <button
            type="button"
            onClick={() => { setShowOperatorDropdown((p) => !p); setShowCountryDropdown(false); }}
            className="h-11 px-2.5 bg-white/5 border border-white/10 border-r-0 text-white text-sm flex items-center gap-1 hover:bg-white/[0.07] transition-all outline-none focus:border-primary/50"
          >
            <span className="text-xs font-medium text-white/70 min-w-[24px]">
              {operator || "---"}
            </span>
            <ChevronDown className="w-3 h-3 text-white/40" />
          </button>

          {showOperatorDropdown && (
            <div className="absolute top-12 left-0 z-50 w-36 rounded-lg bg-[#1c2128] border border-white/10 shadow-elevated">
              {country.operators!.map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => {
                    setOperator(op);
                    setShowOperatorDropdown(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-white/5 transition-colors",
                    op === operator ? "bg-primary/10 text-primary" : "text-white/80"
                  )}
                >
                  <span className="font-mono text-xs">{country.dial} {op}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Number input */}
      <input
        type="tel"
        value={localNumber}
        onChange={(e) => {
          // Only allow digits
          const digits = e.target.value.replace(/[^0-9]/g, "");
          setLocalNumber(digits.slice(0, 7));
        }}
        placeholder={hasOperators ? "1234567" : "Número"}
        autoComplete="tel"
        className={cn(
          "flex-1 h-11 px-3 bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all",
          hasOperators ? "rounded-r-lg" : "rounded-r-lg"
        )}
      />
    </div>
  );
}
