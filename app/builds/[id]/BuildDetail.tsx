"use client";
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Send,
} from 'lucide-react'
import { LoadoutGrid } from '@/app/components/LoadoutGrid'
import { useSession } from 'next-auth/react'
import { Build, Category, Role } from '@/app/data/build';
import ReactMarkdown from 'react-markdown';
import BuildTimestamps from '@/app/components/BuildTimestamps';
import { getComments, getUserDetails, getVote, getVotes, IComment, IUser, VoteType } from '@/app/data/SupabaseHandler';
import Timestamp from '@/app/components/Timestamp';

interface BuildDetailProps {
  id: number
}

async function postComment(buildId: number, commentText: string) {
  try {
    const response = await fetch("/api/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        buildId: buildId,
        comment: commentText,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Something went wrong.");
      return false;
    }

    return true;

  } catch (error) {
    console.error("Failed to send comment request:", error);
    return false;
  }
}

export function BuildDetail({ id }: BuildDetailProps) {
  const { data: session, status } = useSession();
  
  const [build, setBuild] = useState<Build | undefined>();
  const [authorDetails, setAuthorDetails] = useState<IUser | undefined>();
  const [comments, setComments] = useState<IComment[]>([]);
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null)
  const [votes, setVotes] = useState(0)

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      const build = await Build.getBuild(id);
      setBuild(build);
      const pgv = getVotes(build!.id);
      const pgud = getUserDetails(build!.submittedBy);
      const pgc = getComments(id, 0, 10);
      const pgvu = getVote(build!.id, session?.user?.id || "");

      const [gv, gud, gc, gvu] = await Promise.all([pgv, pgud, pgc, pgvu]);

      setVotes(gv);
      setAuthorDetails(gud);
      setComments(gc);
      setVoteStatus(gvu == VoteType.NEUTRAL ? null : gvu == VoteType.PLUS ? "up" : "down");
    })();
  }, []);
  const [commentText, setCommentText] = useState('')
  const handleVote = (clickedType: 'up' | 'down') => {
    // 1. Session check and Auth Modal trigger
    if (!session) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('open-auth-modal'));
      }
      return;
    }

    // 2. Map the clicked button to its expected server Enum state
    const nextVoteEnum: VoteType = clickedType === voteStatus 
      ? VoteType.NEUTRAL 
      : clickedType === 'up' 
        ? VoteType.PLUS 
        : VoteType.MINUS;

    // 3. Calculate the math cleanly using structural mapping instead of nested ternaries
    let voteCountDifference = 0;

    if (voteStatus === clickedType) {
      // Undoing their current vote (e.g. clicking an active 'up' button)
      voteCountDifference = clickedType === 'up' ? -1 : 1;
    } else if (voteStatus !== null) {
      // Flipping their vote (e.g. changing 'up' to 'down' is a difference of -2)
      voteCountDifference = clickedType === 'up' ? 2 : -2;
    } else {
      // Fresh vote on a neutral build
      voteCountDifference = clickedType === 'up' ? 1 : -1;
    }

    // 4. Optimistic UI updates
    setVoteStatus(clickedType === voteStatus ? null : clickedType);
    setVotes((prevTotal) => prevTotal + voteCountDifference);

    // 5. Anti-spam Debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await fetch("/api/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            buildId: build!.id, 
            voteType: nextVoteEnum 
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to sync vote to database");
        } else {
          console.log("Updated database");
        }
      } catch (err) {
        console.error(err);
        // Optional: Roll back local states here if your API completely crashes
      }
    }, 800); // 800ms window to absorb spam clickers
  };
  const onLoginClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-auth-modal'))
    }
  }
  const handleCommentSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const success = await postComment(build!.id, commentText);
    setCommentText("");
    if (success) setComments(await getComments(2, 0, 10));
  }
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-100 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-orange-500/4 via-transparent to-transparent" />
      </div>

      <main className="relative z-10 mx-auto max-w-4xl px-6 py-12 md:py-16 container">
        {/* Back link */}
        <motion.div
          initial={{
            opacity: 0,
            x: -10,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="mb-8"
        >
          <a
            href="/builds"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Builds
          </a>
        </motion.div>

        {/* Header Section */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10"
        >
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 text-xs font-medium text-orange-400">
                {build && Role[build?.role as keyof typeof Role]}
              </span>
              <span className="inline-flex items-center rounded-md bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-medium text-neutral-300">
                {build && Category[build?.category as keyof typeof Category][0]}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              {build?.name}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
              {
                authorDetails &&
                <div className="flex items-center gap-1.5">
                  <img src={authorDetails.imageUrl} className="h-3.5 w-3.5 rounded-full" />
                  <span>
                    By <span className="text-white font-medium">{authorDetails.name}</span>
                  </span>
                </div>
              }
              {build && <BuildTimestamps build={build} />}
            </div>
          </div>

          {/* Voting */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 shrink-0">
            <button
              onClick={() => handleVote('up')}
              className={`cursor-pointer flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${voteStatus === 'up' ? 'bg-orange-500/20 text-orange-400' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
              title={!session ? 'Sign in to vote' : 'Upvote'}
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <div className="flex h-10 min-w-12 items-center justify-center font-bold text-white">
              {votes}
            </div>
            <button
              onClick={() => handleVote('down')}
              className={`cursor-pointer flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${voteStatus === 'down' ? 'bg-red-500/20 text-red-400' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
              title={!session ? 'Sign in to vote' : 'Downvote'}
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Interactive Loadout Grid */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
        >
          <LoadoutGrid build={build} />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.2,
          }}
          className="mb-12"
        >
          <h2 className="text-lg font-bold text-white mb-4">How to Play</h2>
          <div className="rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
            <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-p:text-neutral-300 prose-strong:text-white prose-strong:font-semibold">
              
              <ReactMarkdown>
                {build?.description}
              </ReactMarkdown>

            </div>
          </div>
        </motion.div>

        {/* Comments */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.3,
          }}
        >
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-bold text-white">
              Comments{' '}
              <span className="text-neutral-500 text-sm font-normal ml-1">
                ({comments.length})
              </span>
            </h2>
          </div>

          {/* Comment Input */}
          <div className="mb-8">
            {session ? (
              <form className="relative" onSubmit={handleCommentSubmit}>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts on this build..."
                  rows={3}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-4 text-sm text-white placeholder:text-neutral-500 outline-none transition-all focus:border-orange-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-orange-500/20 resize-none"
                />
                <div className="absolute bottom-4 right-4">
                  <button
                    type="submit"
                    disabled={commentText.length == 0}
                    className="cursor-pointer flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Post
                  </button>
                </div>
              </form>
            ) : (
              <div className="rounded-xl bg-white/5 border border-white/10 p-6 text-center">
                <p className="text-sm text-neutral-400 mb-3">
                  You must be logged in to leave a comment.
                </p>
                <button
                  onClick={onLoginClick}
                  className="inline-flex items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20 px-4 py-2 text-sm font-semibold text-orange-400 hover:bg-orange-500 hover:text-white transition-all"
                >
                  Log in to Comment
                </button>
              </div>
            )}
          </div>

          {/* Comment List */}
          <div className="space-y-4">
            {comments.map(comment => 
            <div key={comment.id} className="rounded-xl bg-white/5 border border-white/10 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                    <img src={comment.author.image_url} className="h-6 w-6 rounded-full" />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {comment.author.name}
                  </span>
                </div>
                <Timestamp date={new Date(comment.created_at)} />
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed pl-8">
                {comment.comment}
              </p>
            </div>)}
          </div>
        </motion.div>
      </main>
    </>
  )
}
