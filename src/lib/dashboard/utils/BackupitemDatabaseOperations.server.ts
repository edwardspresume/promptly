import { message } from 'sveltekit-superforms/server';

import type { SupabaseClient } from '@supabase/supabase-js';

import type { SuperValidated } from 'sveltekit-superforms';

import type { promptsCrudSchema } from '$databaseDir/promptsCrudSchema';
import type { tagsCrudSchema } from '$databaseDir/tagsCrudSchema';

import type { Database } from '$databaseDir/database.types';
import type { PromptSchema, TagSchema } from '$databaseDir/schema.ts';

type TableName = 'tags' | 'prompts';

type ItemOperation = 'create' | 'update' | 'delete' | 'deleteAll';

type ItemData =
    | ({
          userId?: string;
      } & typeof tagsCrudSchema)
    | typeof PromptSchema;

/**
 * Function to build the appropriate Supabase query for the item operation.
 * @param {ItemOperation} operation The item operation.
 * @param {SupabaseClient<Database>} supabase Initialized Supabase client.
 * @param {object} itemData The item data.
 * @param {string | null | undefined} itemId Optional item ID.
 */
function buildQuery(
    operation: ItemOperation,
    supabase: SupabaseClient<Database>,
    tableName: TableName,
    itemData: object,
    itemId?: string | null,
    userId?: string
) {
    switch (operation) {
        case 'create':
            return supabase.from(tableName).insert([itemData]);
        case 'update':
            return supabase.from(tableName).update(itemData).eq('id', itemId);
        case 'delete':
            return supabase.from(tableName).delete().eq('id', itemId);
        case 'deleteAll':
            return supabase.from(tableName).delete().eq('user_id', userId);
    }
}

/**
 * Function to perform create, update, or delete operation on an item (tag or prompt).
 * @param {ItemOperation} itemOperation Specifies the operation type.
 * @param {SupabaseClient<Database>} supabase Initialized Supabase client.
 * @param {object} itemForm Form data validated against the schema.
 * @param {string | null | undefined} itemId Optional item ID, required for update and delete operations.
 * @param {string} tableName The name of the table in the database.
 */
export const handleItemOperation = async (
    tableName: TableName,
    itemOperation: ItemOperation,
    supabase: SupabaseClient<Database>,
    itemForm: SuperValidated<typeof tagsCrudSchema | typeof promptsCrudSchema>,
    itemId?: string | null,
    userId?: string
) => {
    const itemData: ItemData = {};
    if (userId !== undefined) {
        itemData.user_id = userId;
    }
    if (tableName === 'tags' && itemForm) {
        (itemData as Partial<TagSchema>).name = itemForm.data.name;
    } else if (tableName === 'prompts' && itemForm) {
        for (const [key, value] of Object.entries(itemForm.data)) {
            (itemData as Partial<PromptSchema>)[key as keyof PromptSchema] =
                value;
        }
    }

    console.log('itemData', itemData);

    // Build the query based on the item operation
    const query = buildQuery(
        itemOperation,
        supabase,
        tableName,
        itemData,
        itemId,
        userId
    );

    const { error } = await query;

    if (error) {
        console.error(error);
        console.log(error);

        return message(itemForm, `Error ${itemOperation} item`, {
            status: 500,
        });
    }
};
