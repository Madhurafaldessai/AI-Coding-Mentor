// Challenge Workspace: CodeEditor, ProblemPanel, OutputPanel, MentorPanel, RunBar
export function generateStaticParams() {
  return [{ id: "reverse-string" }];
}

interface ChallengePageProps {
  params: Promise<{ id: string }>;
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold">Challenge Workspace: {id}</h1>
    </div>
  );
}
