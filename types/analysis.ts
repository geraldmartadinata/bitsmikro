export type Severity = "low" | "medium" | "high";

export interface Factor {
  id: string;
  name: string;
  impact: Severity;
  reasoning: string;
  suggestion: string;
}

export interface PrioritizedAction {
  action: string;
  reason: string;
  priority: number;
}

export interface RedFlag {
  message: string;
  emergency: string;
}

export interface AnalysisResult {
  summary: string;
  factors: Factor[];
  prioritizedActions: PrioritizedAction[];
  disclaimer: string;
  redFlag?: RedFlag;
}