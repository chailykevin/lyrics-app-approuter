import { addHours, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { FaMusic } from "react-icons/fa6";

type Artist = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type PropTypes = {
  songId: string;
  songName: string;
  songArtists: Artist[];
  createdAt: string;
};

const UserSongCard = ({
  songId,
  songName,
  songArtists,
  createdAt,
}: PropTypes) => {
  const createdDate = new Date(createdAt);
  const adjustedDate = addHours(createdDate, -7);
  const formattedDate = formatDistanceToNow(adjustedDate, {
    addSuffix: true,
  });

  return (
    <Link href={`/songs/${songId}`}>
      <div className="flex flex-row items-center justify-between px-4 border-1 py-2 rounded-md hover:scale-101 transition hover:cursor-pointer hover:bg-neutral-200">
        <div className="flex flex-row items-center gap-8">
          <div className="flex items-center justify-center bg-blue-300 w-10 h-10 rounded-sm">
            <FaMusic />
          </div>
          <div>
            <h3 className="font-bold">{songName}</h3>
            <p>{songArtists.map((songArtist) => `${songArtist.name} `)}</p>
          </div>
        </div>
        {formattedDate}
      </div>
    </Link>
  );
};

export default UserSongCard;
