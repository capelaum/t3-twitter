import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import { type RouterOutputs } from "~/utils/api";

dayjs.extend(relativeTime);

type PostWithAuthor = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithAuthor) => {
  const { post, author } = props;

  return (
    <div className="flex items-center gap-3 border-b border-slate-700 p-4">
      <Image
        src={author.profileImageUrl}
        alt={`@${author.username}'s profile picture`}
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
        placeholder="blur"
        blurDataURL={author.profileImageUrl}
      />

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 text-slate-300">
          <Link href={`/${author.id}`} title={author.username}>
            <span className="text-md font-semibold">
              {`@${author.username} · `}
            </span>
          </Link>

          <Link href={`/post/${post.id}`}>
            <span className="text-md font-thin">
              {dayjs(post.createdAt).fromNow()}
            </span>
          </Link>
        </div>

        <p className="text-2xl">{post.content}</p>
      </div>
    </div>
  );
};
