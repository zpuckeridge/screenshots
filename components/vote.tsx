"use client";

import { ThumbsUp } from "lucide-react";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/use-toast";

export default function Vote({ data }: { data: any }) {
  const router = useRouter();
  const { user } = useUser();

  const votesArray = Array.isArray(data.votes) ? data.votes : [];
  const totalVotes = votesArray.length;

  const [voted, setVoting] = useState(votesArray.includes(user?.username));

  async function castVote() {
    setVoting(true);

    try {
      await fetch("/api/vote", {
        method: "POST",
        body: JSON.stringify({
          id: data.id,
          username: user?.username,
        }),
      });

      setVoting(false);

      toast({
        title: "You've cast your vote! 🎉",
        description: `Thank-you for participating!`,
      });

      router.refresh();
    } catch (error) {
      console.error("Error casting vote:", error);
      setVoting(false);
      toast({
        title: "Something went wrong.",
        description: `Your vote was not counted. Please try again.`,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex gap-4 my-auto">
      <p>{totalVotes} votes</p>
      <button disabled={voted} onClick={castVote}>
        <ThumbsUp
          className={`w-7 h-7 mr-2 ${voted ? "text-blue-500" : ""}`}
          strokeWidth={1.5}
        />
      </button>
    </div>
  );
}
