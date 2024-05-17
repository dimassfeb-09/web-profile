import { useEffect, useState } from "react";
import CardChat from "../components/CardChat";
import { Supabase } from "../db/Supabase";
import { useNavigate } from "react-router-dom";
import toastNotify from "../commons/Toast";
import { ToastContainer } from "react-toastify";

export default function Chat() {
  const [userPosts, setUserPosts] = useState<UserPosts[]>();
  const navigate = useNavigate();

  const supabases = Supabase();

  const fecthPosts = async () => {
    const { data } = await supabases
      .from("posts")
      .select(
        `
        *,
        user_info: users (id, name, username, avatar_url)
      `
      )
      .order("created_at", { ascending: false });

    setUserPosts(data?.map((value) => value));
  };

  const logout = async () => {
    const { error } = await supabases.auth.signOut();
    if (error) {
      toastNotify({ message: error.message, type: "error" });
    }

    setTimeout(() => {
      toastNotify({ message: "Success Logout", type: "success" });
    }, 500);
    navigate("/login");
  };

  useEffect(() => {
    fecthPosts();
  }, []);

  return (
    <div>
      <header className="h-20 w-full bg-secondary flex justify-evenly items-center">
        <a href="/chat">
          <span className="text-white text-lg sm:text-4xl font-FasterOne">
            Dimas Sosmed
          </span>
        </a>
        <a
          className="border bg-primary text-xs px-3 py-1 rounded-md"
          href="/login_chat"
        >
          Login
        </a>
        <button onClick={() => logout()}>logout</button>
      </header>
      <section className="flex flex-col items-center mt-10 sm:mt-20">
        <div className="flex flex-col gap-5 w-4/5">
          <span>Sort by Newest</span>
          <ul className="flex flex-col gap-10">
            {userPosts?.map((post) => {
              return (
                <li className="h-auto border p-3 sm:p-10">
                  <CardChat
                    key={post.id}
                    users={{
                      id: post.user_info.id,
                      avatar_url: post.user_info.avatar_url,
                      username: post.user_info.username,
                      name: post.user_info.name,
                    }}
                    posts={post}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}
