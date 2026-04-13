import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../lib/api";
import { GlassCard } from "../components/ui/GlassCard";
import { GlowButton } from "../components/ui/GlowButton";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useAuthStore } from "../store/auth";
import clsx from "clsx";

type CompanyDetail = {
  id: string;
  name: string;
  description: string | null;
  package: string | null;
  bundlePrice: number;
  bundleStatus: "locked" | "unlocked";
  isUnlocked: boolean;
  eligibleBranches: string[];
  requiredSkills: string[];
  questions: Array<{
    id: string;
    content: string;
    round: string;
    year: number;
    isPremium: boolean;
    creditsToUnlock: number;
    answers?: Array<{ content: string }>;
  }>;
};

export function CompanyDetailPage() {
  const token = useAuthStore(s => s.accessToken);
  const user = useAuthStore((s) => s.user);
  
  const setUser = useAuthStore((s) => s.setUser);

  const { id } = useParams();
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "qa" | "prep">("overview");
  const [unlockedAnswers, setUnlockedAnswers] = useState<Record<string, string>>({});
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  const [unlockedBundle, setUnlockedBundle] = useState(false);
  const [unlockingBundle, setUnlockingBundle] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    const options: any = {};
    if (token) options.authToken = token;

    apiRequest<CompanyDetail>(`/companies/${id}`, options)
      .then((data) => {
        setCompany(data);
        setUnlockedBundle(data.isUnlocked);
        const existingUnlocks: Record<string, string> = {};
        for (const q of data.questions) {
          if (q.answers && q.answers.length > 0) {
            existingUnlocks[q.id] = q.answers[0].content;
          }
        }
        setUnlockedAnswers(existingUnlocks);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load company."));
  }, [id, token]);

  const handleUnlock = async (questionId: string) => {
    if (!token || !user) {
      alert("Please sign in to unlock premium answers.");
      return;
    }
    setUnlockingId(questionId);
    try {
      const result = await apiRequest<{ unlockedAnswer: string; creditsSpent: number; remainingCredits?: number | null }>(
        `/questions/${questionId}/unlock`,
        {
        method: "POST",
        authToken: token,
      });
      setUnlockedAnswers((prev) => ({ ...prev, [questionId]: result.unlockedAnswer }));
      if (typeof result.remainingCredits === "number") {
        setUser({ ...user, credits: result.remainingCredits });
      } else if (result.creditsSpent > 0) {
        setUser({ ...user, credits: user.credits - result.creditsSpent });
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Unlock failed");
    } finally {
      setUnlockingId(null);
    }
  };

  const handleBundleUnlock = async () => {
    if (!id || !token || !user || !company) {
      alert("Please sign in to unlock bundle.");
      return;
    }
    setUnlockingBundle(true);
    try {
      const result = await apiRequest<{ message: string; creditsSpent: number; remainingCredits: number }>(
        `/companies/${id}/unlock-bundle`,
        {
          method: "POST",
          authToken: token,
        }
      );
      setUnlockedBundle(true);
      setUser({ ...user, credits: result.remainingCredits });
      alert(result.message);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Unlock failed");
    } finally {
      setUnlockingBundle(false);
    }
  };

  return (
    <PageWrapper title={company?.name ?? "Company Detail"} subtitle={`Company ID: ${id ?? "unknown"}`}>
      {company ? (
        <div className="space-y-6">
          <div className="flex gap-4 border-b border-white/10 pb-2">
            {(["overview", "qa", "prep"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "px-4 py-2 text-sm font-medium capitalize outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500",
                  activeTab === tab ? "border-b-2 border-indigo-400 text-indigo-400" : "text-slate-400 hover:text-slate-200"
                )}
              >
                {tab === "qa" ? "Interview Q&A" : tab === "prep" ? "Preparation" : "Overview"}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <GlassCard className="space-y-4">
              <p className="text-slate-300">{company.description ?? "No description yet."}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Package</p>
                  <p className="font-medium text-slate-200">{company.package ?? "TBD"}</p>
                </div>
                <div>
                  <p className="text-slate-500">Eligible Branches</p>
                  <p className="font-medium text-slate-200">{company.eligibleBranches.join(", ") || "All"}</p>
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm text-slate-500">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {company.requiredSkills.map((skill) => (
                    <span key={skill} className="rounded border border-indigo-500/30 bg-indigo-500/10 px-2 py-1 text-xs text-indigo-300">
                      {skill}
                    </span>
                  ))}
                  {!company.requiredSkills.length && <span className="text-xs text-slate-400">None specified</span>}
                </div>
              </div>
              
              {/* Bundle Status Section */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-slate-200">Question Bundle</h4>
                    <p className="text-sm text-slate-400">
                      {unlockedBundle ? (
                        <span className="text-emerald-400">✓ Unlocked</span>
                      ) : (
                        <>Unlock {company.questions.length} questions for <span className="font-medium text-yellow-400">{company.bundlePrice} credits</span></>
                      )}
                    </p>
                  </div>
                  {!unlockedBundle && (
                    <GlowButton
                      type="button"
                      onClick={handleBundleUnlock}
                      disabled={unlockingBundle || !token}
                    >
                      {unlockingBundle ? "Unlocking..." : `Unlock (${company.bundlePrice} Credits)`}
                    </GlowButton>
                  )}
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === "qa" && (
            <div className="space-y-3">
              {!unlockedBundle && (
                <GlassCard className="border-l-4 border-yellow-500 bg-yellow-500/5 text-yellow-200">
                  <p className="text-sm">
                    <span className="font-medium">Bundle Locked:</span> Unlock the full question bundle to see all interview questions for {company.name}.
                  </p>
                </GlassCard>
              )}
              {company.questions.map((q) => (
                <GlassCard key={q.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <p className="text-slate-100">{q.content}</p>
                      {/* Premium answers section or locked bundle message */}
                      <div className={clsx(
                        "mt-3 rounded border border-white/5 bg-black/40 p-4 text-sm",
                        (!unlockedBundle || (q.isPremium && !unlockedAnswers[q.id])) && "select-none blur-sm"
                      )}>
                        <p className="text-slate-200">
                          {!unlockedBundle ? (
                            "Unlock the bundle to view all questions"
                          ) : unlockedAnswers[q.id] ? (
                            unlockedAnswers[q.id]
                          ) : (
                            q.isPremium ? "Premium answers are locked. This is a redacted preview representation. To view the exact answers for this specific question, you must spend credits." : "Free answers: The complete set of verified answers from seniors will be displayed directly here."
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 text-right">
                      <span className="rounded bg-slate-800 px-2 py-1 text-xs font-medium text-slate-300">
                        {q.round} ({q.year})
                      </span>
                      {(q.isPremium && !unlockedAnswers[q.id] && unlockedBundle) && (
                        <GlowButton type="button" onClick={() => handleUnlock(q.id)} disabled={unlockingId === q.id}>
                          {unlockingId === q.id ? "Unlocking..." : "Unlock (" + q.creditsToUnlock + " Credits)"}
                        </GlowButton>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
              {!company.questions.length ? <p className="text-sm text-slate-400">No questions posted yet.</p> : null}
            </div>
          )}

          {activeTab === "prep" && (
            <GlassCard>
              <h3 className="mb-2 font-medium text-slate-200">Preparation Material</h3>
              <p className="text-sm text-slate-400">Based on historic interview data, here are the most asked topics for {company.name}:</p>
              <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-slate-300">
                <li>System Design architectures (Scaling microservices, load balancers)</li>
                <li>Advanced DBMS optimization (Indexing, normal forms)</li>
                <li>Core Language Fundamentals (Memory management in Java/C++, Event loop in JS)</li>
              </ul>
            </GlassCard>
          )}
        </div>
      ) : (
        <GlassCard>
          <p>Loading...</p>
        </GlassCard>
      )}
      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
    </PageWrapper>
  );
}  
