"use client";

import { useEffect, useReducer } from "react";

type Step =
  | { kind: "cmd"; text: string }
  | { kind: "output"; text: string; accent?: boolean };

const STEPS: Step[] = [
  { kind: "cmd", text: "pronto init" },
  { kind: "output", text: "✓ 847 strings discovered across 23 files", accent: true },
  { kind: "cmd", text: "pronto translate --target es,ja" },
  { kind: "output", text: "Translating 12 changed strings to es, ja...\n✓ Done. 2 files updated.", accent: true },
  { kind: "cmd", text: "git add . && git commit -m 'chore: localize'" },
  { kind: "output", text: "[main 3a7f2c1] chore: localize\n 2 files changed, 24 insertions(+), 0 deletions(-)", accent: false },
];

interface HistoryLine {
  kind: "cmd" | "output";
  text: string;
  accent?: boolean;
}

interface AnimState {
  history: HistoryLine[];
  stepIndex: number;
  typedChars: number;
  phase: "typing" | "awaiting-output" | "done";
}

type AnimAction =
  | { type: "TYPE_CHAR" }
  | { type: "COMMIT_CMD" }
  | { type: "COMMIT_OUTPUT" }
  | { type: "MARK_DONE" }
  | { type: "RESET" };

const INITIAL: AnimState = {
  history: [],
  stepIndex: 0,
  typedChars: 0,
  phase: "typing",
};

function reducer(state: AnimState, action: AnimAction): AnimState {
  switch (action.type) {
    case "TYPE_CHAR":
      return { ...state, typedChars: state.typedChars + 1 };
    case "COMMIT_CMD": {
      const step = STEPS[state.stepIndex];
      if (!step || step.kind !== "cmd") return state;
      return {
        ...state,
        history: [...state.history, { kind: "cmd", text: step.text }],
        typedChars: 0,
        stepIndex: state.stepIndex + 1,
        phase: "awaiting-output",
      };
    }
    case "COMMIT_OUTPUT": {
      const step = STEPS[state.stepIndex];
      if (!step || step.kind !== "output") return state;
      const nextIndex = state.stepIndex + 1;
      const isDone = nextIndex >= STEPS.length;
      return {
        ...state,
        history: [...state.history, { kind: "output", text: step.text, accent: step.accent }],
        stepIndex: nextIndex,
        phase: isDone ? "done" : "typing",
      };
    }
    case "MARK_DONE":
      return { ...state, phase: "done" };
    case "RESET":
      return INITIAL;
  }
}

export function TerminalDemo() {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const { history, stepIndex, typedChars, phase } = state;

  useEffect(() => {
    if (phase === "done") {
      const t = setTimeout(() => dispatch({ type: "RESET" }), 4000);
      return () => clearTimeout(t);
    }

    const step = STEPS[stepIndex];
    if (!step) {
      const t = setTimeout(() => dispatch({ type: "MARK_DONE" }), 0);
      return () => clearTimeout(t);
    }

    if (step.kind === "cmd" && phase === "typing") {
      if (typedChars < step.text.length) {
        const t = setTimeout(() => dispatch({ type: "TYPE_CHAR" }), 38);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => dispatch({ type: "COMMIT_CMD" }), 280);
      return () => clearTimeout(t);
    }

    if (step.kind === "output" && phase === "awaiting-output") {
      const t = setTimeout(() => dispatch({ type: "COMMIT_OUTPUT" }), 380);
      return () => clearTimeout(t);
    }
  }, [phase, stepIndex, typedChars]);

  const currentStep = STEPS[stepIndex];
  const isTypingCmd = phase === "typing" && currentStep?.kind === "cmd";

  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl border border-zinc-700 overflow-hidden shadow-2xl shadow-indigo-950/30">
      {/* Terminal chrome */}
      <div className="bg-zinc-800 px-4 py-2.5 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <span className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-auto text-xs text-zinc-500 font-mono">pronto — bash</span>
      </div>

      {/* Terminal body */}
      <div className="bg-[#0e0e10] px-5 py-5 min-h-[220px] font-mono text-sm">
        {history.map((line, i) => (
          <div key={i} className="mb-1.5">
            {line.kind === "cmd" ? (
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 select-none">$</span>
                <span className="text-zinc-200">{line.text}</span>
              </div>
            ) : (
              <div className="pl-4">
                {line.text.split("\n").map((ln, j) => (
                  <div
                    key={j}
                    className={ln.startsWith("✓") || line.accent ? "text-emerald-400" : "text-zinc-400"}
                  >
                    {ln}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTypingCmd && currentStep.kind === "cmd" && (
          <div className="flex items-start gap-2">
            <span className="text-emerald-400 select-none">$</span>
            <span className="text-zinc-200">
              {currentStep.text.slice(0, typedChars)}
              <span className="cursor-blink text-indigo-400">▊</span>
            </span>
          </div>
        )}

        {phase === "done" && (
          <div className="flex items-center gap-2 mt-3 text-emerald-400">
            <span>✓</span>
            <span>Localization complete. Ready to ship.</span>
          </div>
        )}
      </div>
    </div>
  );
}
