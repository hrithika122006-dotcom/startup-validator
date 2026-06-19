export interface EvaluationScores {
  marketSize: number;
  competition: number;
  technicalFeasibility: number;
  businessModel: number;
}

export interface EvaluationResult {
  id?: string;
  ideaText: string;
  scores: EvaluationScores;
  overallScore: number;
  summary: string;
  recommendations: string[];
  risks: string[];
  createdAt?: string;
  userId?: string;
}
export interface EvaluateRequest {
  ideaText: string;
}
export interface EvaluateResponse {
  success: boolean;
  data?: EvaluationResult;
  error?: string;
}
export type EvaluationStatus = "idle" | "loading" | "success" | "error";
