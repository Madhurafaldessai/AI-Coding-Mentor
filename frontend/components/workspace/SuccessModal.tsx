"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trophy, ArrowRight, RotateCcw, Sparkles, Flame, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { apiClient } from "@/lib/api-client";
import { ExtendedProgressResponse } from "@/lib/extended-types";

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  challengeId: string;
  code: string;
  passedCount: number;
  totalCount: number;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  challengeId,
  code,
  passedCount,
  totalCount,
}) => {
  const router = useRouter();
  const [progressData, setProgressData] = useState<ExtendedProgressResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.recordProgress({
        challengeId,
        code,
        passed: passedCount,
        total: totalCount,
        hintLevelUsed: 0,
      });
      setProgressData(data as ExtendedProgressResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record progress");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProgress();
    } else {
      setProgressData(null);
      setError(null);
    }
  }, [isOpen, challengeId]);

  const handleNextChallenge = () => {
    onClose();
    if (progressData?.nextChallengeId) {
      router.push(`/challenge/${progressData.nextChallengeId}`);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" showCloseButton={true}>
      <div className="flex flex-col items-center text-center space-y-5">
        {/* Pixel Reward Icon & Title */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-slate-900 shadow-retro flex items-center justify-center text-amber-600 animate-gentleFloat">
            <Trophy className="w-8 h-8" />
          </div>
          <Sparkles className="w-5 h-5 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
        </div>

        <div>
          <span className="text-xs font-pixel font-bold uppercase tracking-widest text-[#16A34A] block mb-1">
            ALL TESTS PASSED!
          </span>
          <h2 className="text-2xl font-pixel font-bold text-slate-900">
            CHALLENGE COMPLETE!
          </h2>
        </div>

        {/* Server Progress Result */}
        {isLoading ? (
          <div className="w-full py-6 flex flex-col items-center justify-center gap-2 text-slate-500 font-pixel text-xs">
            <RefreshCw className="w-5 h-5 animate-spin text-[#0095FF]" />
            <span>Recording progress with server...</span>
          </div>
        ) : error ? (
          <div className="w-full p-4 bg-amber-50 border-2 border-amber-300 rounded-xl space-y-2 text-left">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Could not record XP with server</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              Your solution passed locally! {error}
            </p>
            <Button variant="outline" size="sm" onClick={fetchProgress} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
              Retry Sync
            </Button>
          </div>
        ) : progressData ? (
          <div className="w-full space-y-3.5">
            {/* XP Gained & Level Stats (Only using values provided by the server contract) */}
            <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-xl space-y-2 text-left shadow-retro-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-sans font-bold text-xs text-slate-600">XP Gained:</span>
                <span className="font-pixel font-bold text-base text-amber-600">
                  +{progressData.xpGained} XP
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-sans font-medium text-slate-500">Total XP:</span>
                <span className="font-pixel font-bold text-slate-900">{progressData.totalXp} XP</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-sans font-medium text-slate-500">Current Level:</span>
                <Badge variant="lavender" size="sm">
                  Level {progressData.level}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-sans font-medium text-slate-500">Streak:</span>
                <div className="flex items-center gap-1 font-pixel font-bold text-amber-700">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{progressData.streak} Days</span>
                </div>
              </div>

              {/* TODO: When backend teammate adds xpBreakdown to ProgressResponse, render detailed line items here. */}
              {progressData.xpBreakdown && (
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  {progressData.xpBreakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] text-slate-600">
                      <span>{item.label}</span>
                      <span className="font-mono font-bold">+{item.amount} XP</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Badges Earned */}
            {progressData.newBadges && progressData.newBadges.length > 0 && (
              <div className="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl flex items-center gap-2.5 text-left">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-pixel font-bold text-xs text-emerald-900 block">
                    NEW BADGE UNLOCKED!
                  </span>
                  <span className="text-xs text-emerald-800">
                    {progressData.newBadges.join(", ")}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="w-full flex items-center justify-between gap-3 pt-2">
          <Button variant="outline" size="md" onClick={onClose} leftIcon={<RotateCcw className="w-4 h-4" />}>
            Review Code
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleNextChallenge}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="font-pixel tracking-wider text-xs sm:text-sm bg-[#0095FF]"
          >
            NEXT CHALLENGE &rarr;
          </Button>
        </div>
      </div>
    </Modal>
  );
};
