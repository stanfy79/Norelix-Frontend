// src/features/api-keys/types.ts
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
}

export interface CreateApiKeyRequest {
  name: string;
}