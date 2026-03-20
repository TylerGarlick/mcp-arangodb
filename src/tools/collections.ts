/**
 * Collection management MCP tools
 */

import { getClient } from '../client.js';
import { logger } from '../logger.js';
import type { CollectionInfo, CollectionType } from '../types.js';

/**
 * List all collections
 */
export async function listCollections(): Promise<CollectionInfo[]> {
  logger.debug('Listing collections');
  const db = getClient();
  const collections = await db.collections();
  
  return collections.map((col: { _id: string; name: string; type: number; status: number; isSystem: boolean }) => ({
    id: col._id,
    name: col.name,
    type: col.type === 2 ? 'edge' as CollectionType : 'document' as CollectionType,
    status: col.status,
    isSystem: col.isSystem,
  }));
}

/**
 * Create a new collection
 */
export async function createCollection(
  name: string,
  type: CollectionType = 'document'
): Promise<CollectionInfo> {
  logger.debug('Creating collection', { name, type });
  const db = getClient();
  
  const colType = type === 'edge' ? 3 : 2; // 3 = edge collection, 2 = document collection
  
  const result = await db.createCollection(name, { type: colType });
  
  logger.info('Collection created', { name, type });
  
  return {
    id: result._id,
    name: result.name,
    type,
    status: result.status,
    isSystem: result.isSystem,
  };
}

/**
 * Get collection information
 */
export async function getCollection(name: string): Promise<CollectionInfo | null> {
  logger.debug('Getting collection', { name });
  const db = getClient();
  
  try {
    const collection = db.collection(name);
    const properties = await collection.properties();
    
    return {
      id: properties.id?.toString() || name,
      name: collection.name,
      type: collection.type === 3 ? 'edge' as CollectionType : 'document' as CollectionType,
      status: 0, // status not directly available
      isSystem: collection.name.startsWith('_'),
    };
  } catch {
    logger.warn('Collection not found', { name });
    return null;
  }
}

/**
 * Delete a collection
 */
export async function deleteCollection(name: string): Promise<{ deleted: boolean }> {
  logger.debug('Deleting collection', { name });
  const db = getClient();
  
  try {
    const collection = db.collection(name);
    await collection.drop();
    logger.info('Collection deleted', { name });
    return { deleted: true };
  } catch (error) {
    logger.error('Failed to delete collection', { name, error });
    return { deleted: false };
  }
}

/**
 * Get indexes for a collection
 */
export async function getCollectionIndexes(
  name: string
): Promise<Array<{ id: string; type: string; fields: string[]; unique?: boolean; sparse?: boolean }>> {
  logger.debug('Getting collection indexes', { name });
  const db = getClient();
  
  const collection = db.collection(name);
  const indexes = await collection.indexes();
  
  return indexes.map((idx: { id?: string; type?: string; fields?: string[]; unique?: boolean; sparse?: boolean }) => ({
    id: idx.id || '',
    type: idx.type || 'unknown',
    fields: idx.fields || [],
    unique: idx.unique,
    sparse: idx.sparse,
  }));
}
