import { type NextPage } from "next";
import Head from "next/head";

const PostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Post | T3 Twitter</title>
      </Head>
      <div className="flex min-h-screen justify-center">
        <h1>Post</h1>
      </div>
    </>
  );
};

export default PostPage;
