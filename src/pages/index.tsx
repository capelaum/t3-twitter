import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { toast } from "react-hot-toast";
import { Layout } from "~/components/Layout";
import { LoadingPage, LoadSpinner } from "~/components/LoadSpinner";
import { PostView } from "~/components/PostView";
import { api } from "~/utils/api";

const CreatePostWizard = () => {
  const [input, setInput] = useState("");

  const { user } = useUser();

  const ctx = api.useContext();

  const { mutate: createPost, isLoading: isCreatingPost } =
    api.posts.create.useMutation({
      onSuccess: () => {
        setInput("");

        void ctx.posts.getAll.refetch();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;

        if (errorMessage && errorMessage[0]) {
          toast.error(errorMessage[0]);
          return;
        }

        toast.error("Failed to post... Try again later.");
      },
    });

  if (!user) return null;

  const handleCreatePost = () => {
    createPost({
      content: input,
    });
  };

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCreatePost();
  };

  return (
    <div className="flex w-full items-center gap-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile Image"
        className="rounded-full"
        width={56}
        height={56}
        placeholder="blur"
        blurDataURL={user.profileImageUrl}
      />

      <form
        onSubmit={handleOnSubmit}
        className="gap-3w-full flex w-full items-center "
      >
        <input
          type="text"
          placeholder="Type some emojis!"
          className="grow rounded-sm  bg-transparent px-2 py-1 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isCreatingPost}
        />

        {isCreatingPost ? (
          <LoadSpinner size={24} />
        ) : (
          <button
            type="submit"
            className="rounded-full bg-sky-500 px-5 py-1 font-semibold text-white"
            disabled={isCreatingPost}
          >
            Post
          </button>
        )}
      </form>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsIsLoading } = api.posts.getAll.useQuery();

  if (postsIsLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong...</div>;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        {data?.map((fullPost) => (
          <PostView key={fullPost.post.id} {...fullPost} />
        ))}
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery();

  if (!userLoaded) return null;

  return (
    <Layout>
      <div className="flex items-center gap-4 border-b border-slate-700 p-4">
        {!isSignedIn && (
          <SignInButton mode="redirect">
            <button className="flex justify-center rounded-md bg-slate-100 py-1 px-2 text-sm font-medium text-slate-900">
              Sign in
            </button>
          </SignInButton>
        )}

        {/* {!!user.isSignedIn && (
              <SignOutButton>
                <button className="flex justify-center rounded-md bg-slate-100 py-1 px-2 text-sm font-medium text-slate-900">
                  Sign Out
                </button>
              </SignOutButton>
            )} */}

        {!!isSignedIn && <CreatePostWizard />}
      </div>

      <Feed />
    </Layout>
  );
};

export default Home;
