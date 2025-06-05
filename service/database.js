import dotenv from 'dotenv';
dotenv.config()

import { createClient } from '@supabase/supabase-js';
import * as utils from './database_utils.mjs';

// creating supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// TESTING FUNCTIONS

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

export function testData() {
    const user = {
            id: 1111,
            email: "test@gmail.com",
            username: "myUsername",
            password: "testPasswordHash",
            friend_code: "beMyFriend", 
            profile_url: "default",
            tokens: {},
            cookie_token: "cookiemonster",
        };
    createUser(user);
}

// RETRIEVAL FUNCTIONS

export async function findByEmail(email) {
    const {data, error} = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();
    if (error) {
        console.error("ERROR--findByEmail: ", JSON.stringify(error));
        return "error";
    }
    return data;
}

// CREATION FUNCTIONS

export async function createUser(user) {
    const result = await checkDuplicate(user);
    if (!result) {
        return false;
    }
    
    const {data, error} = await supabase
        .from('users')
        .insert([
            {id: user.id, email: user.email, username: user.username, password: user.password, friend_code: user.friend_code, 
                profile_url: user.profile_url, tokens: user.tokens, cookie_token: user.cookie_token}
        ]);
    if (error) {
        console.error("ERROR--createUser: ", JSON.stringify(error));
        return false;
    }
    return true;
}

// HELPER FUNCTIONS REQUIRING DATABASE ACCESS

async function checkDuplicate(user, attempt=0) {
    if (attempt > 1000) {
        console.error("ERROR--checkDuplicate: too many retries")
        return false;
    }

    const {data, error} = await supabase
        .from('users')
        .select('id')
        .eq("id", user.id)
        .maybeSingle();
    if (data) {
        user.id = utils.getRandomInt();
        return checkDuplicate(user, attempt + 1);
    } else if (error) {
        console.error("ERROR--checkDuplicate: ", JSON.stringify(error));
        return false;
    }
    return true;
}

