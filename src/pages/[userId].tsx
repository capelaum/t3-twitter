import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

const ProfilePage: NextPage<{ userId: string }> = ({ userId }) => {
  const { data: user, isLoading } = api.profile.getUserById.useQuery({
    userId,
  });

  if (isLoading) {
    <LoadSpinner />;
  }

  if (!user) return <div>404</div>;

  return (
    <>
      <Head>
        <title>T3 Twitter | {user.username}</title>
      </Head>
      <Layout>
        <div className="relative h-36 bg-slate-800">
          <Image
            src={user.profileImageUrl}
            alt={`${user.username}'s profile picture`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-16 ml-4 rounded-full border-4 border-slate-900 bg-slate-900"
          />
        </div>
        <div className="mt-20 pl-8 text-2xl font-bold">{`@${user.username}`}</div>
        <div className="w-full border-b border-slate-700 pb-4"></div>
      </Layout>
    </>
  );
};

import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import Image from "next/image";
import superjson from "superjson";
import { Layout } from "~/components/Layout";
import { LoadSpinner } from "~/components/LoadSpinner";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: {
      prisma,
      userId: null,
    },
    transformer: superjson, // optional - adds superjson serialization
  });

  const userId = ctx.params?.userId;

  if (typeof userId !== "string") throw new Error("no user ID");

  await ssg.profile.getUserById.prefetch({ userId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      userId,
    },
  };
};

export default ProfilePage;
