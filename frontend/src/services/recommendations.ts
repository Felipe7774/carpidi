import { api } from './api';

export type Recommendation = { productId: string; name: string; slug: string; price: number; reason: string; score: number };
export type Questionnaire = { bodyType: string; skinTone: string; heightRange: string; stylePreferences: string[]; consent: boolean };

export async function saveQuestionnaire(data: Questionnaire) { await api.post('/questionnaire', data); }
export async function getRecommendations() { const { data } = await api.get<Recommendation[]>('/recommendations'); return data; }
