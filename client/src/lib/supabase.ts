import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Log config for debugging (remove in production)
if (typeof window !== "undefined") {
  console.log("Supabase URL:", supabaseUrl ? "✓ Set" : "✗ Missing");
  console.log("Supabase Key:", supabaseAnonKey?.startsWith("eyJ") ? "✓ Valid JWT" : "✗ Invalid format");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload a video file to Supabase Storage
 * @param file - The video file to upload
 * @param userId - The user's ID for organizing files
 * @returns The public URL of the uploaded video
 */
export async function uploadVerificationVideo(
  file: File,
  userId: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Validate config
    if (!supabaseUrl || !supabaseAnonKey) {
      return { url: null, error: "Supabase not configured" };
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `verification-videos/${fileName}`;

    console.log("Uploading to:", filePath, "Size:", (file.size / 1024 / 1024).toFixed(2), "MB");

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("artisan-verification")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { url: null, error: uploadError.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("artisan-verification")
      .getPublicUrl(filePath);

    console.log("Upload successful:", urlData.publicUrl);
    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    console.error("Video upload failed:", error);
    return { url: null, error: "Failed to upload video. Check your internet connection." };
  }
}

/**
 * Delete a verification video from Supabase Storage
 * @param videoUrl - The full URL of the video to delete
 */
export async function deleteVerificationVideo(
  videoUrl: string
): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = videoUrl.split("/artisan-verification/");
    if (urlParts.length < 2) return false;

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from("artisan-verification")
      .remove([filePath]);

    return !error;
  } catch (error) {
    console.error("Video deletion failed:", error);
    return false;
  }
}
