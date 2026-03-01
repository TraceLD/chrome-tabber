import type Fuse from "fuse.js";

export interface TabEntry {
  id: number;
  windowId: number;
  title: string;
  url: string;
  favIconUrl?: string;
}

export type FuseResultWithMatches = {
  item: TabEntry;
  matches?: readonly Fuse.FuseResultMatch[] | undefined;
};
