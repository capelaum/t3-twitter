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
        <h1>{user.username}</h1>
      </Layout>
    </>
  );
};

import { createProxySSGHelpers } from "@trpc/react-query/ssg";
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
