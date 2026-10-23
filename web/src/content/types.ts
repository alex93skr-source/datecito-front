export type Block =
  | string
  | { ul: string[] }
  | { ol: string[] }
  | { h3: string }
  | { table: { head: string[]; rows: string[][] } }
  | { note: string };

export type DocSection = { id: string; h: string; blocks: Block[] };

export type LegalDoc = {
  slug: string;
  title: string;
  summary: string;
  intro: Block[];
  sections: DocSection[];
};
