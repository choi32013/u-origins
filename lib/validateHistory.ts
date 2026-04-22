import type { HistoryDataset, HistoricalEvent, EventCategory } from '../types/history';

const VALID_CATEGORIES: EventCategory[] = [
  'war',
  'dynasty',
  'culture',
  'religion',
  'discovery',
];

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
  if (event.endYear !== undefined && event.endYear <= event.year) {
    errors.push({ eventId: event.id, field: 'endYear', message: 'endYear는 year보다 커야 합니다' });
  }
  if (!event.title || event.title.trim() === '') {
    errors.push({ eventId: event.id, field: 'title', message: 'title은 필수입니다' });
  }
  if (!event.description || event.description.trim() === '') {
    errors.push({ eventId: event.id, field: 'description', message: 'description은 필수입니다' });
  }
  if (!VALID_CATEGORIES.includes(event.category)) {
    errors.push({ eventId: event.id, field: 'category', message: `category는 [${VALID_CATEGORIES.join(', ')}] 중 하나여야 합니다` });
  }
  if (![1, 2, 3].includes(event.importance)) {
    errors.push({ eventId: event.id, field: 'importance', message: 'importance는 1, 2, 3 중 하나여야 합니다' });
  }
  if (
    typeof event.location?.lat !== 'number' ||
    typeof event.location?.lng !== 'number' ||
    !event.location?.name
  ) {
    errors.push({ eventId: event.id, field: 'location', message: 'location에 lat, lng, name이 모두 필요합니다' });
  }

  return errors;
}

export function validateDataset(dataset: HistoryDataset): ValidationResult {
  const errors: ValidationError[] = [];

  if (!dataset.id) errors.push({ eventId: '(dataset)', field: 'id', message: 'dataset id는 필수입니다' });
  if (!dataset.label) errors.push({ eventId: '(dataset)', field: 'label', message: 'label은 필수입니다' });
  if (!dataset.region) errors.push({ eventId: '(dataset)', field: 'region', message: 'region은 필수입니다' });
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
