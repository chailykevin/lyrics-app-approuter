import { addHours, formatDistanceToNow } from "date-fns";
import { FaMusic } from "react-icons/fa6";

type Artist = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type PropTypes = {
  artist: Artist;
};

const UserArtistCard = ({ artist }: PropTypes) => {
  const createdDate = new Date(artist.createdAt);
  const adjustedDate = addHours(createdDate, -7);
  const formattedDate = formatDistanceToNow(adjustedDate, {
    addSuffix: true,
  });

  return (
    <div className="flex flex-row items-center justify-between px-4 border-1 py-2 rounded-md hover:scale-101 transition hover:cursor-pointer hover:bg-neutral-200">
      <div className="flex flex-row items-center gap-8">
        <div className="flex items-center justify-center bg-blue-300 w-10 h-10 rounded-sm">
          <FaMusic />
        </div>
        <div>
          <h3 className="font-bold">{artist.name}</h3>
        </div>
      </div>
      {formattedDate}
    </div>
  );
};

export default UserArtistCard;
