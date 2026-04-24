import type { HistoryDataset, HistoricalEvent } from '../types/history';

export interface ValidationError {
  eventId: string;
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

function validateEvent(event: HistoricalEvent): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!event.id || event.id.trim() === '') {
    errors.push({ eventId: event.id ?? '(unknown)', field: 'id', message: 'id는 필수입니다' });
  }
  if (typeof event.year !== 'number' || !Number.isFinite(event.year)) {
    errors.push({ eventId: event.id, field: 'year', message: 'year는 유한한 숫자여야 합니다' });
  }
  if (!event.label || event.label.trim() === '') {
    errors.push({ eventId: event.id, field: 'label', message: 'label은 필수입니다' });
  }
  if (!event.summary || event.summary.trim() === '') {
    errors.push({ eventId: event.id, field: 'summary', message: 'summary는 필수입니다' });
  }
  if (typeof event.lat !== 'number' || typeof event.lng !== 'number') {
    errors.push({ eventId: event.id, field: 'lat/lng', message: 'lat, lng는 숫자여야 합니다' });
  }
  if (!Array.isArray(event.tags)) {
    errors.push({ eventId: event.id, field: 'tags', message: 'tags는 배열이어야 합니다' });
  }
  if (!Array.isArray(event.causes) || !Array.isArray(event.effects)) {
    errors.push({ eventId: event.id, field: 'causes/effects', message: 'causes, effects는 배열이어야 합니다' });
  }

  return errors;
}

export function validateDataset(dataset: HistoryDataset): ValidationResult {
  const errors: ValidationError[] = [];

  if (!dataset.id) errors.push({ eventId: '(dataset)', field: 'id', message: 'dataset id는 필수입니다' });
  if (!dataset.label) errors.push({ eventId: '(dataset)', field: 'label', message: 'label은 필수입니다' });
  if (!Array.isArray(dataset.range) || dataset.range.length !== 2) {
    errors.push({ eventId: '(dataset)', field: 'range', message: 'range는 [start, end] 형태여야 합니다' });
  } else if (dataset.range[0] >= dataset.range[1]) {
    errors.push({ eventId: '(dataset)', field: 'range', message: 'range의 시작값이 종료값보다 작아야 합니다' });
  }

  const ids = new Set<string>();
  for (const event of dataset.events) {
    if (ids.has(event.id)) {
      errors.push({ eventId: event.id, field: 'id', message: '중복된 event id입니다' });
    }
    ids.add(event.id);
    errors.push(...validateEvent(event));
  }

  return { valid: errors.length === 0, errors };
}
