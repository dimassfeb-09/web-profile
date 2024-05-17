
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabaseConfig = {
    url: import.meta.env.VITE_SUPABASE_URL,
    anon_key: import.meta.env.VITE_SUPABASE_ANON_KEY
};

const supabase = createClient(supabaseConfig.url, supabaseConfig.anon_key);

export const Supabase = ()=> {
    return supabase;
}

export default Supabase();
