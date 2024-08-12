import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Card, Subtitle, Title } from "@tremor/react";
import Link from "next/link";

export const WhyITrackTimeDialog = ({ flow }: { flow: number }) => {
  return (
    <div className="p-5 flex items-center justify-center">
      <Dialog>
        <DialogTrigger>
          <div
            className={cn(
              " bg-blue-800 w-15 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
              {
                "bg-green-700  border-green-400 border-2": flow > 0.8334,
                "bg-purple-700 border-purple-400 border-2": flow > 1.5,
                "bg-red-700 border-red-400 border-2": flow > 2.5,
              }
            )}
          >
            See why I track my time
          </div>
        </DialogTrigger>
        <DialogContent>
          <Card className="flex max-w-md ">
            <div>
              <Title>Why I track my time?</Title>
              <br></br>
              <Subtitle>
                <strong>July 16, 2018: </strong>I was playing video games all
                day and then one day I realized that I wasn&apos;t able to
                recall anything I did in the last 2 months, I found that
                extremely unacceptable since I felt like my life was moving
                extremely fast. I started tracking my time because of that
              </Subtitle>
              <br></br>
              <Subtitle>
                this constant feedback feels like a sixth sense and reduces the
                original anxiety I had.
              </Subtitle>
              <Subtitle>
                <br></br>
                <strong>Today:</strong> time tracking allows me to have
                calculate my productive flow time, which I&apos;m currently
                maximizing for, and my unplanned time, which I&apos;m currently
                minimizing for. Both of these will get me to my goals.
              </Subtitle>
              <br></br>
              <Link
                href="https://tracker.haseab.workers.dev/?button=seeMore&campaign=timetracking.live&project=haseab-personal&redirect=https%3A%2F%2Fhaseab.com%2F"
                target="_blank"
                className={cn(
                  "bg-blue-800 hover:bg-blue-700 mt-4 text-white font-bold py-2 px-4 rounded border-gray-700",
                  {
                    "bg-green-700": flow > 0.8334,
                    "bg-purple-700": flow > 1.5,
                    "bg-red-700": flow > 2.5,
                  }
                )}
              >
                See more about me
              </Link>
            </div>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
};
