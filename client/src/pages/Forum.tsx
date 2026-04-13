import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import { GlassCard } from "../components/ui/GlassCard";
import { GlowButton } from "../components/ui/GlowButton";
import { GlowInput } from "../components/ui/GlowInput";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useAuthStore } from "../store/auth";

type Company = {
  id: string;
  name: string;
  package?: string;
};

type Question = {
  id: string;
  companyId: string;
  content: string;
  round: string;
  year: number;
  isPremium: boolean;
  creditsToUnlock: number;
};

export function ForumPage() {
  const token = useAuthStore((s) => s.accessToken);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [content, setContent] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [round, setRound] = useState("Technical");
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("");
  const [message, setMessage] = useState("");

  const loadCompanies = async () => {
    try {
      const data = await apiRequest<Company[]>("/companies");
      setCompanies(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load companies.");
    }
  };

  const loadQuestions = async (filter?: string) => {
    try {
      let url = "/questions";
      if (filter) {
        url += `?companyId=${encodeURIComponent(filter)}`;
      }
      const data = await apiRequest<Question[]>(url);
      setQuestions(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load questions.");
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await loadCompanies();
      await loadQuestions();
    };
    initializeData().catch((error) => {
      setMessage(error instanceof Error ? error.message : "Failed to initialize forum.");
    });
  }, []);

  const handleFilterByCompany = (cId: string) => {
    setSelectedCompanyFilter(cId);
    loadQuestions(cId);
  };

  const submitQuestion = async () => {
    if (!token) {
      setMessage("Login required.");
      return;
    }
    if (!companyId) {
      setMessage("Please select a company.");
      return;
    }
    if (!content.trim()) {
      setMessage("Question content is required.");
      return;
    }

    try {
      await apiRequest("/questions", {
        method: "POST",
        authToken: token,
        body: JSON.stringify({
          companyId,
          content,
          round,
          year: Number(year),
        }),
      });
      setContent("");
      setCompanyId("");
      setMessage("Question posted successfully!");
      loadQuestions(selectedCompanyFilter);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not post question.");
    }
  };

  const filteredCompany = companies.find((c) => c.id === selectedCompanyFilter);

  return (
    <PageWrapper title="Interview Forum" subtitle="Community Q&A across companies and rounds.">
      <div className="space-y-6">
        {/* Post Question Section */}
        <GlassCard className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-100">Post a Question</h3>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Company</label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-400/60"
            >
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Round</label>
              <GlowInput
                value={round}
                onChange={(e) => setRound(e.target.value)}
                placeholder="e.g., Technical, HR"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Year</label>
              <GlowInput
                value={String(year)}
                onChange={(e) => setYear(Number(e.target.value))}
                type="number"
                placeholder="Year"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Question</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe the question you want to ask..."
              className="w-full bg-indigo-950/50 border border-indigo-400/30 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-400/60 resize-none"
              rows={4}
            />
          </div>
          <GlowButton
            type="button"
            onClick={submitQuestion}
            disabled={!token}
            className="w-full md:w-auto"
          >
            {!token ? "Login to Post" : "Post Question"}
          </GlowButton>
          {message && (
            <p
              className={`text-sm ${
                message.includes("success") || message.includes("posted")
                  ? "text-emerald-300 bg-emerald-500/10"
                  : "text-rose-300 bg-rose-500/10"
              } p-3 rounded-lg`}
            >
              {message}
            </p>
          )}
        </GlassCard>

        {/* Filter Section */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-200">Filter by Company:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterByCompany("")}
              className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                selectedCompanyFilter === ""
                  ? "border-indigo-400/50 bg-indigo-500/20 text-indigo-100"
                  : "border-white/20 bg-black/20 text-slate-300 hover:border-indigo-400/30"
              } border`}
            >
              All Companies
            </button>
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => handleFilterByCompany(company.id)}
                className={`rounded-lg px-3 py-1.5 text-xs transition-colors border ${
                  selectedCompanyFilter === company.id
                    ? "border-indigo-400/50 bg-indigo-500/20 text-indigo-100"
                    : "border-white/20 bg-black/20 text-slate-300 hover:border-indigo-400/30"
                }`}
              >
                {company.name}
              </button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-3">
          {filteredCompany && (
            <p className="text-sm text-slate-400">
              Showing questions for <span className="text-slate-200 font-medium">{filteredCompany.name}</span>
            </p>
          )}
          {questions.length > 0 ? (
            questions.map((question) => (
              <GlassCard key={question.id} className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-slate-100 flex-1">{question.content}</p>
                  {question.isPremium && (
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded whitespace-nowrap">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {question.round} • {question.year}
                  {question.isPremium && ` • ${question.creditsToUnlock} credits`}
                </p>
              </GlassCard>
            ))
          ) : (
            <p className="text-sm text-slate-400">
              {selectedCompanyFilter
                ? "No questions found for this company."
                : "No questions posted yet."}
            </p>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

