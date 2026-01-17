import { create } from 'zustand'

interface OrganizationNode {
    id: string;
    name: string;
    slug: string;
    type: string;
    parent_id?: string | null;
}

interface OrganizationState {
    selectedNode: OrganizationNode | null;
    isPanelOpen: boolean;
    setSelectedNode: (node: OrganizationNode | null) => void;
    togglePanel: (open: boolean) => void;
}

export const useOrganizationStore = create<OrganizationState>((set) => ({
    selectedNode: null,
    isPanelOpen: false,
    setSelectedNode: (node) => set({ selectedNode: node, isPanelOpen: !!node }),
    togglePanel: (open) => set({ isPanelOpen: open }),
}))
