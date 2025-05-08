// import { createClient } from '@supabase/supabase-js';
// import { supabase } from './supaBase';  


// // Initialize Supabase client


// // Function to listen for new user signups and add them to the Users table
// const listenForAuthChanges = async () => {
//     supabase.auth.onAuthStateChange(async (event, session) => {
//         if (event === 'SIGNED_IN' && session?.user) {
//             const { id, email } = session.user;

//             // Check if the user already exists in the Users table
//             const { data: existingUser, error: fetchError } = await supabase
//             .from('Users')
//             .select('*')
//             .eq('id', id)
//             .single();

//             if (fetchError) {
//             console.error('Error fetching user from Users table:', fetchError.message);
//             return;
//             }

//             // If the user does not exist, insert them into the Users table
//             if (!existingUser) {
//             const { error: insertError } = await supabase.from('Users').insert([
//                 { id, email },
//             ]);

//             if (insertError) {
//                 console.error('Error inserting user into Users table:', insertError.message);
//             } else {
//                 console.log('User successfully added to Users table');
//             }
//             } else {
//             console.log('User already exists in Users table');
//             }
//         }
//     });
// };

// // Call the function to start listening for auth changes
// listenForAuthChanges();

// export default supabase;