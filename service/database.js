import dotenv from 'dotenv';
dotenv.config()

import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function testConnection() {
    const {data, error} = await supabase
        .from('test_connection')
        .select('*')
        .eq('id', process.env.SUPABASE_CONNECTION_INT)

    if (error) {
        console.error("Supabase connection failed: ", error);
    } else {
        console.log("Supabase connection verified.");
    }
}

export async function findByEmail(email) {
    const {data, error} = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
    if (error) {
        console.log("ERROR--findByEmail: ", JSON.stringify(error));
        return "error";
    }
    return data;
}
