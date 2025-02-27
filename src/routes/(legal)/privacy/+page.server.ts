import PRIVACY from '$lib/documents/PRIVACY.md?raw';

export const load = async (event: ServerLoadEvent) => {
  return {
    doc: PRIVACY
  }
}