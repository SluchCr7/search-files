export interface DatabaseItem {
  id: string;
  name: string;
  icon: string;
}

export interface DocumentRecord {
  id: number;
  title: string;
  database: string;
  number: string;
  date: string;
  year: number;
  pages: number;
  snippet: string;
}

export interface GazetteIssue {
  id: number;
  number: number;
  date: string;
  year: number;
  pages: number;
  title: string;
}

export type LogicOperator = "AND" | "OR" | "NOT";
export type SearchOperator = "contains" | "exact" | "starts" | "ends";
export type SortOption = "relevance" | "newest" | "oldest";
export type ActiveTab = "simple" | "advanced" | "gazette";

export interface SearchCriteria {
  id: number;
  database: string;
  field: "all" | "title" | "snippet" | "number" | "parties";
  fieldText: string;
  operator: SearchOperator;
  operatorText: string;
  keyword: string;
  toValue?: string;
  fromYear?: number | null;
  toYear?: number | null;
  logic: LogicOperator;
  sort: boolean;
}

export interface TourStep {
  targetId: string;
  title: string;
  content: string;
}
