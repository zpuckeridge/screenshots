"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

const MAX_FILE_SIZE = 10000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const FormSchema = z.object({
  title: z.string().max(50, {
    message: "Title must be at most 50 characters.",
  }),
  images: z.array(
    z
      .any()
      .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 10MB.`)
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported.",
      ),
  ),
});

export default function UploadForm() {
  const router = useRouter();
  const { user } = useUser();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [uploading, setUploading] = useState(false);

  async function uploadImages(files: any) {
    try {
      const imageUrls = [];
      const formData = new FormData();

      for (const file of files) {
        formData.append("file", file);
        formData.append("upload_preset", "qwaph5ad"); // Replace with your Cloudinary upload preset

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/denivusi1/image/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        imageUrls.push(response.data.secure_url);
      }

      return imageUrls; // Return an array of secure URLs
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  }

  async function onSubmit(data: any) {
    try {
      setUploading(true);
      const imageUrls = await uploadImages(data.images);
      setUploading(false);

      console.log("Data:", data);
      console.log("Image URLs:", imageUrls);

      const formData = {
        title: data.title,
        description: data.description,
        author: user?.username,
        images: imageUrls, // Use the array of image URLs
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
        const createdRecord = await response.json();
        toast({
          title: "You submitted the following values:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(createdRecord, null, 2)}
              </code>
            </pre>
          ),
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mission Name</FormLabel>
              <FormControl>
                <Input placeholder="It's time to nuke 'em gents" {...field} />
              </FormControl>
              <FormDescription>
                Enter the mission name or title. This will be added to all of
                your uploaded screenshots.
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
                        (file) => file.size > MAX_FILE_SIZE,
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
        <Button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
