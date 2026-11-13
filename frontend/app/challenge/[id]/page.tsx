import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getChallengeById, getAllChallenges } from "@/lib/challenges";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function generateStaticParams() {
  const challenges = getAllChallenges();
  return challenges.map((c) => ({
    id: c.id,
  }));
}

interface ChallengePageProps {
  params: Promise<{ id: string }>;
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { id } = await params;
  const challenge = getChallengeById(id);

  if (!challenge) {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-slate-100 text-slate-900 select-none">
        <div className="w-full max-w-md p-8 bg-white border-2 border-slate-900 rounded-2xl shadow-retro text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 border-2 border-slate-900 flex items-center justify-center mx-auto text-amber-700 shadow-retro-sm">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-pixel font-bold text-slate-900">
            Challenge Not Found
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            The coding quest <span className="font-mono font-bold text-slate-800">`{id}`</span> could not be found or has not been unlocked yet.
          </p>
          <div className="pt-2">
            <Link href="/challenge/reverse-string">
              <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Go to Starter Challenge
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <WorkspaceLayout challenge={challenge} />;
}
