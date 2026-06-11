"use client";
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Shield,
  Swords,
  Clock,
  User,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Send,
  HeartPulse,
  Crosshair,
} from 'lucide-react'
import { LoadoutGrid } from '@/app/components/LoadoutGrid'
import { useSession } from 'next-auth/react'
import { Build, Category, Role } from '@/app/data/build';
import ReactMarkdown from 'react-markdown';
import BuildTimestamps from '@/app/components/BuildTimestamps';

interface BuildDetailProps {
  id: number
}

export function BuildDetail({ id }: BuildDetailProps) {
  const { data: session, status } = useSession();
  
  const [build, setBuild] = useState<Build | undefined>();
  console.log("Build:", build);
  useEffect(() => {
    async function b() {
      const build = await Build.getBuild(id);
      setBuild(build);
      setVotes(build!.votes);
    }
    b();
  }, []);

  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null)
  const [votes, setVotes] = useState(0)
  const [commentText, setCommentText] = useState('')
  const handleVote = (type: 'up' | 'down') => {
    if (!session) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('open-auth-modal'))
      }
      return
    }
    if (voteStatus === type) {
      // Remove vote
      setVoteStatus(null)
      setVotes(type === 'up' ? votes - 1 : votes + 1)
    } else {
      // Change or add vote
      const modifier = type === 'up' ? 1 : -1
      const previousModifier =
        voteStatus === 'up' ? -1 : voteStatus === 'down' ? 1 : 0
      setVoteStatus(type)
      setVotes(votes + modifier + previousModifier)
    }
  }
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('open-auth-modal'))
      }
      return
    }
    // Simulate comment submission
    setCommentText('')
  }
  const onLoginClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-auth-modal'))
    }
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
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-neutral-500" />
                <span>
                  By <span className="text-white font-medium">{build && build.submittedBy}</span>
                </span>
              </div>
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
                (1)
              </span>
            </h2>
          </div>

          {/* Comment Input */}
          <div className="mb-8">
            {session ? (
              <form onSubmit={handleCommentSubmit} className="relative">
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
                    disabled={true}
                    className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="rounded-xl bg-white/5 border border-white/10 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                    <User className="h-3 w-3 text-neutral-400" />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    Ela
                  </span>
                </div>
                <span className="text-xs text-neutral-500">1 day ago</span>
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed pl-8">
                Comments coming soon!
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  )
}
