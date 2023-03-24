import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data } = api.posts.getAll.useQuery();
  console.log("💥 ~ data:", data);

  const user = useUser();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {!!user.isSignedIn && (
          <SignOutButton>
            <button className="btn">Sign Out</button>
          </SignOutButton>
        )}

        {!user.isSignedIn && (
          <SignInButton mode="redirect">
            <button className="btn">Sign in</button>
          </SignInButton>
        )}

        <div>
          {data?.map((post) => (
            <div key={post.id}>
              <h1>{post.content}</h1>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
