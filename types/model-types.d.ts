export interface ModelState {
    model: string | null;
    setModel: (model: string) => void
}

export type Model = {
    name: string;
    url: string;
    size: number;
    params: number
}