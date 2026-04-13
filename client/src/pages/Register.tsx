import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { GlassCard } from "../components/ui/GlassCard";
import { GlowButton } from "../components/ui/GlowButton";
import { GlowInput } from "../components/ui/GlowInput";
import { StepIndicator } from "../components/ui/StepIndicator";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useAuthStore, type AuthUser } from "../store/auth";
import { PageTransition } from "../components/layout/PageTransition";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  college: z.string().min(2),
  course: z.string().min(2),
  branch: z.string().min(2),
  year: z.number().int().min(1).max(5),
  gpa: z.number().min(0).max(10),
  targetRoles: z.array(z.string()).min(1),
  languages: z.array(z.string()).min(1),
  strongConcepts: z.array(z.string()).min(1),
  githubUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  leetcodeUrl: z.string().url().optional().or(z.literal("")),
});

type RegisterValues = z.infer<typeof registerSchema>;

// Step 2 options (engineering-focused)
const courses = [
  "B.Tech (Computer Science)",
  "B.Tech (Information Technology)",
  "B.Tech (AI/ML)",
  "B.Tech (Electronics & Communication)",
  "B.Tech (Electrical Engineering)",
  "BCA",
  "M.Tech",
  "Other",
];

const branches = [
  "CSE",
  "IT",
  "AIML",
  "ECE",
  "EEE",
  "Mechanical",
  "Civil",
  "Other",
];

const years = [1, 2, 3, 4, 5];

// Step 3 options
const roles = ["SWE", "Data Analyst", "DevOps", "ML Engineer", "Frontend Dev", "Other"];
const languages = ["Python", "Java", "C++", "JavaScript", "Go", "Other"];
const concepts = ["DSA", "DBMS", "OS", "CN", "System Design", "ML", "Other"];

