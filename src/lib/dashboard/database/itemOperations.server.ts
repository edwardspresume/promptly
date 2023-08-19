import { supabaseDB } from '$databaseDir/drizzleClient.server';
import { eq } from 'drizzle-orm';

import type { promptsCrudSchema } from '$databaseDir/promptsCrudSchema';
import { prompts, tags } from '$databaseDir/schema';
import type { tagsCrudSchema } from '$databaseDir/tagsCrudSchema';

type TableName = 'tags' | 'prompts';
type ItemOperation = 'create' | 'update' | 'delete' | 'deleteAll';
type ItemData = typeof promptsCrudSchema | typeof tagsCrudSchema;

/**
 * Function to build the appropriate Supabase query for the item operation.
 * @param {ItemOperation} operation The item operation.
 * @param {object} itemData The item data.
 * @param {string | null | undefined} itemId Optional item ID.
 * @param {string | null | undefined} userId Optional user ID.
 * @returns The query result.
 */
async function buildQuery(
    operation: ItemOperation,
    table,
    itemData: ItemData | null,
    itemId?: string | null,
    userId?: string
) {
    switch (operation) {
        case 'create':
            return await supabaseDB.insert(table).values([itemData]);
        case 'update':
            return await supabaseDB
                .update(table)
                .set(itemData ?? {})
                .where(eq(table.id, itemId));
        case 'delete':
            return await supabaseDB.delete(table).where(eq(table.id, itemId));
        case 'deleteAll':
            return await supabaseDB
                .delete(table)
                .where(eq(table.userId, userId));
    }
}

/**
 * Function to perform create, update, or delete operation on an item (tag or prompt).
 * @param {string} tableName The name of the table in the database.
 * @param {ItemOperation} itemOperation Specifies the operation type.
 * @param {object} itemData Optional item data.
 * @param {string | null | undefined} itemId Optional item ID, required for update and delete operations.
 * @param userId - Optional user ID.
 */
export const handleItemOperation = async (
    tableName: TableName,
    itemOperation: ItemOperation,
    itemData?: ItemData | null,
    itemId?: string | null,
    userId?: string
) => {
    const table = tableName === 'tags' ? tags : prompts;



    console.log(itemData);
    // return;

    buildQuery(itemOperation, table, itemData ?? null, itemId, userId);
};
