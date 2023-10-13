"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/react-hook-form/form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Progress } from "./ui/progress";
import prisma from "@/lib/prisma";

export default function UploadForm({
  missions,
  screenshots,
}: {
  missions: any;
  screenshots: any;
}) {
  const router = useRouter();
  const { user } = useUser();

  const MAX_FILE_SIZE = 10000000;
  const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  const FormSchema = z.object({
    mission: z.string(),
    images: z.array(
      z
        .any()
        .refine(
          (file) => file?.size <= MAX_FILE_SIZE,
          `Max image size is 10MB.`
        )
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
          "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  async function uploadImages(files: any) {
    try {
      const imageInfo = []; // An array to store image information

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "qwaph5ad"); // Replace with your Cloudinary upload preset

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/denivusi1/image/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Extract width and height from the response
        const { secure_url, width, height } = response.data;

        imageInfo.push({ secure_url, width, height });
      }

      return imageInfo; // Return an array of objects containing secure URL, width, and height
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  }

  async function onSubmit(data: any) {
    try {
      setUploading(true);

      // Check the number of files uploaded
      if (data.images.length > 5) {
        toast({
          title: "Error",
          description: "You can upload a maximum of 3 files.",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      // Perform a check to see if the author has already uploaded 5 screenshosts for the selected mission
      const author = user?.username;
      const mission = data.mission;

      const authorScreenshots = screenshots.filter(
        (screenshot: any) => screenshot.author === author
      );

      const missionScreenshots = authorScreenshots.filter(
        (screenshot: any) => screenshot.title === mission
      );

      if (missionScreenshots.length + data.images.length > 3) {
        toast({
          title: "Error",
          description: `You can upload a maximum of 3 screenshots for the ${mission} mission.`,
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      const imageUrls = await uploadImages(data.images);
      setUploading(false);

      console.log("Data:", data);
      console.log("Image URLs:", imageUrls);

      const formData = {
        title: data.mission,
        description: data.description,
        author: author, // Use the author's username
        images: imageUrls,
      };

      // Make a POST request to your API endpoint
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Upload Successful! 🎉",
          description: "Thank you for participating!",
        });

        router.push("/");
      } else {
        toast({
          title: "Something went wrong.",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Something went wrong.",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    const uploadProgressListener = axios.interceptors.request.use((config) => {
      config.onUploadProgress = (progressEvent) => {
        if (progressEvent.total !== undefined) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(progress);
        }
      };
      return config;
    });

    return () => {
      axios.interceptors.request.eject(uploadProgressListener);
    };
  }, []);

  missions.sort(
    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleMissionChange = (selectedMission: any) => {
    form.setValue("mission", selectedMission);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="mission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mission</FormLabel>
              <FormControl>
                <Select name="mission" onValueChange={handleMissionChange}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a mission" />
                  </SelectTrigger>
                  <SelectContent>
                    {missions.map((mission: any) => (
                      <SelectItem
                        key={mission.id}
                        value={mission.name}
                        onClick={() => field.onChange(mission.name)}>
                        {`${format(
                          new Date(mission.date),
                          "MMMM dd, yyyy"
                        )} - ${mission.name}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Select the mission you want to upload screenshots for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple // Allow multiple file selection
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      const fileList = Array.from(files);

                      // Check file size here
                      const oversizedFiles = fileList.filter(
                        (file) => file.size > MAX_FILE_SIZE
                      );

                      if (oversizedFiles.length > 0) {
                        // Display an error message or handle the oversized files
                        toast({
                          title: "Error",
                          description: `The following files exceed the maximum size of 10MB: ${oversizedFiles
                            .map((file) => file.name)
                            .join(", ")}`,
                          variant: "destructive",
                        });
                        // Clear the input to prevent the user from submitting oversized files
                        e.target.value = "";
                      } else {
                        field.onChange(fileList);
                      }
                    }
                  }}
                />
              </FormControl>
              <FormDescription>Select one or more screenshots.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {uploading && (
          <Progress value={parseFloat(uploadProgress.toFixed(2))} />
        )}
        <Button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
