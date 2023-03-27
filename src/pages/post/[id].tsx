import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { Layout } from "~/components/Layout";
import { LoadingPage } from "~/components/LoadSpinner";
import { PostView } from "~/components/PostView";
import { generateSSGHelper } from "~/server/helpers/ssgProxyHelper";
import { api } from "~/utils/api";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: fullPost, isLoading } = api.posts.getById.useQuery({
    id,
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!fullPost) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${fullPost.post.content} - @${fullPost.author.username}`}</title>
      </Head>
      <Layout>
        <PostView {...fullPost} />
      </Layout>
    </>
  );
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const ssg = generateSSGHelper();

  const id = ctx.params?.id;

  if (typeof id !== "string") throw new Error("no Post ID");

  await ssg.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export default SinglePostPage;
