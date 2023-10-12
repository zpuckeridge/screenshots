"use client";

import { ThumbsUp } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { toast } from "@/components/ui/use-toast";

export default function Vote({ data }: { data: any }) {
  const { user } = useUser();

  const votesArray = useMemo(() => {
    return Array.isArray(data.votes) ? data.votes : [];
  }, [data.votes]);
  const totalVotes = votesArray.length;

  const [voted, setVoting] = useState(votesArray.includes(user?.username));
  const [voteCasted, setVoteCasted] = useState(false); // State to track whether the user has cast their vote

  // Update voted state when data changes
  useEffect(() => {
    setVoting(votesArray.includes(user?.username));
  }, [data, user, votesArray]);

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

      // Update the totalVotes and set voteCasted to true
      setVoteCasted(true);

      toast({
        title: "You've cast your vote! 🎉",
        description: `Thank you for participating!`,
      });
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
      {/* Use voteCasted state to determine whether to display totalVotes + 1 */}
      {voteCasted ? <p>{totalVotes + 1} votes</p> : <p>{totalVotes} votes</p>}
      {voted ? (
        // Display the tooltip if the user has already voted
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <button disabled={voted} onClick={castVote}>
                <ThumbsUp
                  className="w-7 h-7 mr-2 text-blue-500"
                  strokeWidth={1.5}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>You have already upvoted this screenshot.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        // Display the voting button if the user has not voted
        <button disabled={voted} onClick={castVote}>
          <ThumbsUp
            className={`w-7 h-7 mr-2 ${voted ? "text-blue-500" : ""}`}
            strokeWidth={1.5}
          />
        </button>
      )}
    </div>
  );
}
