import { Achievement } from "../../types/achievement";
import { formattedDate } from "../../utils/formattedDate";

interface AchievementItemProps {
  achievement: Achievement;
  reverse?: boolean;
}

const AchievementItem = ({
  achievement,
  reverse = false,
}: AchievementItemProps) => {
  return (
    <div
      className={`flex flex-col min-h-[400px] md:flex-row border ${
        reverse ? "md:flex-row-reverse" : ""
      } my-5`}
    >
      <img
        className="w-full md:w-1/2 min-h-[500px] max-h-[500px] object-cover"
        src={achievement.image_url}
        alt={achievement.title}
        draggable={false}
      />
      <div className="w-full md:w-1/2 flex flex-col justify-center text-justify p-5 gap-5 bg-white">
        <h1 className="text-3xl md:text-4xl font-bold">{achievement.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: achievement.description }} />
        <div>{formattedDate(achievement.created_at)}</div>
      </div>
    </div>
  );
};

export default AchievementItem;
