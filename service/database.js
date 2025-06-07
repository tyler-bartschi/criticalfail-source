import dotenv from 'dotenv';
dotenv.config()

import { createClient } from '@supabase/supabase-js';
import * as utils from './database_utils.js';

// creating supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// TESTING FUNCTIONS

export async function testConnection() {
    // tests the connection to supabase using a predefined table and value
    const {data, error} = await supabase
        .from('test_connection')
        .select('*')
        .eq('id', process.env.SUPABASE_CONNECTION_INT)

    if (error) {
        console.error("Supabase connection failed: ", error);
    } else if (data) {
        console.log("Supabase connection verified.");
    } else {
        console.error("Supabase connection potentially failed.")
    }
}

export function testData() {
    // used to test adding data
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
    // finds a user in the database by their email
    const {data, error} = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();
    if (error) {
        utils.displayError("findByEmail", error);
        return "error";
    }
    return data;
}

export async function findByCookieToken(value) {
    const {data, error} = await supabase
        .from('users')
        .select("*")
        .eq("cookie_token", value)
        .maybeSingle();
    if (error) {
        utils.displayError("findByCookieToken", error);
        return "error";
    }
    return data;
}

export async function getAllFriendCodes() {
    // goes into the users table and gets all the friend codes using pagination
    // used when the server is initialized, to help initialize the existing friend codes list
    let allRows = []
    let from = 0;
    const batchSize = 100;

    while (true) {
        const {data, error} = await supabase
            .from('users')
            .select('friend_code')
            .range(from, from + batchSize - 1);
        
        if (error) {
            utils.displayError("getAllFriendCodes", error);
            break;
        }

        allRows.push(...data);

        if (data.length < batchSize) {
            // all rows have been fetched
            break;
        }

        from += batchSize;
    }
    
    return allRows;
}

// CREATION FUNCTIONS

export async function createUser(user) {
    // creates an user account in the database
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
        utils.displayError("createUser", error);
        return false;
    }
    return true;
}

// UPDATE FUNCTIONS

export async function updateUserSingleItem(id, field, value) {
    const {data, error} = await supabase
        .from('users')
        .update({ [field]: value })
        .eq('id', id);
    
    if (error) {
        utils.displayError("updateUserSingleItem", error);
        return false;
    } else if (data.length === 0) {
        return false;
    }
    return true;
}

// HELPER FUNCTIONS REQUIRING DATABASE ACCESS

async function checkDuplicate(user, attempt=0) {
    // checks that the user id is unique, and if it is not it regenerates it
    if (attempt > 1000) {
        utils.displayError("checkDuplicate", {error: "too many retries"});
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
        utils.displayError("checkDuplicate", error);
        return false;
    }
    return true;
}

// STORAGE DATABASE FUNCTIONS

// RETRIEVAL FUNCTIONS

export async function getDefaultProfileUrl() {
    const {data, error} = await supabase
        .storage
        .from('profile-pictures')
        .getPublicUrl('default-profile.png');
    if (error) {
        utils.displayError("getDefaultProfileUrl", error);
        return null;
    }
    return data.publicUrl;
}