export function RegisterPage() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string>("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const [customRole, setCustomRole] = useState("");
  const [customLanguage, setCustomLanguage] = useState("");
  const [customConcept, setCustomConcept] = useState("");
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const { register, handleSubmit, setValue, trigger } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      targetRoles: [],
      languages: [],
      strongConcepts: [],
      githubUrl: "",
      linkedinUrl: "",
      leetcodeUrl: "",
    },
  });

  const toggleRoles = (value: string) => {
    const next = selectedRoles.includes(value)
      ? selectedRoles.filter((item) => item !== value)
      : [...selectedRoles, value];
    setSelectedRoles(next);
    setValue("targetRoles", next);
  };

  const goToNextStep = async () => {
    const fieldsByStep: Record<number, Array<keyof RegisterValues>> = {
      1: ["name", "email", "password", "college"],
      2: ["course", "branch", "year", "gpa"],
      3: ["targetRoles", "languages", "strongConcepts"],
    };
    const fieldsToValidate = fieldsByStep[step];
    if (!fieldsToValidate) {
      return;
    }
    const isValid = await trigger(fieldsToValidate);
    if (!isValid) {
      setError("Please complete all required fields in this step.");
      return;
    }
    setError("");
    setStep((prev) => Math.min(4, prev + 1));
  };

  const toggleLanguages = (value: string) => {
    const next = selectedLanguages.includes(value)
      ? selectedLanguages.filter((item) => item !== value)
      : [...selectedLanguages, value];
    setSelectedLanguages(next);
    setValue("languages", next);
  };

  const toggleConcepts = (value: string) => {
    const next = selectedConcepts.includes(value)
      ? selectedConcepts.filter((item) => item !== value)
      : [...selectedConcepts, value];
    setSelectedConcepts(next);
    setValue("strongConcepts", next);
  };

  const addCustomRole = () => {
    const trimmed = customRole.trim();
    if (!trimmed || selectedRoles.includes(trimmed)) return;
    const next = [...selectedRoles, trimmed];
    setSelectedRoles(next);
    setValue("targetRoles", next);
    setCustomRole("");
  };

  const addCustomLanguage = () => {
    const trimmed = customLanguage.trim();
    if (!trimmed || selectedLanguages.includes(trimmed)) return;
    const next = [...selectedLanguages, trimmed];
    setSelectedLanguages(next);
    setValue("languages", next);
    setCustomLanguage("");
  };

  const addCustomConcept = () => {
    const trimmed = customConcept.trim();
    if (!trimmed || selectedConcepts.includes(trimmed)) return;
    const next = [...selectedConcepts, trimmed];
    setSelectedConcepts(next);
    setValue("strongConcepts", next);
    setCustomConcept("");
  };

  const onSubmit = async (values: RegisterValues) => {
    setError("");
    try {
      const payload = {
        ...values,
        githubUrl: values.githubUrl || undefined,
        linkedinUrl: values.linkedinUrl || undefined,
        leetcodeUrl: values.leetcodeUrl || undefined,
      };
      const result = await apiRequest<{ user: AuthUser; accessToken: string; refreshToken: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      // Ensure proper payload structure for setAuth
      setAuth({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      });
      navigate("/assessment");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed. Please try again.");
    }
  };

  return (
    <PageTransition>
      <PageWrapper title="Register" subtitle="Complete onboarding in 4 guided steps."> 
      <GlassCard>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <StepIndicator step={step} total={4} />

          {step === 1 ? (
            <div className="grid gap-3 md:grid-cols-2">
              <GlowInput {...register("name")} placeholder="Full Name" />
              <GlowInput {...register("email")} type="email" placeholder="Email" />
              <GlowInput {...register("password")} type="password" placeholder="Password" />
              <GlowInput {...register("phone")} placeholder="Phone" />
              <GlowInput className="md:col-span-2" {...register("college")} placeholder="College Name" />
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Course</label>
                <select
                  {...register("course")}
                  className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-400/60 text-sm"
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Branch</label>
                <select
                  {...register("branch")}
                  className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-400/60 text-sm"
                >
                  <option value="">Select Branch</option>
                  {branches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Year</label>
                <select
                  {...register("year", { valueAsNumber: true })}
                  className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-400/60 text-sm"
                >
                  <option value="">Select Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      Year {y}
                    </option>
                  ))}
                </select>
              </div>
              <GlowInput
                {...register("gpa", { valueAsNumber: true })}
                type="number"
                step="0.01"
                placeholder="GPA / CGPA"
              />
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <SelectionGroup
                title="Target Roles"
                values={selectedRoles.filter((v) => v !== "Other") || []}
                options={roles.filter((r) => r !== "Other")}
                onToggle={toggleRoles}
              />
              {selectedRoles.includes("Other") && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">Add custom role</p>
                  <div className="flex gap-2">
                    <GlowInput
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      placeholder="Enter custom role"
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={addCustomRole}
                      className="rounded-lg border border-indigo-400/50 bg-indigo-500/20 px-3 py-2 text-xs text-indigo-100 hover:bg-indigo-500/30"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedRoles.filter((v) => v !== "Other").map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      const next = selectedRoles.filter((r) => r !== role);
                      setSelectedRoles(next);
                      setValue("targetRoles", next);
                    }}
                    className="rounded-lg border border-indigo-400/50 bg-indigo-500/20 px-3 py-1.5 text-xs text-indigo-100 cursor-pointer flex items-center gap-1"
                  >
                    {role}
                    <span className="text-indigo-300">×</span>
                  </button>
                ))}
                {!selectedRoles.includes("Other") && (
                  <button
                    type="button"
                    onClick={() => toggleRoles("Other")}
                    className="rounded-lg border border-white/20 bg-black/20 px-3 py-1.5 text-xs text-slate-300"
                  >
                    Other
                  </button>
                )}
              </div>

              <SelectionGroup
                title="Languages"
                values={selectedLanguages.filter((v) => v !== "Other") || []}
                options={languages.filter((l) => l !== "Other")}
                onToggle={toggleLanguages}
              />
              {selectedLanguages.includes("Other") && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">Add custom language</p>
                  <div className="flex gap-2">
                    <GlowInput
                      value={customLanguage}
                      onChange={(e) => setCustomLanguage(e.target.value)}
                      placeholder="Enter custom language"
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={addCustomLanguage}
                      className="rounded-lg border border-indigo-400/50 bg-indigo-500/20 px-3 py-2 text-xs text-indigo-100 hover:bg-indigo-500/30"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedLanguages.filter((v) => v !== "Other").map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      const next = selectedLanguages.filter((l) => l !== lang);
                      setSelectedLanguages(next);
                      setValue("languages", next);
                    }}
                    className="rounded-lg border border-indigo-400/50 bg-indigo-500/20 px-3 py-1.5 text-xs text-indigo-100 cursor-pointer flex items-center gap-1"
                  >
                    {lang}
                    <span className="text-indigo-300">×</span>
                  </button>
                ))}
                {!selectedLanguages.includes("Other") && (
                  <button
                    type="button"
                    onClick={() => toggleLanguages("Other")}
                    className="rounded-lg border border-white/20 bg-black/20 px-3 py-1.5 text-xs text-slate-300"
                  >
                    Other
                  </button>
                )}
              </div>

              <SelectionGroup
                title="Strong Concepts"
                values={selectedConcepts.filter((v) => v !== "Other") || []}
                options={concepts.filter((c) => c !== "Other")}
                onToggle={toggleConcepts}
              />
              {selectedConcepts.includes("Other") && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">Add custom concept</p>
                  <div className="flex gap-2">
                    <GlowInput
                      value={customConcept}
                      onChange={(e) => setCustomConcept(e.target.value)}
                      placeholder="Enter custom concept"
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={addCustomConcept}
                      className="rounded-lg border border-indigo-400/50 bg-indigo-500/20 px-3 py-2 text-xs text-indigo-100 hover:bg-indigo-500/30"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedConcepts.filter((v) => v !== "Other").map((concept) => (
                  <button
                    key={concept}
                    type="button"
                    onClick={() => {
                      const next = selectedConcepts.filter((c) => c !== concept);
                      setSelectedConcepts(next);
                      setValue("strongConcepts", next);
                    }}
                    className="rounded-lg border border-indigo-400/50 bg-indigo-500/20 px-3 py-1.5 text-xs text-indigo-100 cursor-pointer flex items-center gap-1"
                  >
                    {concept}
                    <span className="text-indigo-300">×</span>
                  </button>
                ))}
                {!selectedConcepts.includes("Other") && (
                  <button
                    type="button"
                    onClick={() => toggleConcepts("Other")}
                    className="rounded-lg border border-white/20 bg-black/20 px-3 py-1.5 text-xs text-slate-300"
                  >
                    Other
                  </button>
                )}
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="grid gap-3 md:grid-cols-3">
              <GlowInput {...register("githubUrl")} placeholder="GitHub URL" />
              <GlowInput {...register("linkedinUrl")} placeholder="LinkedIn URL" />
              <GlowInput {...register("leetcodeUrl")} placeholder="LeetCode URL" />
            </div>
          ) : null}

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <div className="flex items-center gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm text-slate-100"
              >
                Back
              </button>
            ) : null}

            {step < 4 ? (
              <GlowButton type="button" onClick={goToNextStep}>
                Next
              </GlowButton>
            ) : (
              <GlowButton type="submit">Create Account</GlowButton>
            )}
          </div>
        </form>
      </GlassCard>
    </PageWrapper>
    </PageTransition>
  );
}

function SelectionGroup({
  title,
  options,
  values,
  onToggle,
}: {
  title: string;
  options: string[];
  values: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-200">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = values.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`rounded-lg border px-3 py-1.5 text-xs ${
                selected
                  ? "border-indigo-400/50 bg-indigo-500/20 text-indigo-100"
                  : "border-white/20 bg-black/20 text-slate-300"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

