import { ChatBubbleOutlineRounded, Favorite } from "@mui/icons-material";
import { formatDate } from "../helpers/format_date";

type CardTextProps = {
  users: Users;
  posts: Posts;
};

export default function CardChat(props: CardTextProps) {
  const { users, posts } = props;

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="profile flex gap-3 items-center">
          <img
            className="border-2 h-10 w-10 md:h-20 md:w-20 rounded-full"
            src={users.avatar_url}
            alt="avatar"
          />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 md:gap-3 text-xs md:text-xl">
              <span className="font-bold">{users.name}</span>
              <span>•</span>
              <span>{formatDate(posts.created_at)}</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500">
              @{users.username}
            </span>
          </div>
        </div>

        <span className="text-xs sm:text-base">{posts.caption}</span>
        <hr />
        <div className="flex gap-3">
          <Favorite />
          <ChatBubbleOutlineRounded />
        </div>
      </div>
    </>
  );
}
